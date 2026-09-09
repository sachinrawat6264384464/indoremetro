from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

class FareCalculateRequest(BaseModel):
    source_station_id: str
    dest_station_id: str
    passenger_count: int = Field(1, ge=1, le=10)

class FareCalculateResponse(BaseModel):
    source_station_name: str
    dest_station_name: str
    stop_count: int
    base_fare_per_passenger: float
    passenger_count: int
    total_fare: float

class FareRuleCreate(BaseModel):
    min_stops: int
    max_stops: int
    fare_amount: float
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None

class FareRuleResponse(BaseModel):
    id: str
    min_stops: int
    max_stops: int
    fare_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
