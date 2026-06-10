"""사진 파일을 일괄 압축·리사이즈한다.
하위 디렉토리 구조를 그대로 유지하며 출력 디렉토리에 저장한다.
PNG 파일 중 투명도가 없는 것은 JPG로 변환한다.

사용법:
    python scripts/compress_images.py <원본디렉토리> <출력디렉토리> [옵션]

옵션:
    --max-width  최대 가로 픽셀 (기본 1600)
    --quality    JPG 압축 품질 0~95 (기본 80)

예시:
    python scripts/compress_images.py ./raw_photos ./compressed --max-width 1600 --quality 80
"""

import argparse
import os
import sys

# Pillow 설치 여부 확인 — 없으면 친절한 안내 후 종료
try:
    from PIL import Image, ImageOps
except ImportError:
    print("오류: Pillow 라이브러리가 설치되어 있지 않습니다.")
    print("아래 명령으로 설치 후 다시 실행하세요:")
    print()
    print("    pip install Pillow")
    print()
    sys.exit(1)

# 처리 대상 확장자
SUPPORTED_EXTS = {".jpg", ".jpeg", ".png"}


def compress_image(src_path, dst_path, max_width, quality):
    """이미지 한 장을 압축·리사이즈해서 dst_path에 저장한다.
    반환값: (원본 바이트, 결과 바이트) 튜플.
    """
    src_size = os.path.getsize(src_path)

    with Image.open(src_path) as img:
        # EXIF 회전 정보 반영 (스마트폰 사진에 자주 필요)
        img = ImageOps.exif_transpose(img)

        ext = os.path.splitext(src_path)[1].lower()
        is_png = ext == ".png"

        # PNG 투명도(알파 채널) 확인
        has_alpha = img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        )

        # 저장 포맷 결정: 투명도 없는 PNG → JPG 변환
        if is_png and not has_alpha:
            save_format = "JPEG"
            # 알파 채널 없이 RGB 변환 (팔레트 모드 등 대비)
            if img.mode != "RGB":
                img = img.convert("RGB")
            dst_path = os.path.splitext(dst_path)[0] + ".jpg"
        elif is_png and has_alpha:
            save_format = "PNG"
        else:
            save_format = "JPEG"
            if img.mode != "RGB":
                img = img.convert("RGB")

        # 가로 크기가 max_width를 초과하면 비율 유지하며 축소
        w, h = img.size
        if w > max_width:
            new_h = int(h * max_width / w)
            img = img.resize((max_width, new_h), Image.LANCZOS)

        # 출력 디렉토리 생성
        os.makedirs(os.path.dirname(dst_path), exist_ok=True)

        save_kwargs = {"optimize": True}
        if save_format == "JPEG":
            save_kwargs["quality"] = quality

        img.save(dst_path, format=save_format, **save_kwargs)

    dst_size = os.path.getsize(dst_path)
    return src_size, dst_size, dst_path


def main():
    parser = argparse.ArgumentParser(
        description="이미지 일괄 압축·리사이즈 스크립트"
    )
    parser.add_argument("src_dir",  help="원본 이미지 디렉토리")
    parser.add_argument("dst_dir",  help="출력 디렉토리")
    parser.add_argument("--max-width", type=int, default=1600,
                        help="최대 가로 픽셀 (기본: 1600)")
    parser.add_argument("--quality",   type=int, default=80,
                        help="JPG 압축 품질 0~95 (기본: 80)")
    args = parser.parse_args()

    src_dir = os.path.abspath(args.src_dir)
    dst_dir = os.path.abspath(args.dst_dir)

    if not os.path.isdir(src_dir):
        print(f"오류: 원본 디렉토리를 찾을 수 없습니다 → {src_dir}")
        sys.exit(1)

    total_src_bytes = 0
    total_dst_bytes = 0
    processed = 0
    skipped = 0

    # 하위 디렉토리까지 순회
    for dirpath, _, filenames in os.walk(src_dir):
        for fname in filenames:
            ext = os.path.splitext(fname)[1].lower()

            if ext not in SUPPORTED_EXTS:
                if ext:  # 확장자가 있는데 미지원 포맷
                    rel = os.path.relpath(os.path.join(dirpath, fname), src_dir)
                    print(f"[건너뜀] 미지원 포맷: {rel}")
                skipped += 1
                continue

            src_path = os.path.join(dirpath, fname)
            # 하위 디렉토리 구조 유지
            rel_path = os.path.relpath(src_path, src_dir)
            dst_path = os.path.join(dst_dir, rel_path)

            try:
                src_bytes, dst_bytes, actual_dst = compress_image(
                    src_path, dst_path, args.max_width, args.quality
                )
            except Exception as e:
                print(f"[오류] {rel_path}: {e}")
                skipped += 1
                continue

            saving_pct = (1 - dst_bytes / src_bytes) * 100 if src_bytes else 0
            actual_rel = os.path.relpath(actual_dst, dst_dir)
            print(
                f"  {rel_path} → {actual_rel}  "
                f"({src_bytes // 1024}KB → {dst_bytes // 1024}KB, "
                f"{saving_pct:.0f}% 절감)"
            )

            total_src_bytes += src_bytes
            total_dst_bytes += dst_bytes
            processed += 1

    print()
    print(f"완료: {processed}장 처리, {skipped}장 건너뜀")
    if total_src_bytes:
        total_saving = (1 - total_dst_bytes / total_src_bytes) * 100
        print(
            f"전체 용량: {total_src_bytes // 1024}KB → "
            f"{total_dst_bytes // 1024}KB  ({total_saving:.0f}% 절감)"
        )


if __name__ == "__main__":
    main()
