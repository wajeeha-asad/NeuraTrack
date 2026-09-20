"""expand notification type length

Revision ID: d91f6a2b7c10
Revises: c2a7f91d4e6b
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d91f6a2b7c10"
down_revision: Union[str, Sequence[str], None] = "c2a7f91d4e6b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "notifications",
        "type",
        existing_type=sa.String(length=50),
        type_=sa.String(length=150),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "notifications",
        "type",
        existing_type=sa.String(length=150),
        type_=sa.String(length=50),
        existing_nullable=False,
    )
