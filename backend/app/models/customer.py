import enum
import uuid
from sqlalchemy import Column, String, Enum, Index
from app.core.database import Base
from app.models.base import GUID, TimestampMixin


class CustomerStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    LEAD = "lead"


class Customer(Base, TimestampMixin):
    __tablename__ = "customers"

    id = Column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    name = Column(
        String(150),
        nullable=False,
        index=True
    )
    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True
    )
    phone = Column(
        String(30),
        nullable=False
    )
    company = Column(
        String(150),
        nullable=False,
        index=True
    )
    status = Column(
        Enum(CustomerStatus, native_enum=False, values_callable=lambda obj: [e.value for e in obj]),
        default=CustomerStatus.ACTIVE,
        nullable=False,
        index=True
    )

    __table_args__ = (
        Index("ix_customers_status_created_at", "status", "created_at"),
        Index("ix_customers_company_status", "company", "status"),
    )

    def __repr__(self) -> str:
        return f"<Customer {self.name} ({self.company})>"
