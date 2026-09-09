from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ValidateQRRequest(BaseModel):
    qr_payload: str
    gate_id: Optional[str] = "GATE-01"

class ValidateQRResponse(BaseModel):
    is_valid: bool
    status_code: str  # VALID, EXPIRED, ALREADY_USED, INVALID_SIGNATURE
    message: str
    ticket_number: Optional[str] = None
    passenger_count: Optional[int] = None
    source_station: Optional[str] = None
    dest_station: Optional[str] = None
    scanned_at: datetime
