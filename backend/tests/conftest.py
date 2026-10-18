from collections.abc import AsyncIterator

import pytest
from httpx2 import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from db import database_url, get_session
from main import app


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
async def test_session_factory(
    anyio_backend: str,
) -> AsyncIterator[async_sessionmaker[AsyncSession]]:
    test_url = database_url.set(database="todo_test")
    if test_url.database == database_url.database:
        raise ValueError("Application and test databases must be different.")

    test_engine = create_async_engine(test_url)
    try:
        async with test_engine.connect() as connection:
            transaction = await connection.begin()
            try:
                yield async_sessionmaker(
                    bind=connection,
                    expire_on_commit=False,
                    join_transaction_mode="create_savepoint",
                )
            finally:
                await transaction.rollback()
    finally:
        await test_engine.dispose()


@pytest.fixture
async def client(
    test_session_factory: async_sessionmaker[AsyncSession],
) -> AsyncIterator[AsyncClient]:
    async def override_get_session() -> AsyncIterator[AsyncSession]:
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_session, None)
