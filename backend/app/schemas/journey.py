from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.station import StationResponse

class JourneyPlanRequest(BaseModel):
    source_station_id: str
    dest_station_id: str

class JourneyStepResponse(BaseModel):
    station_order: int
    station: StationResponse

class JourneyPlanResponse(BaseModel):
    source_station: StationResponse
    dest_station: StationResponse
    route_name: str
    direction: str
    stop_count: int
    estimated_time_mins: int
    distance_km: float
    fare_amount: float
    intermediate_stations: List[JourneyStepResponse]
