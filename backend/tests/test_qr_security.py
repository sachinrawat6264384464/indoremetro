import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import generate_signed_qr_payload, verify_signed_qr_payload

client = TestClient(app)

def test_qr_hash_generation_determinism():
    payload_token = generate_signed_qr_payload({"ticket_id": "TCK-1001", "src": "ST01", "dst": "ST15"})
    decoded = verify_signed_qr_payload(payload_token)
    assert decoded is not None
    assert decoded["ticket_id"] == "TCK-1001"
    assert decoded["src"] == "ST01"

def test_qr_validation_invalid_hash():
    res = client.post("/api/v1/qr/validate", json={
        "qr_payload": "INVALID_TAMPERED_QR_PAYLOAD_STRING",
        "gate_id": "GATE-01"
    })
    # Requires authentication
    assert res.status_code == 401
