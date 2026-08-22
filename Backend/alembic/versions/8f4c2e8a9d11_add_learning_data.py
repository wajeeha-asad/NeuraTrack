"""add learning paths and focus sessions

Revision ID: 8f4c2e8a9d11
Revises: 445a19263f73
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "8f4c2e8a9d11"
down_revision: Union[str, Sequence[str], None] = "445a19263f73"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "learning_paths",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("difficulty", sa.String(length=30), nullable=False),
        sa.Column("deadline", sa.String(length=10), nullable=False),
        sa.Column("color", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_learning_paths_user_id", "learning_paths", ["user_id"])

    op.create_table(
        "learning_sessions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("path_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["path_id"], ["learning_paths.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_learning_sessions_path_id", "learning_sessions", ["path_id"])

    op.create_table(
        "focus_sessions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("path_id", sa.String(length=36), nullable=True),
        sa.Column("learning_session_id", sa.String(length=36), nullable=True),
        sa.Column("subject", sa.String(length=150), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=True),
        sa.Column("date", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["path_id"], ["learning_paths.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["learning_session_id"], ["learning_sessions.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_focus_sessions_user_id", "focus_sessions", ["user_id"])
    op.create_index("ix_focus_sessions_path_id", "focus_sessions", ["path_id"])
    op.create_index("ix_focus_sessions_learning_session_id", "focus_sessions", ["learning_session_id"])

def downgrade() -> None:
    op.drop_index("ix_focus_sessions_learning_session_id", table_name="focus_sessions")
    op.drop_index("ix_focus_sessions_path_id", table_name="focus_sessions")
    op.drop_index("ix_focus_sessions_user_id", table_name="focus_sessions")
    op.drop_table("focus_sessions")
    op.drop_index("ix_learning_sessions_path_id", table_name="learning_sessions")
    op.drop_table("learning_sessions")
    op.drop_index("ix_learning_paths_user_id", table_name="learning_paths")
    op.drop_table("learning_paths")
