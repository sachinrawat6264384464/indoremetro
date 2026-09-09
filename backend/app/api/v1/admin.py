from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timezone
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.api.deps import require_permission
from app.models.user import User
from app.models.ticket import Ticket
from app.models.payment import Payment
from app.models.station import Station
from app.models.audit_log import AuditLog
from app.models.role import Role, UserRole
from app.schemas.admin import UserRoleUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard", dependencies=[Depends(require_permission("admin:access"))])
def get_dashboard_metrics(db: Session = Depends(get_db)):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_tickets = db.query(func.count(Ticket.id)).scalar() or 0
    today_tickets = db.query(func.count(Ticket.id)).filter(Ticket.created_at >= today_start).scalar() or 0
    
    total_revenue = float(db.query(func.sum(Payment.amount)).filter(Payment.status == "SUCCESS").scalar() or 0.0)
    today_revenue = float(db.query(func.sum(Payment.amount)).filter(Payment.status == "SUCCESS", Payment.created_at >= today_start).scalar() or 0.0)
    
    successful_payments = db.query(func.count(Payment.id)).filter(Payment.status == "SUCCESS").scalar() or 0
    failed_payments = db.query(func.count(Payment.id)).filter(Payment.status == "FAILED").scalar() or 0
    active_stations = db.query(func.count(Station.id)).filter(Station.status == "ACTIVE").scalar() or 0

    popular_stations = [
        {"name": "Gandhi Nagar", "bookings": 320},
        {"name": "Vijay Nagar Square", "bookings": 290},
        {"name": "Radisson Square", "bookings": 210},
        {"name": "ISBT / MR 10", "bookings": 180},
        {"name": "Palasia", "bookings": 150}
    ]

    return format_success_response(data={
        "total_users": total_users,
        "total_tickets": total_tickets,
        "today_tickets": today_tickets,
        "total_revenue": total_revenue,
        "today_revenue": today_revenue,
        "successful_payments": successful_payments,
        "failed_payments": failed_payments,
        "active_stations": active_stations,
        "popular_stations": popular_stations
    })

@router.get("/users", dependencies=[Depends(require_permission("user:view"))])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        roles = [ur.role.name for ur in u.roles if ur.role]
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "is_active": u.is_active,
            "roles": roles,
            "created_at": u.created_at.isoformat()
        })
    return format_success_response(data=result)

@router.put("/users/{user_id}/role", dependencies=[Depends(require_permission("user:update"))])
def update_user_role(user_id: str, req: UserRoleUpdate, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.name == req.role_name.upper()).first()
    if not role:
        return format_success_response(message=f"Role {req.role_name} not found", data={})

    # Clear existing roles and set new role
    db.query(UserRole).filter(UserRole.user_id == user_id).delete()
    db.add(UserRole(user_id=user_id, role_id=role.id))
    db.commit()
    return format_success_response(message=f"User role updated to {req.role_name}")

@router.get("/tickets", dependencies=[Depends(require_permission("ticket:view"))])
def list_all_tickets(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).order_by(Ticket.created_at.desc()).limit(100).all()
    result = []
    for t in tickets:
        result.append({
            "id": t.id,
            "ticket_number": t.ticket_number,
            "user_email": t.user.email if t.user else "",
            "source_station": t.source_station.name if t.source_station else "",
            "dest_station": t.dest_station.name if t.dest_station else "",
            "passenger_count": t.passenger_count,
            "total_fare": float(t.total_fare),
            "status": t.status,
            "created_at": t.created_at.isoformat()
        })
    return format_success_response(data=result)

@router.get("/payments", dependencies=[Depends(require_permission("payment:view"))])
def list_all_payments(db: Session = Depends(get_db)):
    payments = db.query(Payment).order_by(Payment.created_at.desc()).limit(100).all()
    result = []
    for p in payments:
        result.append({
            "id": p.id,
            "ticket_id": p.ticket_id,
            "razorpay_order_id": p.razorpay_order_id,
            "razorpay_payment_id": p.razorpay_payment_id,
            "amount": float(p.amount),
            "status": p.status,
            "created_at": p.created_at.isoformat()
        })
    return format_success_response(data=result)

@router.get("/audit-logs", dependencies=[Depends(require_permission("admin:access"))])
def list_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "user_email": log.user.email if log.user else "System",
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "timestamp": log.timestamp.isoformat()
        })
    return format_success_response(data=result)
