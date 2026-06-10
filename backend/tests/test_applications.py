from app.models import Application

VALID = {
    "name": "신입생",
    "student_id": "2026000000",
    "phone": "010-1234-5678",
    "email": "freshman@khu.ac.kr",
    "motivation": "RETURN에서 개발을 배우고 싶습니다.",
}


def test_지원서_제출_성공(client, db_session):
    response = client.post("/api/applications", json=VALID)
    assert response.status_code == 201
    assert response.json()["name"] == "신입생"
    assert db_session.query(Application).count() == 1


def test_이메일_형식_검증(client):
    bad = {**VALID, "email": "not-an-email"}
    response = client.post("/api/applications", json=bad)
    assert response.status_code == 422


def test_지원동기_최소길이_검증(client):
    bad = {**VALID, "motivation": "짧음"}
    response = client.post("/api/applications", json=bad)
    assert response.status_code == 422
