from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.fare import FareRule
from app.repositories.base import BaseRepository

class FareRepository(BaseRepository[FareRule]):
    def __init__(self):
        super().__init__(FareRule)

    def get_active_rules(self, db: Session) -> List[FareRule]:
        """Fetch all active fare rules ordered by min_stops ascending."""
        return (
            db.query(FareRule)
            .filter(FareRule.status == "ACTIVE")
            .order_by(FareRule.min_stops.asc())
            .all()
        )

    def get_fare_for_stops(self, db: Session, stop_count: int) -> Optional[FareRule]:
        """Lookup active fare rule matching a specific stop count."""
        return (
            db.query(FareRule)
            .filter(
                FareRule.status == "ACTIVE",
                FareRule.min_stops <= stop_count,
                FareRule.max_stops >= stop_count
            )
            .first()
        )

fare_repository = FareRepository()
