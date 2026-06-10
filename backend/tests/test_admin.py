from app import config


def test_admin_로그인페이지_접근가능(client):
    response = client.get("/admin/login")
    assert response.status_code == 200


def test_admin_비로그인시_차단(client):
    response = client.get("/admin/award/list", follow_redirects=False)
    assert response.status_code in (302, 401)


def test_admin_로그인_성공(client):
    response = client.post(
        "/admin/login",
        data={"username": config.ADMIN_USERNAME, "password": config.ADMIN_PASSWORD},
        follow_redirects=False,
    )
    assert response.status_code == 302
