from sqlalchemy.orm import Session
from app.models.station import Station
from app.schemas.station import StationCreate, StationUpdate
from app.core.exceptions import MetroAPIException
from typing import List, Optional

class StationService:
    @staticmethod
    def get_all_stations(db: Session, line_name: Optional[str] = None, status: Optional[str] = None) -> List[Station]:
        query = db.query(Station)
        if line_name:
            query = query.filter(Station.line_name == line_name)
        if status:
            query = query.filter(Station.status == status)
        return query.order_by(Station.code.asc()).all()

    @staticmethod
    def get_station_by_id(db: Session, station_id: str) -> Station:
        station = db.query(Station).filter(Station.id == station_id).first()
        if not station:
            raise MetroAPIException(status_code=44, code="STATION_NOT_FOUND", message="Station not found")
        return station

    @staticmethod
    def create_station(db: Session, req: StationCreate) -> Station:
        existing = db.query(Station).filter(Station.code == req.code.upper()).first()
        if existing:
            raise MetroAPIException(status_code=400, code="STATION_CODE_EXISTS", message=f"Station code {req.code} already exists")

        station = Station(
            name=req.name,
            code=req.code.upper(),
            line_name=req.line_name,
            latitude=req.latitude,
            longitude=req.longitude,
            status=req.status,
            amenities=req.amenities or []
        )
        db.add(station)
        db.commit()
        db.refresh(station)
        return station

    @staticmethod
    def update_station(db: Session, station_id: str, req: StationUpdate) -> Station:
        station = StationService.get_station_by_id(db, station_id)
        if req.name is not None:
            station.name = req.name
        if req.line_name is not None:
            station.line_name = req.line_name
        if req.latitude is not None:
            station.latitude = req.latitude
        if req.longitude is not None:
            station.longitude = req.longitude
        if req.status is not None:
            station.status = req.status
        if req.amenities is not None:
            station.amenities = req.amenities

        db.commit()
        db.refresh(station)
        return station
