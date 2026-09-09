from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.stations import router as stations_router
from app.api.v1.routes import router as routes_router
from app.api.v1.journeys import router as journeys_router
from app.api.v1.fares import router as fares_router
from app.api.v1.timetables import router as timetables_router
from app.api.v1.tickets import router as tickets_router
from app.api.v1.payments import router as payments_router
from app.api.v1.qr import router as qr_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.admin import router as admin_router
from app.api.v1.places import router as places_router
from app.api.v1.metro import router as metro_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(stations_router)
api_v1_router.include_router(routes_router)
api_v1_router.include_router(journeys_router)
api_v1_router.include_router(fares_router)
api_v1_router.include_router(timetables_router)
api_v1_router.include_router(tickets_router)
api_v1_router.include_router(payments_router)
api_v1_router.include_router(qr_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(places_router)
api_v1_router.include_router(metro_router)
