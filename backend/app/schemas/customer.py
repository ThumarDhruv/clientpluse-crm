import re
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from app.models.customer import CustomerStatus


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Customer contact name")
    email: EmailStr = Field(..., description="Valid customer email address")
    phone: str = Field(..., min_length=5, max_length=30, description="Customer phone number with country code")
    company: str = Field(..., min_length=2, max_length=150, description="Customer company or account name")
    status: CustomerStatus = Field(default=CustomerStatus.ACTIVE, description="Account lifecycle status")

    @field_validator("email", mode="before")
    def normalize_email(cls, v):
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator("name", "company", "phone", mode="before")
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("Field cannot be empty or whitespace only")
        return v

    @field_validator("phone")
    def validate_phone(cls, v: str) -> str:
        # Basic international / standard phone regex
        cleaned = re.sub(r"[\s\(\)\-\.]", "", v)
        if len(cleaned) < 5 or not re.match(r"^\+?[0-9]{5,20}$", cleaned):
            raise ValueError("Phone number must contain a valid series of 5 to 20 digits (optional leading +)")
        return v.strip()


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=5, max_length=30)
    company: Optional[str] = Field(None, min_length=2, max_length=150)
    status: Optional[CustomerStatus] = None

    @field_validator("email", mode="before")
    def normalize_email(cls, v):
        if v is not None and isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator("name", "company", "phone", mode="before")
    def strip_whitespace(cls, v):
        if v is not None and isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("Field cannot be empty or whitespace only")
        return v

    @field_validator("phone")
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = re.sub(r"[\s\(\)\-\.]", "", v)
            if len(cleaned) < 5 or not re.match(r"^\+?[0-9]{5,20}$", cleaned):
                raise ValueError("Phone number must contain a valid series of 5 to 20 digits (optional leading +)")
            return v.strip()
        return v


class CustomerResponse(CustomerBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerMetrics(BaseModel):
    total_customers: int
    active_count: int
    lead_count: int
    inactive_count: int
