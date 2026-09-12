"""add_user_role

Revision ID: 003_add_user_role
Revises: 002_add_customer_email_unique
Create Date: 2026-09-12 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '003_add_user_role'
down_revision: Union[str, None] = '002_add_customer_email_unique'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop any stale native enum types left from SQLAlchemy create_all() on previous deploys.
    # Both were created incorrectly as native PG ENUMs despite native_enum=False on the models.
    # Safe to run even if they don't exist (IF EXISTS).
    op.execute("DROP TYPE IF EXISTS user_role_enum CASCADE")
    op.execute("DROP TYPE IF EXISTS customer_status_enum CASCADE")

    # Normalize any uppercase enum values that may have been stored before the fix
    op.execute("UPDATE customers SET status = LOWER(status) WHERE status != LOWER(status)")
    op.execute("UPDATE users SET role = LOWER(role) WHERE role != LOWER(role)")

    # Add role column as plain VARCHAR (native_enum=False stores lowercase strings)
    op.add_column(
        'users',
        sa.Column(
            'role',
            sa.String(length=20),
            nullable=False,
            server_default='viewer'
        )
    )
    op.create_index('ix_users_role', 'users', ['role'])


def downgrade() -> None:
    op.drop_index('ix_users_role', table_name='users')
    op.drop_column('users', 'role')
