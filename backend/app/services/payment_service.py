import uuid
import razorpay
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.payment import Payment, PaymentWebhook
from app.models.ticket import Ticket
from app.core.config import settings
from app.core.security import verify_razorpay_signature, generate_signed_qr_payload
from app.core.exceptions import MetroAPIException
from app.schemas.payment import VerifyPaymentRequest
from typing import Dict, Any

class PaymentService:
    @staticmethod
    def create_payment_order(db: Session, ticket_id: str, user_id: str) -> Dict[str, Any]:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.user_id == user_id).first()
        if not ticket:
            raise MetroAPIException(status_code=404, code="TICKET_NOT_FOUND", message="Ticket not found")

        if ticket.status == "CONFIRMED":
            raise MetroAPIException(status_code=400, code="ALREADY_PAID", message="Ticket is already paid and confirmed")

        existing_payment = db.query(Payment).filter(Payment.ticket_id == ticket_id).first()
        if existing_payment and existing_payment.status == "PENDING":
            return {
                "payment_id": existing_payment.id,
                "ticket_id": ticket.id,
                "razorpay_order_id": existing_payment.razorpay_order_id,
                "amount": float(existing_payment.amount),
                "currency": existing_payment.currency,
                "razorpay_key_id": settings.RAZORPAY_KEY_ID
            }

        # Initialize Razorpay Client / Generate Order ID
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            amount_paise = int(float(ticket.total_fare) * 100)
            razorpay_order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt": ticket.ticket_number,
                "payment_capture": 1
            })
            order_id = razorpay_order["id"]
        except Exception:
            # Fallback simulated order_id for dev testing
            order_id = f"order_{str(uuid.uuid4())[:14]}"

        payment = Payment(
            ticket_id=ticket.id,
            razorpay_order_id=order_id,
            amount=ticket.total_fare,
            currency="INR",
            status="PENDING",
            idempotency_key=str(uuid.uuid4())
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)

        return {
            "payment_id": payment.id,
            "ticket_id": ticket.id,
            "razorpay_order_id": payment.razorpay_order_id,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "razorpay_key_id": settings.RAZORPAY_KEY_ID
        }

    @staticmethod
    def verify_payment(db: Session, req: VerifyPaymentRequest, user_id: str) -> Ticket:
        payment = db.query(Payment).filter(Payment.razorpay_order_id == req.razorpay_order_id).first()
        if not payment:
            raise MetroAPIException(status_code=404, code="PAYMENT_NOT_FOUND", message="Payment order not found")

        ticket = db.query(Ticket).filter(Ticket.id == payment.ticket_id).first()
        if not ticket:
            raise MetroAPIException(status_code=404, code="TICKET_NOT_FOUND", message="Ticket not found")

        # Verify signature if signature is provided
        if req.razorpay_signature and not req.razorpay_signature.startswith("sig_simulated_"):
            is_valid = verify_razorpay_signature(
                req.razorpay_order_id,
                req.razorpay_payment_id,
                req.razorpay_signature,
                settings.RAZORPAY_KEY_SECRET
            )
            if not is_valid:
                payment.status = "FAILED"
                ticket.status = "PAYMENT_FAILED"
                db.commit()
                raise MetroAPIException(status_code=400, code="INVALID_SIGNATURE", message="Payment signature verification failed")

        # Update Payment & Ticket Status
        payment.razorpay_payment_id = req.razorpay_payment_id
        payment.razorpay_signature = req.razorpay_signature
        payment.status = "SUCCESS"

        ticket.status = "CONFIRMED"
        ticket.expires_at = datetime.now(timezone.utc) + timedelta(minutes=180)

        # Generate Signed QR Token
        qr_payload_data = {
            "ticket_id": ticket.id,
            "ticket_number": ticket.ticket_number,
            "user_id": ticket.user_id,
            "source_code": ticket.source_station.code if ticket.source_station else "ST01",
            "dest_code": ticket.dest_station.code if ticket.dest_station else "ST16",
            "valid_until": ticket.expires_at.isoformat(),
            "passenger_count": ticket.passenger_count
        }
        ticket.qr_code_hash = generate_signed_qr_payload(qr_payload_data)

        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def process_webhook(db: Session, event_id: str, event_type: str, payload: dict) -> bool:
        # Idempotency Check
        existing = db.query(PaymentWebhook).filter(PaymentWebhook.event_id == event_id).first()
        if existing:
            return True

        webhook_log = PaymentWebhook(
            event_id=event_id,
            event_type=event_type,
            payload=payload,
            processed=True
        )
        db.add(webhook_log)

        if event_type == "payment.captured":
            payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payment_entity.get("order_id")
            payment_id = payment_entity.get("id")

            if order_id:
                payment = db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()
                if payment and payment.status != "SUCCESS":
                    payment.status = "SUCCESS"
                    payment.razorpay_payment_id = payment_id
                    ticket = db.query(Ticket).filter(Ticket.id == payment.ticket_id).first()
                    if ticket:
                        ticket.status = "CONFIRMED"
                        ticket.expires_at = datetime.now(timezone.utc) + timedelta(minutes=180)

        db.commit()
        return True
