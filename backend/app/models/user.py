import enum
import uuid
from sqlalchemy import Column, String, Boolean, Enum
from app.core.database import Base
from app.models.base import GUID, TimestampMixin


class UserRole(str, enum.Enum):
    ADMIN = "admin"      # Full access: read, create, update, delete
    MANAGER = "manager"  # Read, create, update — no delete
    VIEWER = "viewer"    # Read-only


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    password_hash = Column(
        String(255),
        nullable=False
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )
    role = Column(
        Enum(UserRole, name="user_role_enum", native_enum=False, values_callable=lambda obj: [e.value for e in obj]),
        default=UserRole.VIEWER,
        nullable=False,
        index=True
    )

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"
