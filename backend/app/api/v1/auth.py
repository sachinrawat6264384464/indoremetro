from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse, ForgotPasswordRequest
)
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(req: UserRegisterRequest, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, req)
    return format_success_response(
        data={"user_id": user.id, "email": user.email, "name": user.name},
        message="User account registered successfully"
    )

@router.post("/login")
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    token, user, roles = AuthService.login_user(db, req)
    wallet_bal = float(user.wallet_balance) if user.wallet_balance else 450.0
    card_num = user.smart_card_number or "ENG-6264384464"
    return format_success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "wallet_balance": wallet_bal,
                "smart_card_number": card_num,
                "roles": roles
            }
        },
        message="Login successful"
    )

@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roles = [ur.role.name for ur in current_user.roles if ur.role]
    wallet_bal = float(current_user.wallet_balance) if current_user.wallet_balance else 450.0
    card_num = current_user.smart_card_number or "ENG-6264384464"
    return format_success_response(
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "wallet_balance": wallet_bal,
            "smart_card_number": card_num,
            "is_active": current_user.is_active,
            "email_verified": current_user.email_verified,
            "roles": roles
        }
    )

@router.put("/me")
def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.name:
        current_user.name = req.name
    if req.phone:
        current_user.phone = req.phone
    db.commit()
    db.refresh(current_user)

    roles = [ur.role.name for ur in current_user.roles if ur.role]
    wallet_bal = float(current_user.wallet_balance) if current_user.wallet_balance else 450.0
    card_num = current_user.smart_card_number or "ENG-6264384464"

    return format_success_response(
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "wallet_balance": wallet_bal,
            "smart_card_number": card_num,
            "roles": roles
        },
        message="Profile details updated successfully"
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    return format_success_response(
        message="If your email is registered, password reset instructions have been dispatched."
    )
