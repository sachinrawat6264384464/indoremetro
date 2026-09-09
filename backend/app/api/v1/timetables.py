from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.services.timetable_service import TimetableService
from typing import Optional

router = APIRouter(prefix="/timetables", tags=["Timetables"])

@router.get("")
def get_timetables(
    route_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    items = TimetableService.get_timetables(db, route_id, station_id)
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "route_id": item.route_id,
            "station_id": item.station_id,
            "station_name": item.station.name if item.station else "",
            "first_train_time": item.first_train_time.strftime("%H:%M"),
            "last_train_time": item.last_train_time.strftime("%H:%M"),
            "peak_frequency_mins": item.peak_frequency_mins,
            "off_peak_frequency_mins": item.off_peak_frequency_mins,
            "operating_days": item.operating_days,
            "status": item.status
        })
    return format_success_response(data=result)
