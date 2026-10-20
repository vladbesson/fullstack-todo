from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


class Task(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
    project_id: int | None


class TaskCreate(BaseModel):
    project_id: int | None = Field(
        default=None,
        ge=1,
        le=9_223_372_036_854_775_807,
    )
    title: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=200,
        ),
    ]


class TaskUpdate(BaseModel):
    completed: bool


class ProjectCreate(BaseModel):
    name: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=200,
        ),
    ]


class Project(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
