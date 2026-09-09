import io
import qrcode
import base64
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.ticket import Ticket
from app.models.qr import QRValidation
from app.core.security import verify_signed_qr_payload
from app.schemas.qr import ValidateQRResponse
from typing import Dict, Any

class QRService:
    @staticmethod
    def generate_qr_image_base64(payload_token: str) -> str:
        """Generates a Base64-encoded Data URI for QR Code image."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=8,
            border=2,
        )
        qr.add_data(payload_token)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#0F766E", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"

    @staticmethod
    def validate_qr_ticket(db: Session, qr_payload: str, gate_id: str = "GATE-01", scanned_by_user_id: str = None) -> ValidateQRResponse:
        decoded = verify_signed_qr_payload(qr_payload)
        now = datetime.now(timezone.utc)

        if not decoded:
            return ValidateQRResponse(
                is_valid=False,
                status_code="INVALID_SIGNATURE",
                message="Tampered or invalid QR Code signature",
                scanned_at=now
            )

        ticket_id = decoded.get("ticket_id")
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

        if not ticket:
            return ValidateQRResponse(
                is_valid=False,
                status_code="INVALID_TICKET",
                message="Ticket record does not exist",
                scanned_at=now
            )

        if ticket.status == "USED":
            # Log audit
            db.add(QRValidation(ticket_id=ticket.id, gate_id=gate_id, validation_result="ALREADY_USED", scanned_by_user_id=scanned_by_user_id))
            db.commit()
            return ValidateQRResponse(
                is_valid=False,
                status_code="ALREADY_USED",
                message="Ticket has already been scanned and used for entry/exit",
                ticket_number=ticket.ticket_number,
                scanned_at=now
            )

        if ticket.status != "CONFIRMED":
            db.add(QRValidation(ticket_id=ticket.id, gate_id=gate_id, validation_result="INVALID_STATUS", scanned_by_user_id=scanned_by_user_id))
            db.commit()
            return ValidateQRResponse(
                is_valid=False,
                status_code="INVALID_STATUS",
                message=f"Ticket status is {ticket.status}, cannot be used for entry",
                ticket_number=ticket.ticket_number,
                scanned_at=now
            )

        if ticket.expires_at and now > ticket.expires_at.replace(tzinfo=timezone.utc):
            ticket.status = "EXPIRED"
            db.add(QRValidation(ticket_id=ticket.id, gate_id=gate_id, validation_result="EXPIRED", scanned_by_user_id=scanned_by_user_id))
            db.commit()
            return ValidateQRResponse(
                is_valid=False,
                status_code="EXPIRED",
                message="Ticket QR code has expired",
                ticket_number=ticket.ticket_number,
                scanned_at=now
            )

        # Mark ticket as USED
        ticket.status = "USED"
        db.add(QRValidation(ticket_id=ticket.id, gate_id=gate_id, validation_result="VALID", scanned_by_user_id=scanned_by_user_id))
        db.commit()

        return ValidateQRResponse(
            is_valid=True,
            status_code="VALID",
            message="Gate unlocked! Valid QR ticket.",
            ticket_number=ticket.ticket_number,
            passenger_count=ticket.passenger_count,
            source_station=ticket.source_station.name if ticket.source_station else "",
            dest_station=ticket.dest_station.name if ticket.dest_station else "",
            scanned_at=now
        )
