from sqlalchemy import BigInteger, Identity, String, false
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class TaskModel(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(always=True),
        primary_key=True,
    )
    title: Mapped[str] = mapped_column(String(200))
    completed: Mapped[bool] = mapped_column(server_default=false())
