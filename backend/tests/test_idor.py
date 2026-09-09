import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unauthenticated_ticket_detail_rejected():
    response = client.get("/api/v1/tickets/non_existent_id")
    assert response.status_code == 401

def test_unauthenticated_ticket_cancellation_rejected():
    response = client.post("/api/v1/tickets/non_existent_id/cancel")
    assert response.status_code == 401

def test_unauthenticated_my_tickets_rejected():
    response = client.get("/api/v1/tickets/my-tickets")
    assert response.status_code == 401
