from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Fetch a user by email address."""
        return db.query(User).filter(User.email == email.strip().lower()).first()

    def get_by_phone(self, db: Session, phone: str) -> Optional[User]:
        """Fetch a user by phone number."""
        return db.query(User).filter(User.phone == phone).first()

    def get_active_users(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Fetch list of active users."""
        return (
            db.query(User)
            .filter(User.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def is_active(self, user: User) -> bool:
        """Check if user is marked active."""
        return bool(user.is_active)

user_repository = UserRepository()
