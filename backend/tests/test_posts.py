from app.auth import hash_password
from app.models import Post, User

PASSWORD = "password123"


def make_user(db, username, approved=True, role="member"):
    user = User(
        username=username,
        password_hash=hash_password(PASSWORD),
        name=f"{username}님",
        student_id="2026123456",
        role=role,
        is_approved=approved,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login(client, username):
    response = client.post("/api/auth/login", json={
        "username": username, "password": PASSWORD,
    })
    assert response.status_code == 200


def make_post(db, author, board="question", title="제목", content="내용"):
    post = Post(board=board, title=title, content=content, author_id=author.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def test_notice_목록_비로그인_공개(client, db_session):
    admin = make_user(db_session, "admin1", role="admin")
    make_post(db_session, admin, board="notice", title="공지입니다")

    response = client.get("/api/posts", params={"board": "notice"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "공지입니다"
    assert data[0]["author_name"] == admin.name


def test_question_목록_비로그인_401(client):
    response = client.get("/api/posts", params={"board": "question"})
    assert response.status_code == 401


def test_없는_board_거부(client):
    response = client.get("/api/posts", params={"board": "free"})
    assert response.status_code in (400, 422)


def test_승인회원_글작성_201(client, db_session):
    make_user(db_session, "writer1")
    login(client, "writer1")

    response = client.post("/api/posts", json={
        "board": "question", "title": "질문 있어요", "content": "본문입니다",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["board"] == "question"
    assert data["author_name"] == "writer1님"
    assert data["comments"] == []
    assert data["attachments"] == []


def test_미승인회원_글작성_403(client, db_session):
    user = make_user(db_session, "pending1", approved=False)
    # 미승인 회원은 로그인이 막혀 있으므로 토큰을 직접 만들어 쿠키에 넣는다
    from app.auth import create_access_token
    client.cookies.set("access_token", create_access_token(user.id))

    response = client.post("/api/posts", json={
        "board": "question", "title": "질문", "content": "본문",
    })
    assert response.status_code == 403


def test_notice_작성은_admin만(client, db_session):
    make_user(db_session, "member1")
    make_user(db_session, "admin1", role="admin")

    login(client, "member1")
    response = client.post("/api/posts", json={
        "board": "notice", "title": "공지", "content": "본문",
    })
    assert response.status_code == 403

    login(client, "admin1")
    response = client.post("/api/posts", json={
        "board": "notice", "title": "공지", "content": "본문",
    })
    assert response.status_code == 201


def test_타인글_수정_403_본인_수정_200(client, db_session):
    owner = make_user(db_session, "owner1")
    make_user(db_session, "other1")
    post = make_post(db_session, owner)

    login(client, "other1")
    response = client.put(f"/api/posts/{post.id}", json={
        "title": "수정", "content": "수정 본문",
    })
    assert response.status_code == 403

    login(client, "owner1")
    response = client.put(f"/api/posts/{post.id}", json={
        "title": "수정", "content": "수정 본문",
    })
    assert response.status_code == 200
    assert response.json()["title"] == "수정"


def test_본인글_삭제_204(client, db_session):
    owner = make_user(db_session, "owner1")
    post = make_post(db_session, owner)

    login(client, "owner1")
    response = client.delete(f"/api/posts/{post.id}")
    assert response.status_code == 204
    assert client.get(f"/api/posts/{post.id}").status_code == 404


def test_댓글_작성과_삭제(client, db_session):
    owner = make_user(db_session, "owner1")
    post = make_post(db_session, owner)

    login(client, "owner1")
    response = client.post(f"/api/posts/{post.id}/comments", json={
        "content": "첫 댓글",
    })
    assert response.status_code == 201
    comment = response.json()
    assert comment["content"] == "첫 댓글"
    assert comment["author_name"] == "owner1님"

    detail = client.get(f"/api/posts/{post.id}").json()
    assert len(detail["comments"]) == 1

    response = client.delete(f"/api/comments/{comment['id']}")
    assert response.status_code == 204
    detail = client.get(f"/api/posts/{post.id}").json()
    assert detail["comments"] == []


def test_없는글_상세_404(client, db_session):
    make_user(db_session, "member1")
    login(client, "member1")
    response = client.get("/api/posts/9999")
    assert response.status_code == 404
