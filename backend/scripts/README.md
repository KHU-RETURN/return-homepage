# RETURN 홈페이지 — scripts/ 안내

`seed.py` 하나로 admin 계정·수상·활동·공지·사진 게시글을 모두 넣는 새 체계입니다.
`scripts/` 에는 **사진 압축** 도구만 남아 있습니다.

---

## 데이터 구조

```
backend/
├── seed.py                    ← 단일 시드 스크립트 (이것만 실행)
└── seed_data/
    ├── awards.json            ← 수상 내역
    ├── activities.json        ← 활동 목록
    ├── posts.json             ← 공지 게시글
    ├── photos_manifest.json   ← 사진 그룹 → 게시글 매핑
    └── photos/
        ├── 2019-단체/
        ├── 2022-단체/
        ├── 2023-mt/
        ├── 2023-ot/
        └── 2024-행사/
```

---

## 사진 추가 절차

### 1. 사진 압축 (권장)

원본 사진이 크면 먼저 압축합니다. Pillow가 필요합니다.

```bash
# backend/ 에서 실행
.venv/bin/pip install Pillow   # 최초 1회

.venv/bin/python scripts/compress_images.py <원본폴더> seed_data/photos/<그룹명>
# 옵션 예시 (최대 가로 1600px, JPG 품질 80)
.venv/bin/python scripts/compress_images.py ./raw_photos seed_data/photos/2025-행사 --max-width 1600 --quality 80
```

### 2. seed_data/photos/에 파일 배치

압축된 파일을 `seed_data/photos/<그룹명>/` 안에 넣습니다.

### 3. photos_manifest.json에 그룹 추가

`seed_data/photos_manifest.json` 에 항목을 하나 추가합니다.

```json
{
  "group": "2025-행사",
  "title": "2025-1 봄 단체 행사",
  "date": "2025-04-10",
  "description": "벚꽃 피던 날 찍은 단체 사진",
  "files": [
    "photos/2025-행사/photo1.jpg",
    "photos/2025-행사/photo2.jpg"
  ]
}
```

| 필드 | 설명 |
|------|------|
| `group` | 폴더 이름 (고유해야 함) |
| `title` | 게시글 제목 |
| `date` | 촬영일 `YYYY-MM-DD` |
| `description` | 게시글 본문으로 사용할 한두 줄 설명 |
| `files` | `seed_data/` 기준 상대경로 목록 |

### 4. seed.py 실행

- **DB를 밀지 않고 새 그룹만 추가**하려면 그냥 실행합니다.
  이미 있는 게시글은 건너뛰므로 중복 없이 안전합니다.

  ```bash
  cd backend
  .venv/bin/python seed.py
  ```

- **처음부터 새로 넣으려면** DB와 uploads를 먼저 지우고 실행합니다.
  아래 "서버 전체 리셋 절차"를 참고하세요.

---

## 서버 전체 리셋 절차 (프로덕션)

```bash
# 1. 서비스 중단
systemctl stop return

# 2. 기존 DB와 업로드 파일 삭제
rm -f return.db
rm -rf uploads

# 3. 환경변수 소싱 (운영 계정·비밀번호 등)
source /etc/return/env.sh   # 또는 .env 파일 경로에 맞게 조정

# 4. 시드 실행
cd /path/to/return-homepage/backend
.venv/bin/python seed.py

# 5. 서비스 재시작
systemctl start return
```

> **주의**: `RETURN_ADMIN_USERNAME` / `RETURN_ADMIN_PASSWORD` 환경변수를 반드시
> 소싱한 뒤 seed.py를 실행해야 운영 계정으로 생성됩니다.
> 환경변수 없이 실행하면 기본값(`admin` / `changeme`)이 적용됩니다.

---

## awards.json / activities.json / posts.json 형식

### awards.json

```json
[
  {
    "title": "대상",
    "competition": "경희대 SW 페스티벌",
    "winners": "홍길동, 김철수",
    "awarded_on": "2025-11-20",
    "description": "동아리 팀 프로젝트로 대상을 수상하였습니다."
  }
]
```

### activities.json

```json
[
  {
    "kind": "study",
    "title": "알고리즘 스터디",
    "description": "매주 백준 문제를 풀고 풀이를 공유합니다.",
    "semester": "2025-2"
  }
]
```

`kind` 값: `"study"` | `"group"` | `"mt"`

### posts.json

```json
[
  {
    "board": "notice",
    "title": "공지 제목",
    "content": "본문 내용",
    "created_at": "2026-06-01"
  }
]
```

`board` 값: `"notice"` | `"question"` | `"resource"`

---

## Pillow 설치 (compress_images.py 전용)

```bash
.venv/bin/pip install Pillow
```

Pillow는 `requirements.txt`에 포함되지 않습니다.
압축 스크립트는 로컬에서만 사용합니다.
