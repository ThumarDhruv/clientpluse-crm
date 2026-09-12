from typing import TypeVar, Generic, Sequence, Optional
from pydantic import BaseModel

T = TypeVar("T")


def calculate_pagination(total: int, page: int, page_size: int) -> dict:
    """Calculates total pages and offsets."""
    if page_size < 1:
        page_size = 10
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }
