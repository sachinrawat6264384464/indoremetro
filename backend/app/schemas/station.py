from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class StationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    hindi_name: Optional[str] = None
    area: Optional[str] = None
    station_number: Optional[int] = None
    line_name: str = "Yellow Line"
    timings: Optional[str] = "06:00 AM - 10:00 PM"
    base_fare: Optional[str] = "₹10"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str = "ACTIVE"
    amenities: Optional[List[str]] = []
    gates: Optional[List[Any]] = []
    nearby_transport: Optional[List[Any]] = []
    parking_charges: Optional[List[Any]] = []

class StationCreate(StationBase):
    pass

class StationUpdate(BaseModel):
    name: Optional[str] = None
    hindi_name: Optional[str] = None
    area: Optional[str] = None
    station_number: Optional[int] = None
    line_name: Optional[str] = None
    timings: Optional[str] = None
    base_fare: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    amenities: Optional[List[str]] = None
    gates: Optional[List[Any]] = None
    nearby_transport: Optional[List[Any]] = None
    parking_charges: Optional[List[Any]] = None

class StationResponse(StationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

