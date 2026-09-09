import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unauthenticated_admin_dashboard_access_rejected():
    response = client.get("/api/v1/admin/dashboard")
    assert response.status_code == 401

def test_unauthenticated_admin_users_access_rejected():
    response = client.get("/api/v1/admin/users")
    assert response.status_code == 401

def test_unauthenticated_admin_tickets_access_rejected():
    response = client.get("/api/v1/admin/tickets")
    assert response.status_code == 401

def test_unauthenticated_admin_payments_access_rejected():
    response = client.get("/api/v1/admin/payments")
    assert response.status_code == 401

def test_unauthenticated_audit_logs_access_rejected():
    response = client.get("/api/v1/admin/audit-logs")
    assert response.status_code == 401

def test_admin_dashboard_access_with_valid_token():
    # Login as admin
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@indoremetro.gov.in",
        "password": "Admin@123456"
    })
    assert login_res.status_code == 200
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dash_res = client.get("/api/v1/admin/dashboard", headers=headers)
    assert dash_res.status_code == 200
    data = dash_res.json()
    assert data["success"] is True
    assert "total_users" in data["data"]
    assert "total_tickets" in data["data"]
