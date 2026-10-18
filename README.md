# Fullstack TODO

[Русский](README.ru.md)

A learning project for exploring Python backend development and its integration with React.

## Stack

- Backend: Python, FastAPI, Pydantic, SQLAlchemy, asyncpg, Alembic, uv.
- Database: PostgreSQL with Docker Compose.
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, pnpm.
- Checks: pytest, Ruff, BasedPyright, ESLint, Prettier, TypeScript, pre-commit.
- TypeScript types generated from OpenAPI using Hey API.

The API supports creating, reading, updating the completion status of, and deleting tasks. The interface currently lists tasks and lets you add new ones. Data is stored in PostgreSQL and persists across backend restarts.

## Getting started

You need Python, uv, Node.js, pnpm, and a running Docker engine with Docker Compose. Run all commands from the repository root.

Before the first run, copy the example configuration:

```bash
cp .env.example .env
```

In `.env`, replace `POSTGRES_PASSWORD=change_me` with a password of your choice for the local database. On the first run with an empty volume, Docker initializes PostgreSQL with the user and database specified by `POSTGRES_USER` and `POSTGRES_DB`. Changing the password in `.env` afterward does not change the existing PostgreSQL user's password.

The same file defines the API URL (`VITE_API_URL`) and allowed frontend origins for CORS (`BACKEND_CORS_ORIGINS`, a JSON array). Restart the development servers after changing these settings.

Install dependencies, start the database, and apply migrations:

```bash
uv sync --project backend --locked
pnpm --dir frontend install --frozen-lockfile
docker compose up -d --wait db
uv run --directory backend alembic upgrade head
```

Start the backend and frontend in two separate terminals:

```bash
pnpm dev:backend
```

```bash
pnpm dev:frontend
```

Frontend: http://localhost:5173. API documentation: http://127.0.0.1:8000/docs.

After changing the API, regenerate the types while the backend is running:

```bash
pnpm generate:api
```

## Checks

Tests use a separate `todo_test` database in the same PostgreSQL instance. Create it once after starting `db`:

```bash
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE todo_test;"'
```

Apply its migrations. Repeat this command whenever new migrations are added:

```bash
POSTGRES_DB=todo_test uv run --directory backend alembic upgrade head
```

Run all checks with one command. It formats the backend and frontend, then runs linters, type checks, API tests, and the frontend production build. Tests require a running database with migrations applied:

```bash
pnpm check
```

To run checks when committing, install the Git hook:

```bash
uv run --project backend pre-commit install
```

`pnpm check` applies formatting before running checks, so formatting changes alone do not require a second run. If a hook modifies files during a commit, it stops the commit: review and stage the changes, then retry.

Planned: full CRUD in the interface, a generated API client, and access control.
