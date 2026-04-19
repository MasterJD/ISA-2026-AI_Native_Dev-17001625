def test_health_endpoint_contract(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "active",
        "version": "1.0.0",
        "environment": "development",
    }


def test_health_endpoint_cors_header(client):
    response = client.get(
        "/api/v1/health",
        headers={"Origin": "http://localhost:3000"},
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
