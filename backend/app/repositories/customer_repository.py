from typing import Optional, List, Tuple
from sqlalchemy import or_, desc, asc, func
from sqlalchemy.orm import Session
from app.models.customer import Customer, CustomerStatus
from app.repositories.base import BaseRepository
from app.schemas.customer import CustomerUpdate


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, db: Session):
        super().__init__(Customer, db)

    def get_by_email(self, email: str) -> Optional[Customer]:
        return self.db.query(Customer).filter(Customer.email == email.lower().strip()).first()

    @staticmethod
    def _escape_like(value: str) -> str:
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

    def get_paginated(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        status: Optional[CustomerStatus] = None,
        statuses: Optional[List[CustomerStatus]] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Customer], int]:
        query = self.db.query(Customer)

        # Apply search across name, email, company
        if search and search.strip():
            escaped_term = self._escape_like(search.strip())
            search_pattern = f"%{escaped_term}%"
            query = query.filter(
                or_(
                    Customer.name.ilike(search_pattern, escape="\\"),
                    Customer.email.ilike(search_pattern, escape="\\"),
                    Customer.company.ilike(search_pattern, escape="\\")
                )
            )

        # Apply status filter (multiple or single)
        if statuses and len(statuses) > 0:
            if len(statuses) == 1:
                query = query.filter(Customer.status == statuses[0])
            else:
                query = query.filter(Customer.status.in_(statuses))
        elif status:
            query = query.filter(Customer.status == status)

        # Total matching records before pagination
        total = query.count()

        # Sorting allowlist
        sort_column_map = {
            "created_at": Customer.created_at,
            "updated_at": Customer.updated_at,
            "name": Customer.name,
            "email": Customer.email,
            "company": Customer.company,
            "status": Customer.status
        }
        order_col = sort_column_map.get(sort_by, Customer.created_at)

        if sort_order.lower() == "asc":
            query = query.order_by(asc(order_col))
        else:
            query = query.order_by(desc(order_col))

        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_metrics(self) -> dict:
        """Returns counts for KPI metric cards."""
        total = self.db.query(func.count(Customer.id)).scalar() or 0
        active = self.db.query(func.count(Customer.id)).filter(Customer.status == CustomerStatus.ACTIVE).scalar() or 0
        lead = self.db.query(func.count(Customer.id)).filter(Customer.status == CustomerStatus.LEAD).scalar() or 0
        inactive = self.db.query(func.count(Customer.id)).filter(Customer.status == CustomerStatus.INACTIVE).scalar() or 0

        return {
            "total_customers": total,
            "active_count": active,
            "lead_count": lead,
            "inactive_count": inactive,
        }

    def update(self, db_obj: Customer, obj_in: CustomerUpdate) -> Customer:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
