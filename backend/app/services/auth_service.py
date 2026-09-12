from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.core.exceptions import UnauthorizedException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def authenticate_user(self, login_data: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password.")

        if not user.is_active:
            raise UnauthorizedException("User account is deactivated.")

        access_token = create_access_token(subject=str(user.id), role=user.role.value)
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    def get_user_by_id(self, user_id: str) -> User:
        user = self.user_repo.get(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive session.")
        return user
