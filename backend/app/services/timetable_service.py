from sqlalchemy.orm import Session
from app.models.timetable import Timetable
from app.models.station import Station
from typing import List, Optional

class TimetableService:
    @staticmethod
    def get_timetables(db: Session, route_id: Optional[str] = None, station_id: Optional[str] = None) -> List[Timetable]:
        query = db.query(Timetable).filter(Timetable.status == "ACTIVE")
        if route_id:
            query = query.filter(Timetable.route_id == route_id)
        if station_id:
            query = query.filter(Timetable.station_id == station_id)
        return query.all()
