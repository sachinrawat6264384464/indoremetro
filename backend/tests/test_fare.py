import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_fare_calculation_single_passenger():
    st_res = client.get("/api/v1/stations")
    stations = st_res.json()["data"]
    src_id = stations[0]["id"]
    dst_id = stations[3]["id"]  # 3 stops -> ₹20

    res = client.post("/api/v1/fares/calculate", json={
        "source_station_id": src_id,
        "dest_station_id": dst_id,
        "passenger_count": 1
    })
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["base_fare_per_passenger"] == 10.0
    assert data["total_fare"] == 10.0

def test_fare_calculation_multiple_passengers():
    st_res = client.get("/api/v1/stations")
    stations = st_res.json()["data"]
    src_id = stations[0]["id"]
    dst_id = stations[1]["id"]  # 1 stop -> ₹10 base

    res = client.post("/api/v1/fares/calculate", json={
        "source_station_id": src_id,
        "dest_station_id": dst_id,
        "passenger_count": 5
    })
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["passenger_count"] == 5
    assert data["base_fare_per_passenger"] == 10.0
    assert data["total_fare"] == 50.0

def test_fare_calculation_invalid_passenger_count():
    st_res = client.get("/api/v1/stations")
    stations = st_res.json()["data"]
    src_id = stations[0]["id"]
    dst_id = stations[1]["id"]

    res = client.post("/api/v1/fares/calculate", json={
        "source_station_id": src_id,
        "dest_station_id": dst_id,
        "passenger_count": 0
    })
    assert res.status_code == 422  # Pydantic validation ge=1
