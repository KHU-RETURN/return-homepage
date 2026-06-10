"""실데이터 시드. 사용법: .venv/bin/python seed.py
DB를 밀고 다시 실행해도 되고, 밀지 않고 실행해도 중복 삽입 없이 안전하다(멱등).
"""
import datetime
import json
import os
import shutil
import sys
import uuid

# ── 실행 위치와 무관하게 backend/ 기준으로 동작하도록 경로 보정 ──────────────
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)
os.chdir(_BACKEND_DIR)  # SQLite 상대경로(./return.db, uploads/)의 기준을 맞춘다

from app import config
from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Activity, Attachment, Award, Post, User

# seed_data/ 디렉토리 (이 파일과 같은 위치)
_SEED_DIR = os.path.join(_BACKEND_DIR, "seed_data")


def _load_json(filename):
    """seed_data/<filename>을 읽어 반환. 없으면 빈 리스트."""
    path = os.path.join(_SEED_DIR, filename)
    if not os.path.exists(path):
        print(f"[경고] {filename} 없음 — 건너뜁니다")
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    # 테이블 없으면 생성
    Base.metadata.create_all(engine)
    db = SessionLocal()

    # ── 1. admin 계정 ─────────────────────────────────────────────────────────
    # config.ADMIN_USERNAME / ADMIN_PASSWORD (환경변수로 교체 가능)
    existing_admin = db.query(User).filter(
        User.username == config.ADMIN_USERNAME
    ).first()
    if existing_admin is None:
        admin = User(
            username=config.ADMIN_USERNAME,
            password_hash=hash_password(config.ADMIN_PASSWORD),
            name="운영진",
            student_id="0000000000",
            role="admin",
            is_approved=True,
        )
        db.add(admin)
        db.commit()
        print(f"admin 계정 생성 완료 (username: {config.ADMIN_USERNAME})")
    else:
        print(f"admin 계정: 이미 있어 건너뜀 ({config.ADMIN_USERNAME})")

    # 이후 게시글 작성자로 사용할 admin 객체
    admin = db.query(User).filter(User.username == config.ADMIN_USERNAME).first()

    # ── 2. 수상 내역 (awards.json) ────────────────────────────────────────────
    awards_data = _load_json("awards.json")
    added_awards = 0
    for item in awards_data:
        exists = (
            db.query(Award)
            .filter(
                Award.title == item["title"],
                Award.competition == item["competition"],
            )
            .first()
        )
        if exists:
            continue  # 이미 있으면 건너뜀 (멱등)

        db.add(Award(
            title=item["title"],
            competition=item["competition"],
            winners=item.get("winners", ""),
            awarded_on=datetime.date.fromisoformat(item["awarded_on"]),
            description=item.get("description", ""),
        ))
        added_awards += 1

    db.commit()
    print(f"수상 {added_awards}건 추가 (전체 {len(awards_data)}건 중 신규)")

    # ── 3. 활동 목록 (activities.json) ───────────────────────────────────────
    activities_data = _load_json("activities.json")
    added_activities = 0
    for item in activities_data:
        exists = (
            db.query(Activity)
            .filter(
                Activity.kind == item["kind"],
                Activity.title == item["title"],
                Activity.semester == item["semester"],
            )
            .first()
        )
        if exists:
            continue

        db.add(Activity(
            kind=item["kind"],
            title=item["title"],
            description=item.get("description", ""),
            semester=item["semester"],
        ))
        added_activities += 1

    db.commit()
    print(f"활동 {added_activities}건 추가 (전체 {len(activities_data)}건 중 신규)")

    # ── 4. 게시글 (posts.json) ───────────────────────────────────────────────
    posts_data = _load_json("posts.json")
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    added_posts = 0
    for item in posts_data:
        exists = (
            db.query(Post)
            .filter(Post.board == item["board"], Post.title == item["title"])
            .first()
        )
        if exists:
            continue

        # created_at: "YYYY-MM-DD" 문자열을 datetime으로 변환
        created_at = None
        if "created_at" in item:
            created_at = datetime.datetime.fromisoformat(item["created_at"])

        post = Post(
            board=item["board"],
            title=item["title"],
            content=item.get("content", ""),
            author_id=admin.id,
        )
        if created_at is not None:
            post.created_at = created_at

        db.add(post)
        db.flush()  # post.id 확보

        added_posts += 1

    db.commit()
    print(f"게시글 {added_posts}건 추가 (전체 {len(posts_data)}건 중 신규)")

    # ── 5. 사진 게시글 (photos_manifest.json) ────────────────────────────────
    # 각 그룹 → notice 게시판 게시글 1개 + 사진 파일들을 첨부파일로 등록
    # ※ notice는 비로그인 사용자도 열람 가능(공개). resource는 승인 회원 전용.
    manifest_path = os.path.join(_SEED_DIR, "photos_manifest.json")
    if os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)
    else:
        manifest = []
        print("[경고] photos_manifest.json 없음 — 사진 게시글 건너뜁니다")

    added_photo_posts = 0
    for entry in manifest:
        title = entry["title"]

        exists = (
            db.query(Post)
            .filter(Post.board == "notice", Post.title == title)
            .first()
        )
        if exists:
            continue  # 이미 있으면 건너뜀

        # 본문: manifest description을 바탕으로 1~2문장 생성
        content = entry.get("description", "")
        if content and not content.endswith("."):
            content += "."

        # created_at: manifest의 date 필드
        created_at = datetime.datetime.fromisoformat(entry["date"])

        post = Post(
            board="notice",
            title=title,
            content=content,
            author_id=admin.id,
            created_at=created_at,
        )
        db.add(post)
        db.flush()  # post.id 확보

        # 사진 파일을 UPLOAD_DIR로 uuid 이름으로 복사 후 Attachment 등록
        for rel_path in entry.get("files", []):
            src = os.path.join(_SEED_DIR, rel_path)
            if not os.path.exists(src):
                print(f"  [첨부 경고] 파일 없음, 건너뜀: {src}")
                continue

            original_name = os.path.basename(src)
            ext = os.path.splitext(original_name)[1]
            stored_name = uuid.uuid4().hex + ext
            dst = os.path.join(config.UPLOAD_DIR, stored_name)

            shutil.copy2(src, dst)
            db.add(Attachment(
                filename=original_name,
                stored_name=stored_name,
                post_id=post.id,
            ))

        added_photo_posts += 1

    db.commit()
    print(f"사진 게시글 {added_photo_posts}건 추가 (전체 {len(manifest)}건 중 신규)")

    db.close()
    print("\n시드 완료.")
