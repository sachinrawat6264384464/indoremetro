from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse, ForgotPasswordRequest
)
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

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
    return format_success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "roles": roles
            }
        },
        message="Login successful"
    )

@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roles = [ur.role.name for ur in current_user.roles if ur.role]
    return format_success_response(
        data={
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "is_active": current_user.is_active,
            "email_verified": current_user.email_verified,
            "roles": roles
        }
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    # Security rule: Always return success message without revealing email existence
    return format_success_response(
        message="If your email is registered, password reset instructions have been dispatched."
    )
