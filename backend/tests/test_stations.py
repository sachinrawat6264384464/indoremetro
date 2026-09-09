import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_stations():
    res = client.get("/api/v1/stations")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) == 29

def test_get_station_by_id_and_code():
    res = client.get("/api/v1/stations")
    stations = res.json()["data"]
    st01 = stations[0]

    # Test lookup by UUID
    res_id = client.get(f"/api/v1/stations/{st01['id']}")
    assert res_id.status_code == 200
    assert res_id.json()["data"]["name"] == st01["name"]

    # Test lookup by Station Code (e.g. ST01)
    res_code = client.get(f"/api/v1/stations/{st01['code']}")
    assert res_code.status_code == 200
    assert res_code.json()["data"]["code"] == st01["code"]

def test_station_not_found():
    res = client.get("/api/v1/stations/ST_NON_EXISTENT_999")
    assert res.status_code == 404
