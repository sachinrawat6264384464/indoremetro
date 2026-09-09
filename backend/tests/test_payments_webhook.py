import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unauthenticated_create_payment_order_rejected():
    res = client.post("/api/v1/payments/create-order", json={"ticket_id": "invalid_ticket_id"})
    assert res.status_code == 401

def test_unauthenticated_verify_payment_rejected():
    res = client.post("/api/v1/payments/verify", json={
        "ticket_id": "invalid",
        "razorpay_order_id": "order_123",
        "razorpay_payment_id": "pay_123",
        "razorpay_signature": "sig_123"
    })
    assert res.status_code == 401

def test_razorpay_webhook_event_processing():
    payload = {
        "event": "payment.captured",
        "event_id": "evt_test_12345",
        "payload": {
            "payment": {
                "entity": {
                    "id": "pay_test_12345",
                    "order_id": "order_test_12345",
                    "status": "captured",
                    "amount": 4000
                }
            }
        }
    }
    res = client.post("/api/v1/payments/webhook", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
