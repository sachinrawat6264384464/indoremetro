from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.qr import ValidateQRRequest
from app.services.qr_service import QRService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/qr", tags=["QR Code"])

@router.post("/validate")
def validate_qr(req: ValidateQRRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = QRService.validate_qr_ticket(db, req.qr_payload, req.gate_id or "GATE-01", scanned_by_user_id=current_user.id)
    return format_success_response(data={
        "is_valid": res.is_valid,
        "status_code": res.status_code,
        "message": res.message,
        "ticket_number": res.ticket_number,
        "passenger_count": res.passenger_count,
        "source_station": res.source_station,
        "dest_station": res.dest_station,
        "scanned_at": res.scanned_at.isoformat()
    })
