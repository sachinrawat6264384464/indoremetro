from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.exceptions import format_success_response
from app.models.alert import ServiceAlert
from app.schemas.alert import ServiceAlertCreate
from app.api.deps import require_permission

router = APIRouter(prefix="/alerts", tags=["Service Alerts"])

@router.get("/public")
def list_public_alerts(db: Session = Depends(get_db)):
    alerts = db.query(ServiceAlert).filter(ServiceAlert.status == "PUBLISHED").order_by(ServiceAlert.created_at.desc()).all()
    return format_success_response(data=[
        {
            "id": a.id,
            "title": a.title,
            "message": a.message,
            "severity": a.severity,
            "affected_route_id": a.affected_route_id,
            "affected_station_id": a.affected_station_id,
            "status": a.status,
            "created_at": a.created_at.isoformat()
        } for a in alerts
    ])

@router.post("", dependencies=[Depends(require_permission("alert:create"))])
def create_alert(req: ServiceAlertCreate, db: Session = Depends(get_db)):
    alert = ServiceAlert(
        title=req.title,
        message=req.message,
        severity=req.severity,
        affected_route_id=req.affected_route_id,
        affected_station_id=req.affected_station_id,
        status=req.status
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return format_success_response(data={"id": alert.id, "title": alert.title}, message="Service alert created successfully")
