from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.ticket import Ticket, TicketPassenger
from app.repositories.base import BaseRepository

class TicketRepository(BaseRepository[Ticket]):
    def __init__(self):
        super().__init__(Ticket)

    def get_by_ticket_number(self, db: Session, ticket_number: str) -> Optional[Ticket]:
        """Fetch ticket by unique ticket number (e.g., IND-MTR-20260909-XXXXXX)."""
        return (
            db.query(Ticket)
            .filter(Ticket.ticket_number == ticket_number)
            .options(
                joinedload(Ticket.source_station),
                joinedload(Ticket.dest_station),
                joinedload(Ticket.passengers),
                joinedload(Ticket.payment)
            )
            .first()
        )

    def get_user_tickets(
        self, db: Session, user_id: str, limit: int = 50, skip: int = 0
    ) -> List[Ticket]:
        """Fetch tickets owned by a user, ordered newest first."""
        return (
            db.query(Ticket)
            .filter(Ticket.user_id == user_id)
            .options(
                joinedload(Ticket.source_station),
                joinedload(Ticket.dest_station),
                joinedload(Ticket.passengers),
                joinedload(Ticket.payment)
            )
            .order_by(Ticket.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id_and_user(self, db: Session, ticket_id: str, user_id: str) -> Optional[Ticket]:
        """Fetch ticket by ID ensuring ownership by given user_id."""
        return (
            db.query(Ticket)
            .filter(Ticket.id == ticket_id, Ticket.user_id == user_id)
            .options(
                joinedload(Ticket.source_station),
                joinedload(Ticket.dest_station),
                joinedload(Ticket.passengers),
                joinedload(Ticket.payment)
            )
            .first()
        )

    def get_tickets_by_status(self, db: Session, status: str) -> List[Ticket]:
        """Fetch tickets matching status (e.g., PENDING_PAYMENT, CONFIRMED)."""
        return (
            db.query(Ticket)
            .filter(Ticket.status == status)
            .order_by(Ticket.created_at.desc())
            .all()
        )

    def add_passenger(
        self,
        db: Session,
        ticket_id: str,
        passenger_name: str,
        passenger_type: str = "ADULT",
        age: Optional[int] = None
    ) -> TicketPassenger:
        """Add a passenger entry associated with a ticket."""
        passenger = TicketPassenger(
            ticket_id=ticket_id,
            passenger_name=passenger_name,
            passenger_type=passenger_type,
            age=age
        )
        db.add(passenger)
        return passenger

    def update_status(self, db: Session, ticket: Ticket, status: str) -> Ticket:
        """Update ticket status."""
        ticket.status = status
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

ticket_repository = TicketRepository()
