import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date
from app.core.database import Base

class FareRule(Base):
    __tablename__ = "fare_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    min_stops = Column(Integer, nullable=False)
    max_stops = Column(Integer, nullable=False)
    fare_amount = Column(Numeric(10, 2), nullable=False)
    effective_from = Column(Date, nullable=True)
    effective_to = Column(Date, nullable=True)
    status = Column(String(20), default="ACTIVE", nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<FareRule {self.min_stops}-{self.max_stops} stops = ₹{self.fare_amount}>"
