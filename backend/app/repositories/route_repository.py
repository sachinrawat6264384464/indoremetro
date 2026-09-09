from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.route import Route, RouteStation
from app.repositories.base import BaseRepository

class RouteRepository(BaseRepository[Route]):
    def __init__(self):
        super().__init__(Route)

    def get_by_code(self, db: Session, code: str) -> Optional[Route]:
        """Fetch route by code (e.g. YL-UP, YL-DOWN)."""
        return db.query(Route).filter(Route.code == code.upper()).first()

    def get_active_routes(self, db: Session) -> List[Route]:
        """Fetch all active routes."""
        return (
            db.query(Route)
            .filter(Route.status == "ACTIVE")
            .options(joinedload(Route.route_stations).joinedload(RouteStation.station))
            .all()
        )

    def get_route_with_stations(self, db: Session, route_id: str) -> Optional[Route]:
        """Fetch route with ordered route stations preloaded."""
        return (
            db.query(Route)
            .filter(Route.id == route_id)
            .options(joinedload(Route.route_stations).joinedload(RouteStation.station))
            .first()
        )

    def get_route_stations(self, db: Session, route_id: str) -> List[RouteStation]:
        """Fetch route station mappings ordered by station order."""
        return (
            db.query(RouteStation)
            .filter(RouteStation.route_id == route_id)
            .order_by(RouteStation.station_order.asc())
            .all()
        )

    def get_station_order(self, db: Session, route_id: str, station_id: str) -> Optional[RouteStation]:
        """Fetch RouteStation for a specific station on a route."""
        return (
            db.query(RouteStation)
            .filter(
                RouteStation.route_id == route_id,
                RouteStation.station_id == station_id
            )
            .first()
        )

route_repository = RouteRepository()
