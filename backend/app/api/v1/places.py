from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.services.nearby_places_service import NearbyPlacesService
from typing import Optional

router = APIRouter(prefix="/places", tags=["Nearby Places"])

@router.get("/nearby")
def get_nearby_places(station_id: str, db: Session = Depends(get_db)):
    places = NearbyPlacesService.get_places_by_station(db, station_id)
    return format_success_response(
        data=[
            {
                "id": p.id,
                "station_id": p.station_id,
                "name": p.name,
                "category": p.category,
                "latitude": p.latitude,
                "longitude": p.longitude,
                "distance_km": p.distance_km,
                "address": p.address,
                "icon": p.icon
            }
            for p in places
        ]
    )

@router.get("/search")
def search_places(
    q: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Place category"),
    db: Session = Depends(get_db)
):
    places = NearbyPlacesService.search_places(db, query_str=q or "", category=category)
    return format_success_response(
        data=[
            {
                "id": p.id,
                "station_id": p.station_id,
                "name": p.name,
                "category": p.category,
                "latitude": p.latitude,
                "longitude": p.longitude,
                "distance_km": p.distance_km,
                "address": p.address,
                "icon": p.icon
            }
            for p in places
        ]
    )
