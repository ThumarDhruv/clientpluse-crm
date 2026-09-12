import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import Base, engine
from app.core.exceptions import AppException
from app.api.v1.router import api_router
from app.api.v1.endpoints import health

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
)
logger = logging.getLogger("clientpulse")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up ClientPulse Customer Management API...")
    # Initialize DB tables for non-testing environment
    if not settings.DATABASE_URL.startswith("sqlite") and settings.APP_ENV != "test":
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables verified.")
        except Exception as e:
            logger.warning(f"Database initialization warning: {e}")
    yield
    logger.info("Shutting down ClientPulse Customer Management API...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade Customer Management REST API built with FastAPI, SQLAlchemy, PostgreSQL, and Redis caching.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Request Timing & Structured Logging Middleware
@app.middleware("http")
async def add_process_time_and_log(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000  # milliseconds
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    
    # Structured access log
    if request.url.path not in ["/health", "/api/v1/health", "/docs", "/openapi.json"]:
        logger.info(
            f"{request.method} {request.url.path} - Status: {response.status_code} - Latency: {process_time:.2f}ms"
        )
    return response


# Configure CORS
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers for standard error response format
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        },
        headers=exc.headers
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err["loc"] if loc != "body"])
        errors.append({
            "field": field,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error")
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed for the submitted payload.",
                "details": errors
            }
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "VALIDATION_ERROR",
        500: "INTERNAL_SERVER_ERROR"
    }
    code = code_map.get(exc.status_code, "ERROR")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": code,
                "message": str(exc.detail),
                "details": None
            }
        },
        headers=exc.headers
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred.",
                "details": None
            }
        }
    )


# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Direct Health Check Aliases for load balancers & monitoring
app.include_router(health.router, prefix="/health", include_in_schema=False)
app.include_router(health.router, prefix="/api/health", include_in_schema=False)


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "Welcome to ClientPulse Customer Management API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": f"{settings.API_V1_PREFIX}/health"
    }
