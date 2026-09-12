import uuid
from sqlalchemy import Column, String, Boolean
from app.core.database import Base
from app.models.base import GUID, TimestampMixin


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

    def __repr__(self) -> str:
        return f"<User {self.email}>"
