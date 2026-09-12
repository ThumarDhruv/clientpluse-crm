"""add_user_role

Revision ID: 003_add_user_role
Revises: 002_add_customer_email_unique
Create Date: 2026-09-12 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '003_add_user_role'
down_revision: Union[str, None] = '002_add_customer_email_unique'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
