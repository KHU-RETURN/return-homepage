#!/usr/bin/env bash
# RETURN 홈페이지 배포 스크립트 (서버에서 실행: bash deploy.sh)
#
# - 처음 실행(zip으로 설치한 상태): .env.production / DB / 업로드 파일을 보존한 뒤
#   git clone으로 코드를 통째로 교체한다.
# - 이후 실행(git clone 상태): git pull로 최신 코드만 받아온다.
# - 공통: 의존성 설치 → 프런트 빌드 → 시드(멱등) → 서비스 재시작
set -euo pipefail

REPO_URL="https://github.com/KHU-RETURN/return-homepage.git" # ← 실제 저장소 주소로 수정
APP_DIR="$HOME/return-hompage"

# 코드를 교체해도 지키고 싶은 것들 (git이 관리하지 않는 운영 데이터)
KEEP=(backend/.env.production backend/return.db backend/uploads)

if [ -d "$APP_DIR/.git" ]; then
  echo "[1/5] git pull로 최신 코드 받기"
  git -C "$APP_DIR" pull
else
  echo "[1/5] git 저장소가 아님 → 운영 데이터 보존 후 새로 clone"
  TMP_KEEP=$(mktemp -d)
  for f in "${KEEP[@]}"; do
    if [ -e "$APP_DIR/$f" ]; then
      mkdir -p "$TMP_KEEP/$(dirname "$f")"
      cp -r "$APP_DIR/$f" "$TMP_KEEP/$f"
    fi
  done
  rm -rf "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR"
  for f in "${KEEP[@]}"; do
    if [ -e "$TMP_KEEP/$f" ]; then
      mkdir -p "$APP_DIR/$(dirname "$f")"
      cp -r "$TMP_KEEP/$f" "$APP_DIR/$f"
    fi
  done
  rm -rf "$TMP_KEEP"
fi

echo "[2/5] 백엔드 의존성 설치"
cd "$APP_DIR/backend"
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install -q -r requirements.txt

echo "[3/5] 프런트 빌드"
cd "$APP_DIR/frontend"
npm install
npm run build

echo "[4/5] 시드 데이터 반영 (이미 있는 항목은 건너뜀)"
cd "$APP_DIR/backend"
if [ -f .env.production ]; then
  set -a
  source .env.production
  set +a
  .venv/bin/python seed.py
else
  echo "  경고: backend/.env.production 없음 — 시드를 건너뜁니다. 파일을 만든 뒤 다시 실행하세요."
fi

echo "[5/5] 서비스 재시작"
sudo systemctl restart return

echo "배포 완료. 상태 확인:"
systemctl status return --no-pager | head -5
