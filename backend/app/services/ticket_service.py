import uuid
import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.ticket import Ticket, TicketPassenger
from app.models.station import Station
from app.services.fare_service import FareService
from app.schemas.ticket import TicketBookRequest
from app.core.exceptions import MetroAPIException
from typing import List, Optional

class TicketService:
    @staticmethod
    def _generate_ticket_number() -> str:
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"IND-MTR-{datetime.now().strftime('%Y%m%d')}-{random_suffix}"

    @staticmethod
    def book_ticket(db: Session, user_id: str, req: TicketBookRequest) -> Ticket:
        source_st = db.query(Station).filter(Station.id == req.source_station_id).first()
        dest_st = db.query(Station).filter(Station.id == req.dest_station_id).first()

        if not source_st or not dest_st:
            raise MetroAPIException(status_code=404, code="STATION_NOT_FOUND", message="Selected stations do not exist")

        passenger_count = len(req.passengers)
        stop_count, base_fare, total_fare = FareService.calculate_fare(
            db, req.source_station_id, req.dest_station_id, passenger_count=passenger_count
        )

        ticket = Ticket(
            ticket_number=TicketService._generate_ticket_number(),
            user_id=user_id,
            source_station_id=req.source_station_id,
            dest_station_id=req.dest_station_id,
            journey_date=req.journey_date,
            passenger_count=passenger_count,
            base_fare=base_fare,
            total_fare=total_fare,
            status="PENDING_PAYMENT"
        )
        db.add(ticket)
        db.flush()

        for p in req.passengers:
            tp = TicketPassenger(
                ticket_id=ticket.id,
                passenger_name=p.passenger_name,
                passenger_type=p.passenger_type,
                age=p.age
            )
            db.add(tp)

        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def get_user_tickets(db: Session, user_id: str) -> List[Ticket]:
        return db.query(Ticket).filter(Ticket.user_id == user_id).order_by(Ticket.created_at.desc()).all()

    @staticmethod
    def get_ticket_by_id(db: Session, ticket_id: str, user_id: Optional[str] = None) -> Ticket:
        query = db.query(Ticket).filter(Ticket.id == ticket_id)
        if user_id:
            query = query.filter(Ticket.user_id == user_id)
        ticket = query.first()
        if not ticket:
            raise MetroAPIException(status_code=404, code="TICKET_NOT_FOUND", message="Ticket not found")
        return ticket

    @staticmethod
    def cancel_ticket(db: Session, ticket_id: str, user_id: str) -> Ticket:
        ticket = TicketService.get_ticket_by_id(db, ticket_id, user_id)
        if ticket.status not in ["CONFIRMED", "PENDING_PAYMENT"]:
            raise MetroAPIException(status_code=400, code="CANNOT_CANCEL", message=f"Ticket with status {ticket.status} cannot be cancelled")

        ticket.status = "CANCELLED"
        db.commit()
        db.refresh(ticket)
        return ticket
