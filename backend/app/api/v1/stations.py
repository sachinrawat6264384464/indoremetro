from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.services.station_service import StationService
from app.schemas.station import StationCreate, StationUpdate
from app.api.deps import require_permission
from typing import Optional

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("")
def list_stations(
    line_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    stations = StationService.get_all_stations(db, line_name, status)
    return format_success_response(data=[
        {
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "line_name": s.line_name,
            "latitude": s.latitude,
            "longitude": s.longitude,
            "status": s.status,
            "amenities": s.amenities or [],
            "created_at": s.created_at.isoformat()
        } for s in stations
    ])

@router.get("/{station_id}")
def get_station_detail(station_id: str, db: Session = Depends(get_db)):
    s = StationService.get_station_by_id(db, station_id)
    return format_success_response(data={
        "id": s.id,
        "name": s.name,
        "code": s.code,
        "line_name": s.line_name,
        "latitude": s.latitude,
        "longitude": s.longitude,
        "status": s.status,
        "amenities": s.amenities or [],
        "created_at": s.created_at.isoformat()
    })

@router.post("", dependencies=[Depends(require_permission("station:create"))])
def create_station(req: StationCreate, db: Session = Depends(get_db)):
    s = StationService.create_station(db, req)
    return format_success_response(
        data={"id": s.id, "name": s.name, "code": s.code},
        message="Station created successfully"
    )

@router.put("/{station_id}", dependencies=[Depends(require_permission("station:update"))])
def update_station(station_id: str, req: StationUpdate, db: Session = Depends(get_db)):
    s = StationService.update_station(db, station_id, req)
    return format_success_response(
        data={"id": s.id, "name": s.name, "code": s.code, "status": s.status},
        message="Station updated successfully"
    )
