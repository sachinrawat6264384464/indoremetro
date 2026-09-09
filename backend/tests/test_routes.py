import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_routes():
    res = client.get("/api/v1/routes")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) >= 1

def test_yellow_line_priority_corridor():
    res = client.get("/api/v1/routes")
    routes = res.json()["data"]
    yellow_line = next((r for r in routes if "Yellow" in r["line_name"]), None)
    assert yellow_line is not None
    assert yellow_line["status"] == "ACTIVE"
