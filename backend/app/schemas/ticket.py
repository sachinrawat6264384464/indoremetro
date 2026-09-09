from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import date, datetime
from app.schemas.station import StationResponse

class PassengerInfo(BaseModel):
    passenger_name: str = Field(..., min_length=2, max_length=100)
    passenger_type: str = "ADULT"
    age: Optional[int] = None

class TicketBookRequest(BaseModel):
    source_station_id: str
    dest_station_id: str
    journey_date: date
    passengers: List[PassengerInfo] = Field(..., min_length=1, max_length=10)

class TicketPassengerResponse(BaseModel):
    id: str
    passenger_name: str
    passenger_type: str
    age: Optional[int]

    model_config = ConfigDict(from_attributes=True)

class TicketResponse(BaseModel):
    id: str
    ticket_number: str
    source_station: StationResponse
    dest_station: StationResponse
    journey_date: date
    passenger_count: int
    base_fare: float
    total_fare: float
    status: str
    qr_code_hash: Optional[str]
    expires_at: Optional[datetime]
    created_at: datetime
    passengers: List[TicketPassengerResponse] = []

    model_config = ConfigDict(from_attributes=True)

