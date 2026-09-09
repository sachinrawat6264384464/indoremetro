import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source_station_id = Column(String(36), ForeignKey("stations.id"), nullable=False)
    dest_station_id = Column(String(36), ForeignKey("stations.id"), nullable=False)
    route_id = Column(String(36), ForeignKey("routes.id"), nullable=True)
    journey_date = Column(Date, nullable=False)
    passenger_count = Column(Integer, default=1, nullable=False)
    base_fare = Column(Numeric(10, 2), nullable=False)
    total_fare = Column(Numeric(10, 2), nullable=False)
    
    # Statuses: PENDING_PAYMENT, CONFIRMED, USED, CANCELLED, EXPIRED, REFUNDED, PAYMENT_FAILED
    status = Column(String(30), default="PENDING_PAYMENT", nullable=False, index=True)
    qr_code_hash = Column(String(500), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="tickets")
    source_station = relationship("Station", foreign_keys=[source_station_id])
    dest_station = relationship("Station", foreign_keys=[dest_station_id])
    route = relationship("Route")
    passengers = relationship("TicketPassenger", back_populates="ticket", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="ticket", uselist=False)
    qr_validations = relationship("QRValidation", back_populates="ticket")

class TicketPassenger(Base):
    __tablename__ = "ticket_passengers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    passenger_name = Column(String(100), nullable=False)
    passenger_type = Column(String(20), default="ADULT", nullable=False)
    age = Column(Integer, nullable=True)

    ticket = relationship("Ticket", back_populates="passengers")
