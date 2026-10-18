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
