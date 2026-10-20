from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import SessionDep
from app.models import ProjectModel, TaskModel
from app.schemas import Task, TaskCreate, TaskUpdate

TaskId = Annotated[int, Path(ge=1, le=9_223_372_036_854_775_807)]

router = APIRouter(prefix="/tasks", tags=["tasks"])


async def get_task_or_404(
    task_id: int,
    session: AsyncSession,
) -> TaskModel:
    task = await session.get(TaskModel, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("", response_model=list[Task])
async def get_tasks(
    session: SessionDep,
    project_id: Annotated[
        int | None,
        Query(ge=1, le=9_223_372_036_854_775_807),
    ] = None,
) -> list[TaskModel]:
    statement = select(TaskModel).order_by(TaskModel.id)

    if project_id is not None:
        statement = statement.where(TaskModel.project_id == project_id)

    result = await session.scalars(statement)
    return list(result.all())


@router.post("", status_code=201, response_model=Task)
async def create_task(task: TaskCreate, session: SessionDep) -> TaskModel:
    if task.project_id is not None:
        project = await session.get(ProjectModel, task.project_id)
        if project is None:
            raise HTTPException(status_code=422, detail="Project not found")

    new_task = TaskModel(title=task.title, project_id=task.project_id)
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    return new_task


@router.get("/{task_id}", response_model=Task)
async def get_task(task_id: TaskId, session: SessionDep) -> TaskModel:
    return await get_task_or_404(task_id, session)


@router.patch("/{task_id}", response_model=Task)
async def update_task(
    task_id: TaskId,
    update: TaskUpdate,
    session: SessionDep,
) -> TaskModel:
    task = await get_task_or_404(task_id, session)
    task.completed = update.completed
    await session.commit()
    return task


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: TaskId, session: SessionDep) -> Response:
    task = await get_task_or_404(task_id, session)
    await session.delete(task)
    await session.commit()
    return Response(status_code=204)
