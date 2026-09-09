from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.payment import Payment, PaymentWebhook
from app.repositories.base import BaseRepository

class PaymentRepository(BaseRepository[Payment]):
    def __init__(self):
        super().__init__(Payment)

    def get_by_razorpay_order_id(self, db: Session, razorpay_order_id: str) -> Optional[Payment]:
        """Fetch payment by Razorpay order ID."""
        return db.query(Payment).filter(Payment.razorpay_order_id == razorpay_order_id).first()

    def get_by_razorpay_payment_id(self, db: Session, razorpay_payment_id: str) -> Optional[Payment]:
        """Fetch payment by Razorpay payment ID."""
        return db.query(Payment).filter(Payment.razorpay_payment_id == razorpay_payment_id).first()

    def get_by_ticket_id(self, db: Session, ticket_id: str) -> Optional[Payment]:
        """Fetch payment record associated with a ticket ID."""
        return db.query(Payment).filter(Payment.ticket_id == ticket_id).first()

    def create_webhook_log(
        self, db: Session, event_id: str, event_type: str, payload: Dict[str, Any]
    ) -> PaymentWebhook:
        """Record a incoming payment webhook event."""
        webhook = PaymentWebhook(
            event_id=event_id,
            event_type=event_type,
            payload=payload,
            processed=False
        )
        db.add(webhook)
        db.commit()
        db.refresh(webhook)
        return webhook

    def is_webhook_processed(self, db: Session, event_id: str) -> bool:
        """Check whether a webhook event_id was already logged/processed."""
        webhook = db.query(PaymentWebhook).filter(PaymentWebhook.event_id == event_id).first()
        return bool(webhook and webhook.processed)

    def mark_webhook_processed(self, db: Session, event_id: str) -> Optional[PaymentWebhook]:
        """Mark a webhook log record as processed."""
        webhook = db.query(PaymentWebhook).filter(PaymentWebhook.event_id == event_id).first()
        if webhook:
            webhook.processed = True
            db.commit()
            db.refresh(webhook)
        return webhook

payment_repository = PaymentRepository()
