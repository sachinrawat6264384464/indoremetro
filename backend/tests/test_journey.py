import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_journey_planner():
    # Fetch stations first
    st_res = client.get("/api/v1/stations")
    stations = st_res.json()["data"]
    src_id = stations[0]["id"]
    dst_id = stations[12]["id"]  # Gandhi Nagar to Vijay Nagar Square

    response = client.post("/api/v1/journeys/plan", json={
        "source_station_id": src_id,
        "dest_station_id": dst_id
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["stop_count"] == 12
    assert data["data"]["fare_amount"] == 40.0

def test_fare_calculation():
    st_res = client.get("/api/v1/stations")
    stations = st_res.json()["data"]
    src_id = stations[0]["id"]
    dst_id = stations[2]["id"]  # 2 stops -> ₹10 base fare

    response = client.post("/api/v1/fares/calculate", json={
        "source_station_id": src_id,
        "dest_station_id": dst_id,
        "passenger_count": 3
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["stop_count"] == 2
    assert data["data"]["base_fare_per_passenger"] == 10.0
    assert data["data"]["total_fare"] == 30.0
