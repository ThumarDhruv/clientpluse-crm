import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = "sqlite://"

from app.core.config import settings
settings.APP_ENV = "test"
settings.DATABASE_URL = "sqlite://"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.main import app
from app.models.user import User, UserRole
from app.models.customer import Customer, CustomerStatus

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def init_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# --- User fixtures per role ---

@pytest.fixture
def test_user(db):
    """Admin user — full access."""
    user = User(
        email="admin@example.com",
        password_hash=get_password_hash("Admin@123"),
        is_active=True,
        role=UserRole.ADMIN,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def manager_user(db):
    user = User(
        email="manager@example.com",
        password_hash=get_password_hash("Manager@123"),
        is_active=True,
        role=UserRole.MANAGER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def viewer_user(db):
    user = User(
        email="viewer@example.com",
        password_hash=get_password_hash("Viewer@1234"),
        is_active=True,
        role=UserRole.VIEWER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# --- Auth header fixtures ---

@pytest.fixture
def auth_headers(test_user):
    """Admin auth headers."""
    token = create_access_token(subject=str(test_user.id), role=test_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def manager_headers(manager_user):
    token = create_access_token(subject=str(manager_user.id), role=manager_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def viewer_headers(viewer_user):
    token = create_access_token(subject=str(viewer_user.id), role=viewer_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_customer(db):
    customer = Customer(
        name="Elena Rostova",
        email="elena.rostova@hyperion.ai",
        phone="+1 (555) 891-2345",
        company="Hyperion Dynamics",
        status=CustomerStatus.ACTIVE,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer
