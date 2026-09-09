from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.station import StationResponse

class RouteStationResponse(BaseModel):
    id: str
    station_order: int
    distance_from_start_km: float
    travel_time_mins: int
    station: StationResponse

    class Config:
        from_attributes = True

class RouteResponse(BaseModel):
    id: str
    name: str
    code: str
    line_name: str
    line_color: str
    direction: str
    status: str
    route_stations: List[RouteStationResponse] = []

    class Config:
        from_attributes = True

class RouteStationOrderUpdate(BaseModel):
    station_id: str
    station_order: int
    distance_from_start_km: Optional[float] = 0.0
    travel_time_mins: Optional[int] = 2
