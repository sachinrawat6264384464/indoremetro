import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_id = Column(String(36), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False)
    station_id = Column(String(36), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    first_train_time = Column(Time, nullable=False)
    last_train_time = Column(Time, nullable=False)
    peak_frequency_mins = Column(Integer, default=7, nullable=False)
    off_peak_frequency_mins = Column(Integer, default=15, nullable=False)
    operating_days = Column(String(100), default="Monday to Sunday", nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    route = relationship("Route")
    station = relationship("Station")
