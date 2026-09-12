from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, get_db
from app.models.customer import CustomerStatus
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.schemas.common import PaginatedResponse
from app.services.customer_service import CustomerService

router = APIRouter()


@router.get(
    "",
    response_model=PaginatedResponse[CustomerResponse],
    status_code=status.HTTP_200_OK,
    summary="List Customers"
)
def list_customers(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search query across name, email, company"),
    status: Optional[str] = Query(None, description="Filter by status or comma-separated statuses (active, inactive, lead)"),
    sort_by: str = Query("created_at", description="Field to sort by (created_at, name, email, company, status)"),
    sort_order: str = Query("desc", description="Sort order direction (asc, desc)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve paginated list of customers with search, status filtering, and sorting."""
    service = CustomerService(db)
    return service.list_customers(
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Customer Details"
)
def get_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve full customer details by ID."""
    service = CustomerService(db)
    return service.get_customer(customer_id)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Customer"
)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new customer profile."""
    service = CustomerService(db)
    return service.create_customer(customer_in)


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Customer"
)
def update_customer(
    customer_id: str,
    customer_in: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update fields of an existing customer."""
    service = CustomerService(db)
    return service.update_customer(customer_id, customer_in)


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Customer"
)
def delete_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an existing customer by ID."""
    service = CustomerService(db)
    service.delete_customer(customer_id)
    return None
