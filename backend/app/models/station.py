import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, JSON, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    hindi_name = Column(String(100), nullable=True)
    area = Column(String(100), nullable=True)
    station_number = Column(Integer, nullable=True)
    line_name = Column(String(50), default="Yellow Line", nullable=False)
    timings = Column(String(50), default="06:00 AM - 10:00 PM", nullable=True)
    base_fare = Column(String(50), default="₹10", nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, INACTIVE, UNDER_CONSTRUCTION
    amenities = Column(JSON, nullable=True)  # ["Wi-Fi", "Elevator", "Parking", "ATM"]
    gates = Column(JSON, nullable=True)
    nearby_transport = Column(JSON, nullable=True)
    parking_charges = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    route_stations = relationship("RouteStation", back_populates="station")

    def __repr__(self):
        return f"<Station {self.code} - {self.name}>"

