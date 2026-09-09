from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreatePaymentOrderRequest(BaseModel):
    ticket_id: str

class PaymentOrderResponse(BaseModel):
    payment_id: str
    ticket_id: str
    razorpay_order_id: str
    amount: float
    currency: str
    razorpay_key_id: str

class VerifyPaymentRequest(BaseModel):
    ticket_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentStatusResponse(BaseModel):
    id: str
    ticket_id: str
    razorpay_order_id: str
    razorpay_payment_id: Optional[str]
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
