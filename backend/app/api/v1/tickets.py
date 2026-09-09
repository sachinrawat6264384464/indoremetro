from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.schemas.ticket import TicketBookRequest
from app.services.ticket_service import TicketService
from app.services.qr_service import QRService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/book", status_code=status.HTTP_201_CREATED)
def book_ticket(req: TicketBookRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = TicketService.book_ticket(db, current_user.id, req)
    return format_success_response(
        data={
            "ticket_id": ticket.id,
            "ticket_number": ticket.ticket_number,
            "passenger_count": ticket.passenger_count,
            "total_fare": float(ticket.total_fare),
            "status": ticket.status
        },
        message="Ticket booking order created. Please proceed to payment."
    )

@router.get("/my-tickets")
def list_my_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tickets = TicketService.get_user_tickets(db, current_user.id)
    result = []
    for t in tickets:
        result.append({
            "id": t.id,
            "ticket_number": t.ticket_number,
            "source_station": {"name": t.source_station.name, "code": t.source_station.code} if t.source_station else None,
            "dest_station": {"name": t.dest_station.name, "code": t.dest_station.code} if t.dest_station else None,
            "journey_date": t.journey_date.isoformat(),
            "passenger_count": t.passenger_count,
            "base_fare": float(t.base_fare),
            "total_fare": float(t.total_fare),
            "status": t.status,
            "qr_code_hash": t.qr_code_hash,
            "expires_at": t.expires_at.isoformat() if t.expires_at else None,
            "created_at": t.created_at.isoformat()
        })
    return format_success_response(data=result)

@router.get("/{ticket_id}")
def get_ticket_detail(ticket_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    t = TicketService.get_ticket_by_id(db, ticket_id, current_user.id)
    
    qr_image_base64 = None
    if t.qr_code_hash:
        qr_image_base64 = QRService.generate_qr_image_base64(t.qr_code_hash)

    passengers_data = [
        {
            "id": p.id,
            "passenger_name": p.passenger_name,
            "passenger_type": p.passenger_type,
            "age": p.age
        } for p in t.passengers
    ]

    return format_success_response(data={
        "id": t.id,
        "ticket_number": t.ticket_number,
        "source_station": {"name": t.source_station.name, "code": t.source_station.code} if t.source_station else None,
        "dest_station": {"name": t.dest_station.name, "code": t.dest_station.code} if t.dest_station else None,
        "journey_date": t.journey_date.isoformat(),
        "passenger_count": t.passenger_count,
        "base_fare": float(t.base_fare),
        "total_fare": float(t.total_fare),
        "status": t.status,
        "qr_code_hash": t.qr_code_hash,
        "qr_image_base64": qr_image_base64,
        "expires_at": t.expires_at.isoformat() if t.expires_at else None,
        "created_at": t.created_at.isoformat(),
        "passengers": passengers_data
    })

@router.post("/{ticket_id}/cancel")
def cancel_ticket(ticket_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    t = TicketService.cancel_ticket(db, ticket_id, current_user.id)
    return format_success_response(data={"ticket_id": t.id, "status": t.status}, message="Ticket cancelled successfully")
