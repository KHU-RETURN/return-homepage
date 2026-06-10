#!/usr/bin/env bash
# 프로젝트 배포 ZIP 생성 스크립트
# 사용법: bash make_zip.sh   (프로젝트 루트에서 실행)
# 출력:   ~/Desktop/return-homepage.zip

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP_PATH="$HOME/Desktop/return-homepage.zip"

# 기존 zip 덮어쓰기
if [ -f "$ZIP_PATH" ]; then
    echo "기존 zip 삭제 중: $ZIP_PATH"
    rm -f "$ZIP_PATH"
fi

echo "ZIP 생성 중: $ZIP_PATH"

cd "$SCRIPT_DIR"

zip -r "$ZIP_PATH" . \
    --exclude ".git/*" \
    --exclude "*/node_modules/*" \
    --exclude "*/.venv/*" \
    --exclude "data" \
    --exclude "data/*" \
    --exclude "미커밋" \
    --exclude "미커밋/*" \
    --exclude "*.db" \
    --exclude "*/uploads/*" \
    --exclude "*/dist/*" \
    --exclude "*/__pycache__/*" \
    --exclude "*/.DS_Store" \
    --exclude ".DS_Store" \
    --exclude "*/qa-screenshots/*"

echo ""
echo "── 검증: seed_data/photos 포함 여부 확인 ──"
PHOTO_COUNT=$(unzip -l "$ZIP_PATH" | grep -c "seed_data/photos/" || true)
if [ "$PHOTO_COUNT" -gt 0 ]; then
    echo "OK: seed_data/photos/ 파일 ${PHOTO_COUNT}개 포함됨"
else
    echo "경고: seed_data/photos/ 파일이 zip에 없습니다!"
    exit 1
fi

echo ""
echo "── 용량 ──"
du -h "$ZIP_PATH"
echo ""
echo "완료: $ZIP_PATH"
