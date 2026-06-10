import datetime

from app.models import Award


def test_수상목록_빈배열(client):
    response = client.get("/api/awards")
    assert response.status_code == 200
    assert response.json() == []


def test_수상목록_최신순_정렬(client, db_session):
    old = Award(title="우수상", competition="해커톤 A", winners="김철수",
                awarded_on=datetime.date(2024, 5, 1))
    new = Award(title="대상", competition="해커톤 B", winners="홍길동",
                awarded_on=datetime.date(2025, 11, 20))
    db_session.add_all([old, new])
    db_session.commit()

    data = client.get("/api/awards").json()
    assert len(data) == 2
    assert data[0]["title"] == "대상"
    assert data[0]["awarded_on"] == "2025-11-20"
