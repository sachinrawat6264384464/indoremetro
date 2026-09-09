from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.nearby_place import NearbyPlace
from app.repositories.base import BaseRepository

class NearbyPlaceRepository(BaseRepository[NearbyPlace]):
    def __init__(self):
        super().__init__(NearbyPlace)

    def get_by_station(self, db: Session, station_id: str) -> List[NearbyPlace]:
        """Fetch all nearby places associated with a station."""
        return (
            db.query(NearbyPlace)
            .filter(NearbyPlace.station_id == station_id)
            .order_by(NearbyPlace.distance_km.asc())
            .all()
        )

    def search_places(self, db: Session, query_str: str, category: Optional[str] = None) -> List[NearbyPlace]:
        """Search nearby places by keyword or category."""
        query = db.query(NearbyPlace)
        if category:
            query = query.filter(NearbyPlace.category.ilike(f"%{category}%"))
        if query_str:
            query = query.filter(
                (NearbyPlace.name.ilike(f"%{query_str}%")) |
                (NearbyPlace.address.ilike(f"%{query_str}%")) |
                (NearbyPlace.category.ilike(f"%{query_str}%"))
            )
        return query.order_by(NearbyPlace.name.asc()).limit(50).all()

nearby_place_repository = NearbyPlaceRepository()
