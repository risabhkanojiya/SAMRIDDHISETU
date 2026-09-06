import asyncpg
from app.core.config import settings

# Database connection pool
_pool = None


async def get_pool():
    """Get or create the database connection pool."""
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(settings.DATABASE_URL)
    return _pool


async def get_connection():
    """Get a connection from the pool."""
    pool = await get_pool()
    return await pool.acquire()


async def close_pool():
    """Close the database connection pool."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
