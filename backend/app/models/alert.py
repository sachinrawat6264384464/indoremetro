import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class ServiceAlert(Base):
    __tablename__ = "service_alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    
    # Severities: INFO, WARNING, CRITICAL
    severity = Column(String(20), default="INFO", nullable=False)
    affected_route_id = Column(String(36), ForeignKey("routes.id"), nullable=True)
    affected_station_id = Column(String(36), ForeignKey("stations.id"), nullable=True)
    
    # Statuses: DRAFT, PUBLISHED, ARCHIVED
    status = Column(String(20), default="DRAFT", nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    affected_route = relationship("Route")
    affected_station = relationship("Station")
