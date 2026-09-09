from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.services.route_service import RouteService
from app.schemas.route import RouteStationOrderUpdate
from app.api.deps import require_permission
from typing import List

router = APIRouter(prefix="/routes", tags=["Routes"])

@router.get("")
def list_routes(db: Session = Depends(get_db)):
    routes = RouteService.get_all_routes(db)
    result = []
    for r in routes:
        stations_data = [
            {
                "id": rs.id,
                "station_order": rs.station_order,
                "distance_from_start_km": rs.distance_from_start_km,
                "travel_time_mins": rs.travel_time_mins,
                "station": {
                    "id": rs.station.id,
                    "name": rs.station.name,
                    "code": rs.station.code,
                    "status": rs.station.status
                }
            } for rs in r.route_stations if rs.station
        ]
        result.append({
            "id": r.id,
            "name": r.name,
            "code": r.code,
            "line_name": r.line_name,
            "line_color": r.line_color,
            "direction": r.direction,
            "status": r.status,
            "route_stations": stations_data
        })
    return format_success_response(data=result)

@router.get("/{route_id}")
def get_route_detail(route_id: str, db: Session = Depends(get_db)):
    r = RouteService.get_route_by_id(db, route_id)
    stations_data = [
        {
            "id": rs.id,
            "station_order": rs.station_order,
            "distance_from_start_km": rs.distance_from_start_km,
            "travel_time_mins": rs.travel_time_mins,
            "station": {
                "id": rs.station.id,
                "name": rs.station.name,
                "code": rs.station.code,
                "status": rs.station.status
            }
        } for rs in r.route_stations if rs.station
    ]
    return format_success_response(data={
        "id": r.id,
        "name": r.name,
        "code": r.code,
        "line_name": r.line_name,
        "line_color": r.line_color,
        "direction": r.direction,
        "status": r.status,
        "route_stations": stations_data
    })

@router.put("/{route_id}/stations", dependencies=[Depends(require_permission("route:update"))])
def update_route_stations(route_id: str, stations: List[RouteStationOrderUpdate], db: Session = Depends(get_db)):
    r = RouteService.update_route_stations(db, route_id, stations)
    return format_success_response(message="Route station sequence updated successfully")
