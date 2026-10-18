# Fullstack TODO

[English](README.md)

Учебное приложение для изучения Python backend и его взаимодействия с React.

## Стек

- Backend: Python, FastAPI, Pydantic, SQLAlchemy, asyncpg, Alembic, uv.
- База данных: PostgreSQL в Docker Compose.
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, pnpm.
- Проверки: pytest, Ruff, BasedPyright, ESLint, Prettier, TypeScript, pre-commit.
- Генерация TypeScript-типов и API-клиента на основе Fetch из OpenAPI через Hey API.

API и интерфейс поддерживают создание, просмотр, завершение, возврат к выполнению и удаление задач. Данные хранятся в PostgreSQL и сохраняются после перезапуска backend. Для действий с задачами отображаются ошибки, а кнопки блокируются на время запроса.

## Запуск

Нужны Python, uv, Node.js, pnpm и запущенный Docker с Docker Compose. Все команды выполняются из корня проекта.

Перед первым запуском скопируйте образец настроек:

```bash
cp .env.example .env
```

В `.env` замените `POSTGRES_PASSWORD=change_me` своим паролем для локальной базы. Docker создаст пользователя и базу из `POSTGRES_USER` и `POSTGRES_DB` при первом запуске с пустым томом. Смена пароля в `.env` после этого не меняет пароль существующего пользователя PostgreSQL.

В этом же файле задаются адрес API (`VITE_API_URL`) и разрешённые адреса фронтенда для CORS (`BACKEND_CORS_ORIGINS`, JSON-массив). После изменения настроек перезапустите серверы разработки.

Установите зависимости, запустите базу и примените миграции:

```bash
uv sync --project backend --locked
pnpm --dir frontend install --frozen-lockfile
docker compose up -d --wait db
uv run --directory backend alembic upgrade head
```

Запустите backend и frontend в двух отдельных терминалах:

```bash
pnpm dev:backend
```

```bash
pnpm dev:frontend
```

Frontend: http://localhost:5173. Документация API: http://127.0.0.1:8000/docs.

После изменения API обновите типы и API-клиент при запущенном backend:

```bash
pnpm generate:api
```

## Проверки

Тесты используют отдельную базу `todo_test` в том же PostgreSQL. Создайте её один раз после запуска `db`:

```bash
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE todo_test;"'
```

Примените к ней миграции; повторяйте эту команду после добавления новых миграций:

```bash
POSTGRES_DB=todo_test uv run --directory backend alembic upgrade head
```

Для полной проверки достаточно одной команды. Она сначала форматирует backend и frontend, затем запускает линтеры, проверку типов, API-тесты и сборку frontend. Для тестов нужны запущенная база и применённые миграции:

```bash
pnpm check
```

Чтобы проверки запускались при коммите, установите Git-хук:

```bash
uv run --project backend pre-commit install
```

`pnpm check` применяет форматирование до проверок, поэтому изменения форматирования сами по себе не требуют повторного запуска. Если форматирование изменилось при коммите, Git-хук остановит коммит: просмотрите изменения и повторите его.

В планах: права доступа.
