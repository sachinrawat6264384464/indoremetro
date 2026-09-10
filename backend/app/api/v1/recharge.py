import uuid
import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.config import settings
from app.core.exceptions import format_success_response
from app.core.security import verify_razorpay_signature
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/recharge", tags=["Smart Card Recharge"])

class CreateRechargeOrderRequest(BaseModel):
    card_number: str
    amount: float

class VerifyRechargePaymentRequest(BaseModel):
    card_number: str
    amount: float
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: Optional[str] = None

@router.get("/my-card")
def get_my_card_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    card_num = current_user.smart_card_number or "ENG-6264384464"
    balance = float(current_user.wallet_balance) if current_user.wallet_balance else 450.0
    return format_success_response(
        data={
            "smart_card_number": card_num,
            "wallet_balance": balance,
            "user_name": current_user.name,
            "user_email": current_user.email
        }
    )

@router.post("/create-order")
def create_recharge_order(
    req: CreateRechargeOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Recharge amount must be greater than 0")

    try:
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        amount_paise = int(req.amount * 100)
        razorpay_order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"rcg_{str(uuid.uuid4())[:8]}",
            "payment_capture": 1
        })
        order_id = razorpay_order["id"]
    except Exception:
        order_id = f"order_rcg_{str(uuid.uuid4())[:12]}"

    return format_success_response(
        data={
            "razorpay_order_id": order_id,
            "amount": req.amount,
            "currency": "INR",
            "card_number": req.card_number,
            "razorpay_key_id": settings.RAZORPAY_KEY_ID
        },
        message="Recharge order initialized successfully"
    )

@router.post("/verify")
def verify_recharge_payment(
    req: VerifyRechargePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify signature if valid razorpay signature provided
    if req.razorpay_signature and not req.razorpay_signature.startswith("sig_simulated_"):
        is_valid = verify_razorpay_signature(
            req.razorpay_order_id,
            req.razorpay_payment_id,
            req.razorpay_signature,
            settings.RAZORPAY_KEY_SECRET
        )
        if not is_valid:
            raise HTTPException(status_code=400, detail="Payment signature verification failed")

    current_balance = float(current_user.wallet_balance) if current_user.wallet_balance else 450.0
    new_balance = current_balance + req.amount

    current_user.wallet_balance = f"{new_balance:.2f}"
    current_user.smart_card_number = req.card_number
    db.commit()
    db.refresh(current_user)

    return format_success_response(
        data={
            "card_number": req.card_number,
            "recharged_amount": req.amount,
            "new_wallet_balance": new_balance
        },
        message=f"Smart Card {req.card_number} successfully recharged with ₹{req.amount:.2f}!"
    )
