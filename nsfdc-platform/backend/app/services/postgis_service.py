"""
PostGIS Service for spatial queries.
Handles nearest-neighbor partner lookups with NPA filtering.
"""
from app.core.db import get_pool


async def find_nearest_partners(lat: float, lng: float, max_npa: float = 5.0, limit: int = 5) -> list:
    """
    Find the nearest Channel Partners using PostGIS ST_Distance.
    Filters out partners exceeding the NPA threshold.
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                id, name, partner_type, npa_percentage, fund_utilization, contact_info,
                ST_X(location) AS lng,
                ST_Y(location) AS lat,
                ST_Distance(
                    location,
                    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                ) / 1000.0 AS distance_km
            FROM channel_partners
            WHERE npa_percentage <= $3
            ORDER BY location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
            LIMIT $4
            """,
            lng, lat, max_npa, limit,
        )
        return [dict(row) for row in rows]
