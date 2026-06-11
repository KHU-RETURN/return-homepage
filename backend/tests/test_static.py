def test_dist_없어도_api는_정상(client):
    # 정적 서빙 마운트가 API 라우트를 가리지 않는지 확인
    assert client.get("/api/health").status_code == 200


def test_sitemap_HEAD_요청도_허용(client):
    # 구글 사이트맵 수집기의 HEAD 요청이 405가 되지 않아야 함
    assert client.head("/sitemap.xml").status_code == 200
