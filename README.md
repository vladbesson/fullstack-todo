# Fullstack TODO

Учебное приложение для изучения Python backend и его взаимодействия с React.

## Стек

- Backend: Python, FastAPI, Pydantic, uv.
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, pnpm.
- Проверки: pytest, Ruff, BasedPyright, ESLint, Prettier, TypeScript, pre-commit.
- Генерация TypeScript-типов из OpenAPI через Hey API.

API поддерживает создание, получение, изменение статуса и удаление задач. Интерфейс пока отображает список. Данные хранятся в памяти и сбрасываются при перезапуске backend.

## Запуск

Нужны Python, uv, Node.js и pnpm. Команды выполняются из корня проекта.

Backend:

```bash
cd backend
uv sync
uv run fastapi dev main.py
```

Frontend — в отдельном терминале:

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend: http://localhost:5173. Документация API: http://127.0.0.1:8000/docs.

После изменения API обновить типы при запущенном backend:

```bash
pnpm --dir frontend generate:api
```

В планах: полный CRUD в интерфейсе, PostgreSQL, SQLAlchemy, Alembic и права доступа.
