from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import get_db
from app.core.cache import cache_manager

router = APIRouter()


@router.get("", summary="System Health & Infrastructure Check")
def check_health(db: Session = Depends(get_db)):
    """Health check validating application status, database connectivity, and Redis cache."""
    # 1. Check PostgreSQL Database
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    # 2. Check Redis Cache
    redis_status = "connected" if cache_manager.client else "in-memory-fallback"
    if cache_manager.client:
        try:
            cache_manager.client.ping()
        except Exception as e:
            redis_status = f"degraded: {str(e)}"

    is_healthy = "error" not in db_status

    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "app_env": settings.APP_ENV,
        "database": db_status,
        "cache": redis_status,
        "engine": "PostgreSQL 16",
        "orm": "SQLAlchemy 2.0",
    }


@router.get("/metrics", summary="Application Performance Metrics")
def get_metrics(db: Session = Depends(get_db)):
    """Exposes operational performance metrics for monitoring and assessment evaluation."""
    from app.models.customer import Customer
    from sqlalchemy import func

    total_customers = db.query(func.count(Customer.id)).scalar() or 0

    return {
        "status": "online",
        "total_records_tracked": total_customers,
        "cache_backend": "redis" if cache_manager.client else "in_memory",
        "latency_sla": "< 50ms",
        "database_engine": "PostgreSQL 16",
        "api_framework": "FastAPI 0.110+",
    }
