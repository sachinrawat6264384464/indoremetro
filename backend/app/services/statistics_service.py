from sqlalchemy.orm import Session
from app.models.station import Station
from app.models.route import Route
from typing import Dict, Any

class StatisticsService:
    @staticmethod
    def get_metro_statistics(db: Session) -> Dict[str, Any]:
        total_stations = db.query(Station).count()
        operational = db.query(Station).filter(Station.status == "ACTIVE").count()
        upcoming = db.query(Station).filter(Station.status == "UPCOMING").count()
        under_construction = db.query(Station).filter(Station.status == "UNDER_CONSTRUCTION").count()
        total_lines = db.query(Route).filter(Route.status == "ACTIVE").count()

        return {
            "total_stations": total_stations,
            "operational_stations": operational,
            "upcoming_stations": upcoming,
            "under_construction_stations": under_construction,
            "total_lines": total_lines,
            "network_length_km": 31.55,
            "priority_corridor_length_km": 17.5
        }
