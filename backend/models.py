from sqlalchemy import BigInteger, ForeignKey, Identity, String, false
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
    project_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "projects.id",
            name="fk_tasks_project_id_projects",
        ),
    )
    title: Mapped[str] = mapped_column(String(200))
    completed: Mapped[bool] = mapped_column(server_default=false())


class ProjectModel(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(always=True),
        primary_key=True,
    )
    name: Mapped[str] = mapped_column(String(200))
