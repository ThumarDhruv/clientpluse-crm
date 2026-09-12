import uuid
from typing import Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException, BadRequestException
from app.core.cache import cache_manager
from app.models.customer import Customer, CustomerStatus
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.schemas.common import PaginatedResponse


class CustomerService:
    def __init__(self, db: Session):
        self.customer_repo = CustomerRepository(db)

    def _validate_uuid(self, customer_id: str) -> uuid.UUID:
        try:
            return uuid.UUID(str(customer_id))
        except (ValueError, TypeError, AttributeError):
            raise BadRequestException(f"Invalid UUID format: '{customer_id}'", code="INVALID_UUID")

    def get_customer(self, customer_id: str) -> Customer:
        validated_id = self._validate_uuid(customer_id)
        customer = self.customer_repo.get(validated_id)
        if not customer:
            raise NotFoundException(
                message=f"Customer with ID '{customer_id}' was not found.",
                code="CUSTOMER_NOT_FOUND"
            )
        return customer

    def list_customers(
        self,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> PaginatedResponse[CustomerResponse]:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10
        elif page_size > 100:
            page_size = 100

        # Parse potential multi-status e.g. "lead,inactive" or "active"
        parsed_statuses = []
        if status:
            raw_items = [s.strip().lower() for s in str(status).split(",") if s.strip()]
            valid_status_values = {s.value for s in CustomerStatus}
            unrecognized = [item for item in raw_items if item not in valid_status_values]
            if unrecognized:
                raise BadRequestException(
                    f"Invalid status value(s): {', '.join(unrecognized)}. Allowed values: {', '.join(sorted(valid_status_values))}",
                    code="INVALID_STATUS"
                )
            for item in raw_items:
                parsed_statuses.append(CustomerStatus(item))

        skip = (page - 1) * page_size
        items, total = self.customer_repo.get_paginated(
            skip=skip,
            limit=page_size,
            search=search,
            statuses=parsed_statuses if parsed_statuses else None,
            sort_by=sort_by,
            sort_order=sort_order
        )

        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        
        # Check cache for metrics
        cache_key = "customers:metrics"
        metrics = cache_manager.get(cache_key)
        if not metrics:
            metrics = self.customer_repo.get_metrics()
            cache_manager.set(cache_key, metrics, expire_seconds=30)

        return PaginatedResponse[CustomerResponse](
            items=[CustomerResponse.model_validate(c) for c in items],
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages,
            metrics=metrics
        )

    def create_customer(self, customer_in: CustomerCreate) -> Customer:
        existing = self.customer_repo.get_by_email(customer_in.email)
        if existing:
            raise ConflictException(
                message=f"A customer with email '{customer_in.email}' already exists.",
                code="DUPLICATE_EMAIL"
            )

        customer = self.customer_repo.create(customer_in)
        cache_manager.invalidate_pattern("customers:*")
        return customer

    def update_customer(self, customer_id: str, customer_in: CustomerUpdate) -> Customer:
        customer = self.get_customer(customer_id)

        # Check for unique email if updating email
        if customer_in.email and customer_in.email.lower() != customer.email.lower():
            existing = self.customer_repo.get_by_email(customer_in.email)
            if existing and str(existing.id) != str(customer.id):
                raise ConflictException(
                    message=f"A customer with email '{customer_in.email}' already exists.",
                    code="DUPLICATE_EMAIL"
                )

        updated = self.customer_repo.update(customer, customer_in)
        cache_manager.invalidate_pattern("customers:*")
        return updated

    def delete_customer(self, customer_id: str) -> None:
        customer = self.get_customer(customer_id)
        self.customer_repo.delete(customer.id)
        cache_manager.invalidate_pattern("customers:*")
