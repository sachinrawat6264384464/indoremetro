from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.payment import CreatePaymentOrderRequest, VerifyPaymentRequest
from app.services.payment_service import PaymentService
from app.services.email_service import EmailService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/create-order")
def create_payment_order(req: CreatePaymentOrderRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order_data = PaymentService.create_payment_order(db, req.ticket_id, current_user.id)
    return format_success_response(data=order_data, message="Razorpay payment order initialized")

@router.post("/verify")
def verify_payment(req: VerifyPaymentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = PaymentService.verify_payment(db, req, current_user.id)
    
    # Send ticket confirmation email in background / async
    try:
        EmailService.send_ticket_confirmation(
            to_email=current_user.email,
            ticket_data={
                "ticket_number": ticket.ticket_number,
                "source_station": ticket.source_station.name if ticket.source_station else "",
                "dest_station": ticket.dest_station.name if ticket.dest_station else "",
                "passenger_count": ticket.passenger_count,
                "journey_date": ticket.journey_date.isoformat(),
                "total_fare": float(ticket.total_fare)
            }
        )
    except Exception as e:
        print(f"Email delivery trigger warning: {e}")

    return format_success_response(
        data={
            "ticket_id": ticket.id,
            "ticket_number": ticket.ticket_number,
            "status": ticket.status,
            "qr_code_hash": ticket.qr_code_hash
        },
        message="Payment verified successfully. Ticket confirmed!"
    )

@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db), x_razorpay_signature: str = Header(None)):
    payload = await request.json()
    event_id = payload.get("event_id", payload.get("created_at", "evt_unknown"))
    event_type = payload.get("event", "payment.captured")

    PaymentService.process_webhook(db, str(event_id), event_type, payload)
    return format_success_response(message="Webhook event processed successfully")
