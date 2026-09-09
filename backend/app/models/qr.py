import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class QRValidation(Base):
    __tablename__ = "qr_validations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    scanned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    gate_id = Column(String(50), nullable=False, default="GATE-01")
    station_id = Column(String(36), ForeignKey("stations.id"), nullable=True)
    
    # Results: VALID, EXPIRED, ALREADY_USED, INVALID_SIGNATURE
    validation_result = Column(String(30), nullable=False)
    scanned_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)

    ticket = relationship("Ticket", back_populates="qr_validations")
    station = relationship("Station")
    scanned_by_user = relationship("User")
