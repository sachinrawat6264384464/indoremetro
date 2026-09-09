import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sqli_payload_in_login():
    sqli_payload = "' OR '1'='1"
    res = client.post("/api/v1/auth/login", json={
        "email": sqli_payload,
        "password": sqli_payload
    })
    # Should safely reject via validation (422) or authentication failure (401), not 500 DB error
    assert res.status_code in (401, 422)
    assert res.json()["success"] is False

def test_xss_payload_in_station_search():
    xss_payload = "<script>alert('xss')</script>"
    res = client.get(f"/api/v1/stations?search={xss_payload}")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

def test_invalid_uuid_station_lookup():
    res = client.get("/api/v1/stations/SELECT%20*%20FROM%20users")
    assert res.status_code == 404
