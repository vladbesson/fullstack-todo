import pytest
from httpx2 import AsyncClient


@pytest.mark.anyio
async def test_task_list_filters_by_project(client: AsyncClient) -> None:
    first_project = await client.post("/projects", json={"name": "First project"})
    second_project = await client.post("/projects", json={"name": "Second project"})
    assert first_project.status_code == 201
    assert second_project.status_code == 201

    first_id = first_project.json()["id"]
    second_id = second_project.json()["id"]
    payloads = [
        {"title": "First matching task", "project_id": first_id},
        {"title": "Other project task", "project_id": second_id},
        {"title": "Second matching task", "project_id": first_id},
        {"title": "Unassigned task"},
    ]
    created_tasks: list[dict[str, object]] = []
    for payload in payloads:
        created = await client.post("/tasks", json=payload)
        assert created.status_code == 201
        created_tasks.append(created.json())

    first_tasks = await client.get("/tasks", params={"project_id": first_id})
    assert first_tasks.status_code == 200
    assert first_tasks.json() == [created_tasks[0], created_tasks[2]]

    second_tasks = await client.get("/tasks", params={"project_id": second_id})
    assert second_tasks.status_code == 200
    assert second_tasks.json() == [created_tasks[1]]

    all_tasks = await client.get("/tasks")
    assert all_tasks.status_code == 200
    assert all_tasks.json() == created_tasks


@pytest.mark.anyio
@pytest.mark.parametrize("project_exists", [False, True])
async def test_project_filter_returns_empty_list_without_matching_tasks(
    client: AsyncClient,
    project_exists: bool,
) -> None:
    project_id = 9_223_372_036_854_775_807
    if project_exists:
        project = await client.post("/projects", json={"name": "Empty project"})
        assert project.status_code == 201
        project_id = project.json()["id"]

    created = await client.post("/tasks", json={"title": "Unassigned task"})
    assert created.status_code == 201

    response = await client.get("/tasks", params={"project_id": project_id})

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
@pytest.mark.parametrize("project_id", [-(2**63) - 1, -1, 0, 2**63, "abc", ""])
async def test_invalid_project_filter_returns_validation_error(
    client: AsyncClient,
    project_id: int | str,
) -> None:
    response = await client.get("/tasks", params={"project_id": project_id})

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["query", "project_id"]
