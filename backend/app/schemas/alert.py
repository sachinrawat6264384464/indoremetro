from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ServiceAlertCreate(BaseModel):
    title: str
    message: str
    severity: str = "INFO"  # INFO, WARNING, CRITICAL
    affected_route_id: Optional[str] = None
    affected_station_id: Optional[str] = None
    status: str = "PUBLISHED"  # DRAFT, PUBLISHED, ARCHIVED

class ServiceAlertResponse(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    affected_route_id: Optional[str]
    affected_station_id: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
