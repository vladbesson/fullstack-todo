from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints


class Task(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool


class TaskCreate(BaseModel):
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
