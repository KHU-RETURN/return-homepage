def test_dist_없어도_api는_정상(client):
    # 정적 서빙 마운트가 API 라우트를 가리지 않는지 확인
    assert client.get("/api/health").status_code == 200
