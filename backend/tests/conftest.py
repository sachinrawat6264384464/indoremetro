import pytest
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
TEST_DATABASE_URL = "sqlite:///./test_indoremetro.db"
settings.DATABASE_URL = TEST_DATABASE_URL

from app.core.database import Base, get_db
from app.main import app
from seed_data import seed

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    seed()
    yield
    # Cleanup test database tables
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_indoremetro.db"):
        try:
            os.remove("./test_indoremetro.db")
        except Exception:
            pass

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

