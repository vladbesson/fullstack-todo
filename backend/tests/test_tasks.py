import pytest
from httpx2 import AsyncClient


@pytest.mark.anyio
async def test_deleted_task_is_not_available(client: AsyncClient) -> None:
    created = await client.post("/tasks", json={"title": "Temporary task"})
    assert created.status_code == 201

    task_id = created.json()["id"]

    deleted = await client.delete(f"/tasks/{task_id}")
    assert deleted.status_code == 204
    assert deleted.content == b""

    fetched = await client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 404


@pytest.mark.anyio
async def test_task_list_is_empty(client: AsyncClient) -> None:
    response = await client.get("/tasks")

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
async def test_task_completion_is_saved(client: AsyncClient) -> None:
    created = await client.post("/tasks", json={"title": "Complete this task"})
    assert created.status_code == 201

    task_id = created.json()["id"]

    updated = await client.patch(
        f"/tasks/{task_id}",
        json={"completed": True},
    )
    assert updated.status_code == 200
    assert updated.json()["completed"] is True

    fetched = await client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["completed"] is True


@pytest.mark.anyio
@pytest.mark.parametrize("method", ["GET", "PATCH", "DELETE"])
@pytest.mark.parametrize("task_id", [-(2**63) - 1, -1, 0, 2**63])
async def test_invalid_task_id_returns_validation_error(
    client: AsyncClient,
    method: str,
    task_id: int,
) -> None:
    response = await client.request(
        method,
        f"/tasks/{task_id}",
        json={"completed": True} if method == "PATCH" else None,
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["path", "task_id"]


@pytest.mark.anyio
@pytest.mark.parametrize("method", ["GET", "PATCH", "DELETE"])
async def test_maximum_task_id_returns_not_found(
    client: AsyncClient,
    method: str,
) -> None:
    response = await client.request(
        method,
        "/tasks/9223372036854775807",
        json={"completed": True} if method == "PATCH" else None,
    )

    assert response.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("title", ["", "   ", "a" * 201])
async def test_invalid_task_title_is_rejected(
    client: AsyncClient,
    title: str,
) -> None:
    response = await client.post("/tasks", json={"title": title})

    assert response.status_code == 422

    tasks = await client.get("/tasks")
    assert tasks.status_code == 200
    assert tasks.json() == []


@pytest.mark.anyio
async def test_task_project_is_saved(client: AsyncClient) -> None:
    project = await client.post("/projects", json={"name": "Backend learning"})
    assert project.status_code == 201
    project_id = project.json()["id"]

    created = await client.post(
        "/tasks",
        json={"title": "Learn relationships", "project_id": project_id},
    )

    assert created.status_code == 201
    assert created.json()["project_id"] == project_id

    fetched = await client.get(f"/tasks/{created.json()['id']}")
    assert fetched.status_code == 200
    assert fetched.json() == created.json()

    tasks = await client.get("/tasks")
    assert tasks.status_code == 200
    assert tasks.json() == [created.json()]


@pytest.mark.anyio
@pytest.mark.parametrize("include_project_id", [False, True])
async def test_task_can_be_created_without_project(
    client: AsyncClient,
    include_project_id: bool,
) -> None:
    payload: dict[str, str | None] = {"title": "Unassigned task"}
    if include_project_id:
        payload["project_id"] = None

    created = await client.post("/tasks", json=payload)

    assert created.status_code == 201
    assert created.json()["project_id"] is None

    fetched = await client.get(f"/tasks/{created.json()['id']}")
    assert fetched.status_code == 200
    assert fetched.json()["project_id"] is None


@pytest.mark.anyio
async def test_task_with_missing_project_is_rejected(client: AsyncClient) -> None:
    response = await client.post(
        "/tasks",
        json={"title": "Invalid project", "project_id": 9_223_372_036_854_775_807},
    )

    assert response.status_code == 422
    assert response.json() == {"detail": "Project not found"}

    tasks = await client.get("/tasks")
    assert tasks.status_code == 200
    assert tasks.json() == []


@pytest.mark.anyio
@pytest.mark.parametrize("project_id", [-(2**63) - 1, -1, 0, 2**63])
async def test_invalid_task_project_id_is_rejected(
    client: AsyncClient,
    project_id: int,
) -> None:
    response = await client.post(
        "/tasks",
        json={"title": "Invalid project ID", "project_id": project_id},
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "project_id"]

    tasks = await client.get("/tasks")
    assert tasks.status_code == 200
    assert tasks.json() == []
