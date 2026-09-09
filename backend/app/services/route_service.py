from sqlalchemy.orm import Session
from app.models.route import Route, RouteStation
from app.models.station import Station
from app.schemas.route import RouteStationOrderUpdate
from app.core.exceptions import MetroAPIException
from typing import List

class RouteService:
    @staticmethod
    def get_all_routes(db: Session) -> List[Route]:
        return db.query(Route).filter(Route.status == "ACTIVE").all()

    @staticmethod
    def get_route_by_id(db: Session, route_id: str) -> Route:
        route = db.query(Route).filter(Route.id == route_id).first()
        if not route:
            raise MetroAPIException(status_code=404, code="ROUTE_NOT_FOUND", message="Route not found")
        return route

    @staticmethod
    def update_route_stations(db: Session, route_id: str, stations_order: List[RouteStationOrderUpdate]) -> Route:
        route = RouteService.get_route_by_id(db, route_id)
        
        # Clear existing route stations
        db.query(RouteStation).filter(RouteStation.route_id == route_id).delete()
        
        for item in stations_order:
            rs = RouteStation(
                route_id=route_id,
                station_id=item.station_id,
                station_order=item.station_order,
                distance_from_start_km=item.distance_from_start_km or 0.0,
                travel_time_mins=item.travel_time_mins or 2
            )
            db.add(rs)
            
        db.commit()
        db.refresh(route)
        return route
