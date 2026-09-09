from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role, UserRole, RolePermission, Permission
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import MetroAPIException
from app.schemas.auth import UserRegisterRequest, UserLoginRequest
from typing import List, Tuple

class AuthService:
    @staticmethod
    def register_user(db: Session, req: UserRegisterRequest) -> User:
        existing = db.query(User).filter(User.email == req.email.lower()).first()
        if existing:
            raise MetroAPIException(status_code=400, code="USER_EXISTS", message="User with this email already exists")

        user = User(
            name=req.name,
            email=req.email.lower(),
            phone=req.phone,
            password_hash=get_password_hash(req.password),
            is_active=True,
            email_verified=True
        )
        db.add(user)
        db.flush()

        # Assign PASSENGER role
        passenger_role = db.query(Role).filter(Role.name == "PASSENGER").first()
        if passenger_role:
            db.add(UserRole(user_id=user.id, role_id=passenger_role.id))

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def login_user(db: Session, req: UserLoginRequest) -> Tuple[str, User, List[str]]:
        user = db.query(User).filter(User.email == req.email.lower()).first()
        if not user or not verify_password(req.password, user.password_hash):
            raise MetroAPIException(status_code=401, code="INVALID_CREDENTIALS", message="Invalid email or password")

        if not user.is_active:
            raise MetroAPIException(status_code=403, code="ACCOUNT_DISABLED", message="Account is deactivated")

        roles = [ur.role.name for ur in user.roles if ur.role]
        token = create_access_token(subject=user.id, extra_claims={"roles": roles})
        return token, user, roles

    @staticmethod
    def get_user_permissions(db: Session, user_id: str) -> List[str]:
        permissions = db.query(Permission.code).join(
            RolePermission, Permission.id == RolePermission.permission_id
        ).join(
            UserRole, RolePermission.role_id == UserRole.role_id
        ).filter(UserRole.user_id == user_id).all()

        return list(set([p[0] for p in permissions]))
