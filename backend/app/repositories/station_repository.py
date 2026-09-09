from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.station import Station
from app.repositories.base import BaseRepository

class StationRepository(BaseRepository[Station]):
    def __init__(self):
        super().__init__(Station)

    def get_by_code(self, db: Session, code: str) -> Optional[Station]:
        """Fetch station by unique code (e.g. 'GND', 'RDS')."""
        return db.query(Station).filter(Station.code == code.upper()).first()

    def get_all(
        self,
        db: Session,
        line_name: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Station]:
        """Fetch all stations with optional line_name and status filter."""
        query = db.query(Station)
        if line_name:
            query = query.filter(Station.line_name == line_name)
        if status:
            query = query.filter(Station.status == status)
        return query.order_by(Station.code.asc()).all()

    def get_active_stations(self, db: Session) -> List[Station]:
        """Fetch all active stations ordered by code."""
        return (
            db.query(Station)
            .filter(Station.status == "ACTIVE")
            .order_by(Station.code.asc())
            .all()
        )

    def search_by_name(self, db: Session, query_str: str) -> List[Station]:
        """Search stations matching name string."""
        return (
            db.query(Station)
            .filter(Station.name.ilike(f"%{query_str}%"))
            .order_by(Station.name.asc())
            .all()
        )

station_repository = StationRepository()
