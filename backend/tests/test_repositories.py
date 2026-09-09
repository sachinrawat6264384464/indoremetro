import pytest
from app.core.database import SessionLocal
from app.repositories import (
    user_repository,
    station_repository,
    route_repository,
    fare_repository,
    ticket_repository,
    payment_repository,
)

@pytest.fixture
def db(db_session):
    return db_session

def test_station_repository(db):
    stations = station_repository.get_all(db)
    assert isinstance(stations, list)
    if len(stations) > 0:
        st = station_repository.get_by_code(db, stations[0].code)
        assert st is not None
        assert st.code == stations[0].code

def test_user_repository(db):
    user = user_repository.get_by_email(db, "test@example.com")
    # Even if None, call should execute cleanly
    active_users = user_repository.get_active_users(db)
    assert isinstance(active_users, list)

def test_route_repository(db):
    routes = route_repository.get_active_routes(db)
    assert isinstance(routes, list)

def test_fare_repository(db):
    rules = fare_repository.get_active_rules(db)
    assert isinstance(rules, list)

def test_ticket_repository(db):
    tickets = ticket_repository.get_tickets_by_status(db, "CONFIRMED")
    assert isinstance(tickets, list)

def test_payment_repository(db):
    payment = payment_repository.get_by_razorpay_order_id(db, "order_non_existent")
    assert payment is None
