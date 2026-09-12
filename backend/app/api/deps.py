from typing import List
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Authenticates and extracts user from JWT Bearer token."""
    if not token:
        raise UnauthorizedException("Authentication token is missing.")

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise UnauthorizedException("Invalid or expired authentication token.")

    user_id = payload["sub"]
    auth_service = AuthService(db)
    return auth_service.get_user_by_id(user_id)


def require_role(*allowed_roles: UserRole):
    """
    Returns a FastAPI dependency that enforces role-based access.

    Usage:
        Depends(require_role(UserRole.ADMIN, UserRole.MANAGER))
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Access denied. Required role(s): "
                f"{', '.join(r.value for r in allowed_roles)}. "
                f"Your role: {current_user.role.value}."
            )
        return current_user
    return role_checker
