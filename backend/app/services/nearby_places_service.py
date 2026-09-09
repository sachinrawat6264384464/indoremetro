from sqlalchemy.orm import Session
from app.repositories.nearby_place_repository import nearby_place_repository
from app.repositories.station_repository import station_repository
from app.models.nearby_place import NearbyPlace
from app.core.exceptions import MetroAPIException
from typing import List, Optional

class NearbyPlacesService:
    @staticmethod
    def get_places_by_station(db: Session, station_id: str) -> List[NearbyPlace]:
        station = station_repository.get(db, station_id)
        if not station:
            raise MetroAPIException(status_code=404, code="STATION_NOT_FOUND", message="Station not found")
        return nearby_place_repository.get_by_station(db, station_id)

    @staticmethod
    def search_places(db: Session, query_str: str = "", category: Optional[str] = None) -> List[NearbyPlace]:
        return nearby_place_repository.search_places(db, query_str, category)
