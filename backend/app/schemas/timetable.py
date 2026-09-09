from pydantic import BaseModel
from typing import Optional
from datetime import time

class TimetableResponse(BaseModel):
    id: str
    route_id: str
    station_id: str
    station_name: str
    first_train_time: str
    last_train_time: str
    peak_frequency_mins: int
    off_peak_frequency_mins: int
    operating_days: str
    status: str

    class Config:
        from_attributes = True
