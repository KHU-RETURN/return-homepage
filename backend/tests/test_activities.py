from app.models import Activity


def test_활동목록_빈배열(client):
    response = client.get("/api/activities")
    assert response.status_code == 200
    assert response.json() == []


def test_활동목록_kind_id_순_정렬(client, db_session):
    db_session.add_all([
        Activity(kind="mt", title="봄 MT", semester="2026-1"),
        Activity(kind="study", title="알고리즘 스터디", semester="2026-1",
                 description="매주 문제 풀이"),
        Activity(kind="group", title="CTF 소모임", semester="2026-1"),
    ])
    db_session.commit()

    data = client.get("/api/activities").json()
    assert len(data) == 3
    assert [item["kind"] for item in data] == ["group", "mt", "study"]
    assert data[2]["title"] == "알고리즘 스터디"
    assert data[2]["description"] == "매주 문제 풀이"
