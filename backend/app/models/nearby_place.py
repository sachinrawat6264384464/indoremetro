import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class NearbyPlace(Base):
    __tablename__ = "nearby_places"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    station_id = Column(String(36), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # Airport, Railway Station, Bus Stand, Hospital, Mall / Shopping, College / University, Government Office, Tourist Place, Hotel, Landmark
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    distance_km = Column(Float, default=0.5, nullable=False)
    address = Column(String(255), nullable=True)
    icon = Column(String(50), default="landmark", nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    station = relationship("Station", backref="nearby_places")

    def __repr__(self):
        return f"<NearbyPlace {self.name} ({self.category})>"
