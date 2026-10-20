from fastapi import APIRouter
from sqlalchemy import select

from app.dependencies import SessionDep
from app.models import ProjectModel
from app.schemas import Project, ProjectCreate

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
async def get_projects(session: SessionDep) -> list[ProjectModel]:
    statement = select(ProjectModel).order_by(ProjectModel.id)
    result = await session.scalars(statement)
    return list(result.all())


@router.post("", status_code=201, response_model=Project)
async def create_project(
    project: ProjectCreate,
    session: SessionDep,
) -> ProjectModel:
    new_project = ProjectModel(name=project.name)
    session.add(new_project)
    await session.commit()
    await session.refresh(new_project)
    return new_project
