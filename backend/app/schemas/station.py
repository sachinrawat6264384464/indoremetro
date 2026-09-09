from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class StationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    line_name: str = "Yellow Line"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str = "ACTIVE"
    amenities: Optional[List[str]] = []

class StationCreate(StationBase):
    pass

class StationUpdate(BaseModel):
    name: Optional[str] = None
    line_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    amenities: Optional[List[str]] = None

class StationResponse(StationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
