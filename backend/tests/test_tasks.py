from fastapi.testclient import TestClient

from main import app


def test_deleted_task_is_not_available():
    with TestClient(app) as client:
        created = client.post("/tasks", json={"title": "Тестовая задача"})
        assert created.status_code == 201

        task_id = created.json()["id"]

        deleted = client.delete(f"/tasks/{task_id}")
        assert deleted.status_code == 204
        assert deleted.content == b""

        fetched = client.get(f"/tasks/{task_id}")
        assert fetched.status_code == 404
