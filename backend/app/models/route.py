import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)  # e.g., YL-UP, YL-DOWN
    line_name = Column(String(50), default="Yellow Line", nullable=False)
    line_color = Column(String(20), default="#F59E0B", nullable=False)
    direction = Column(String(100), nullable=False)  # e.g., "Gandhi Nagar to Radisson Square"
    status = Column(String(20), default="ACTIVE", nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    route_stations = relationship("RouteStation", back_populates="route", order_by="RouteStation.station_order", cascade="all, delete-orphan")

class RouteStation(Base):
    __tablename__ = "route_stations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_id = Column(String(36), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False)
    station_id = Column(String(36), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    station_order = Column(Integer, nullable=False, index=True)
    distance_from_start_km = Column(Float, default=0.0, nullable=False)
    travel_time_mins = Column(Integer, default=2, nullable=False)

    route = relationship("Route", back_populates="route_stations")
    station = relationship("Station", back_populates="route_stations")
