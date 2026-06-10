from app.auth import hash_password
from app.models import User

PASSWORD = "password123"


def make_user(db, username="member1", approved=True, role="member"):
    user = User(
        username=username,
        password_hash=hash_password(PASSWORD),
        name="테스트회원",
        student_id="2026123456",
        role=role,
        is_approved=approved,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_가입_성공시_미승인_상태(client):
    response = client.post("/api/auth/signup", json={
        "username": "newbie01",
        "password": "password123",
        "name": "신입생",
        "student_id": "2026000001",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newbie01"
    assert data["is_approved"] is False
    assert data["role"] == "member"
    assert "password" not in data and "password_hash" not in data


def test_가입_아이디_중복시_409(client, db_session):
    make_user(db_session, username="dupuser1")
    response = client.post("/api/auth/signup", json={
        "username": "dupuser1",
        "password": "password123",
        "name": "중복이",
        "student_id": "2026000002",
    })
    assert response.status_code == 409


def test_미승인_회원_로그인_403(client, db_session):
    make_user(db_session, username="pending1", approved=False)
    response = client.post("/api/auth/login", json={
        "username": "pending1", "password": PASSWORD,
    })
    assert response.status_code == 403


def test_승인_회원_로그인후_me_조회(client, db_session):
    make_user(db_session, username="member1", approved=True)
    response = client.post("/api/auth/login", json={
        "username": "member1", "password": PASSWORD,
    })
    assert response.status_code == 200
    assert "access_token" in response.cookies

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["username"] == "member1"


def test_틀린_비밀번호_401(client, db_session):
    make_user(db_session, username="member2", approved=True)
    response = client.post("/api/auth/login", json={
        "username": "member2", "password": "wrong-password",
    })
    assert response.status_code == 401


def test_비로그인_me_401(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
