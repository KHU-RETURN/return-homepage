#!/usr/bin/env bash
# RETURN 홈페이지 배포 스크립트. 서버에서: ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "[1/4] 최신 코드 받기"
git pull

echo "[2/4] 프런트 빌드"
cd frontend && npm install && npm run build && cd ..

echo "[3/4] 백엔드 의존성 설치"
backend/.venv/bin/pip install -r backend/requirements.txt

echo "[4/4] 서비스 재시작"
sudo systemctl restart return

echo "배포 완료. 상태 확인: systemctl status return"
