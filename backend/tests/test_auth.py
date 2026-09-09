import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"

def test_login_admin():
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@indoremetro.gov.in",
        "password": "Admin@123456"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert "SUPER_ADMIN" in data["data"]["user"]["roles"]

def test_login_invalid_password():
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@indoremetro.gov.in",
        "password": "WrongPassword123"
    })
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_CREDENTIALS"

def test_station_list():
    response = client.get("/api/v1/stations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 16
