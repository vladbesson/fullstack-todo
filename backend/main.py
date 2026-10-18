from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Path, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, StringConstraints
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from db import get_session
from models import TaskModel

SessionDep = Annotated[AsyncSession, Depends(get_session)]
TaskId = Annotated[int, Path(ge=1, le=9_223_372_036_854_775_807)]


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


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)


async def get_task_or_404(
    task_id: int,
    session: AsyncSession,
) -> TaskModel:
    task = await session.get(TaskModel, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}


@app.get("/tasks", response_model=list[Task])
async def get_tasks(session: SessionDep) -> list[TaskModel]:
    statement = select(TaskModel).order_by(TaskModel.id)
    result = await session.scalars(statement)
    return list(result.all())


@app.post("/tasks", status_code=201, response_model=Task)
async def create_task(task: TaskCreate, session: SessionDep) -> TaskModel:
    new_task = TaskModel(title=task.title)
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    return new_task


@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: TaskId, session: SessionDep) -> TaskModel:
    return await get_task_or_404(task_id, session)


@app.patch("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: TaskId,
    update: TaskUpdate,
    session: SessionDep,
) -> TaskModel:
    task = await get_task_or_404(task_id, session)
    task.completed = update.completed
    await session.commit()
    return task


@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: TaskId, session: SessionDep) -> Response:
    task = await get_task_or_404(task_id, session)
    await session.delete(task)
    await session.commit()
    return Response(status_code=204)
