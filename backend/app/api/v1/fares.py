from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.fare import FareCalculateRequest
from app.services.fare_service import FareService
from app.models.station import Station

router = APIRouter(prefix="/fares", tags=["Fares"])

@router.post("/calculate")
def calculate_fare(req: FareCalculateRequest, db: Session = Depends(get_db)):
    src_st = db.query(Station).filter(Station.id == req.source_station_id).first()
    dst_st = db.query(Station).filter(Station.id == req.dest_station_id).first()

    stop_count, base_fare, total_fare = FareService.calculate_fare(
        db, req.source_station_id, req.dest_station_id, passenger_count=req.passenger_count
    )

    return format_success_response(data={
        "source_station_name": src_st.name if src_st else "",
        "dest_station_name": dst_st.name if dst_st else "",
        "stop_count": stop_count,
        "base_fare_per_passenger": base_fare,
        "passenger_count": req.passenger_count,
        "total_fare": total_fare
    })

@router.get("/rules")
def get_fare_rules(db: Session = Depends(get_db)):
    rules = FareService.get_all_fare_rules(db)
    return format_success_response(data=[
        {
            "id": r.id,
            "min_stops": r.min_stops,
            "max_stops": r.max_stops,
            "fare_amount": float(r.fare_amount),
            "status": r.status
        } for r in rules
    ])
