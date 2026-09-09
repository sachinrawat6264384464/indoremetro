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
        return query.order_by(Station.station_number.asc(), Station.code.asc()).all()

    @staticmethod
    def get_station_by_id(db: Session, station_id: str) -> Station:
        station = db.query(Station).filter((Station.id == station_id) | (Station.code == station_id.upper())).first()
        if not station:
            raise MetroAPIException(status_code=404, code="STATION_NOT_FOUND", message="Station not found")
        return station

    @staticmethod
    def create_station(db: Session, req: StationCreate) -> Station:
        existing = db.query(Station).filter(Station.code == req.code.upper()).first()
        if existing:
            raise MetroAPIException(status_code=400, code="STATION_CODE_EXISTS", message=f"Station code {req.code} already exists")

        station = Station(
            name=req.name,
            code=req.code.upper(),
            hindi_name=req.hindi_name,
            area=req.area,
            station_number=req.station_number,
            line_name=req.line_name,
            timings=req.timings or "06:00 AM - 10:00 PM",
            base_fare=req.base_fare or "₹10",
            latitude=req.latitude,
            longitude=req.longitude,
            status=req.status,
            amenities=req.amenities or [],
            gates=req.gates or [],
            nearby_transport=req.nearby_transport or [],
            parking_charges=req.parking_charges or []
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
        if req.hindi_name is not None:
            station.hindi_name = req.hindi_name
        if req.area is not None:
            station.area = req.area
        if req.station_number is not None:
            station.station_number = req.station_number
        if req.line_name is not None:
            station.line_name = req.line_name
        if req.timings is not None:
            station.timings = req.timings
        if req.base_fare is not None:
            station.base_fare = req.base_fare
        if req.latitude is not None:
            station.latitude = req.latitude
        if req.longitude is not None:
            station.longitude = req.longitude
        if req.status is not None:
            station.status = req.status
        if req.amenities is not None:
            station.amenities = req.amenities
        if req.gates is not None:
            station.gates = req.gates
        if req.nearby_transport is not None:
            station.nearby_transport = req.nearby_transport
        if req.parking_charges is not None:
            station.parking_charges = req.parking_charges

        db.commit()
        db.refresh(station)
        return station

