from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class DashboardMetricsResponse(BaseModel):
    total_users: int
    total_tickets: int
    today_tickets: int
    total_revenue: float
    today_revenue: float
    successful_payments: int
    failed_payments: int
    active_stations: int
    popular_stations: List[dict]

class AuditLogResponse(BaseModel):
    id: str
    user_email: Optional[str]
    action: str
    resource_type: str
    resource_id: Optional[str]
    old_values: Optional[dict]
    new_values: Optional[dict]
    ip_address: Optional[str]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class UserRoleUpdate(BaseModel):
    role_name: str

