from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.journey import JourneyPlanRequest
from app.services.journey_service import JourneyService

router = APIRouter(prefix="/journeys", tags=["Journeys"])

@router.post("/plan")
def plan_journey(req: JourneyPlanRequest, db: Session = Depends(get_db)):
    plan = JourneyService.plan_journey(db, req.source_station_id, req.dest_station_id)
    
    src = plan["source_station"]
    dst = plan["dest_station"]
    
    formatted_intermediates = [
        {
            "station_order": item["station_order"],
            "station": {
                "id": item["station"].id,
                "name": item["station"].name,
                "code": item["station"].code,
                "line_name": item["station"].line_name,
                "amenities": item["station"].amenities or []
            }
        }
        for item in plan["intermediate_stations"]
    ]

    return format_success_response(data={
        "source_station": {
            "id": src.id, "name": src.name, "code": src.code, "line_name": src.line_name
        },
        "dest_station": {
            "id": dst.id, "name": dst.name, "code": dst.code, "line_name": dst.line_name
        },
        "route_name": plan["route_name"],
        "direction": plan["direction"],
        "stop_count": plan["stop_count"],
        "estimated_time_mins": plan["estimated_time_mins"],
        "distance_km": plan["distance_km"],
        "fare_amount": plan["fare_amount"],
        "intermediate_stations": formatted_intermediates
    })
