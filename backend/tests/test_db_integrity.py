import pytest
from sqlalchemy.exc import IntegrityError
from app.models.station import Station
from app.models.user import User

def test_unique_station_code_constraint(db_session):
    st1 = Station(name="Test Station A", code="TEST_UNIQUE_01", line_name="Yellow Line", status="ACTIVE")
    db_session.add(st1)
    db_session.commit()

    # Attempting to add duplicate station code should raise IntegrityError
    st2 = Station(name="Test Station B", code="TEST_UNIQUE_01", line_name="Yellow Line", status="ACTIVE")
    db_session.add(st2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Cleanup test station to keep DB clean for other tests
    db_session.delete(st1)
    db_session.commit()

def test_unique_user_email_constraint(db_session):
    u1 = User(name="User 1", email="duplicate_test@indoremetro.gov.in", password_hash="hashed_pwd")
    db_session.add(u1)
    db_session.commit()

    u2 = User(name="User 2", email="duplicate_test@indoremetro.gov.in", password_hash="hashed_pwd")
    db_session.add(u2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Cleanup test user
    db_session.delete(u1)
    db_session.commit()
