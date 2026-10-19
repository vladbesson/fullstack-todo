import pytest
from httpx2 import AsyncClient


@pytest.mark.anyio
async def test_created_project_is_available_in_list(
    client: AsyncClient,
) -> None:
    created = await client.post(
        "/projects",
        json={"name": "  Interview preparation  "},
    )

    assert created.status_code == 201
    assert created.json()["name"] == "Interview preparation"
    assert isinstance(created.json()["id"], int)

    fetched = await client.get("/projects")

    assert fetched.status_code == 200
    assert fetched.json() == [created.json()]


@pytest.mark.anyio
@pytest.mark.parametrize("name", ["", "   ", "a" * 201])
async def test_invalid_project_name_is_rejected(
    client: AsyncClient,
    name: str,
) -> None:
    response = await client.post(
        "/projects",
        json={"name": name},
    )

    assert response.status_code == 422

    fetched = await client.get("/projects")

    assert fetched.status_code == 200
    assert fetched.json() == []
