from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate User"
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Authenticate with email and password to receive JWT access token."""
    auth_service = AuthService(db)
    return auth_service.authenticate_user(login_data)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current Authenticated User"
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    """Returns profile for currently authenticated user."""
    return current_user
