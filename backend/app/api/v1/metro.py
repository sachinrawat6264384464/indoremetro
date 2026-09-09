from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.services.metro_map_service import MetroMapService
from app.services.statistics_service import StatisticsService

router = APIRouter(prefix="/metro", tags=["Metro Map & Statistics"])

@router.get("/geojson")
def get_metro_geojson(db: Session = Depends(get_db)):
    geojson_data = MetroMapService.get_metro_geojson(db)
    return format_success_response(data=geojson_data)

@router.get("/statistics")
def get_metro_statistics(db: Session = Depends(get_db)):
    stats = StatisticsService.get_metro_statistics(db)
    return format_success_response(data=stats)
