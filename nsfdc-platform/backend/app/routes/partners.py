from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/nearest")
async def get_nearest_partners(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    max_npa: float = Query(5.0, description="Maximum NPA percentage filter"),
    limit: int = Query(5, description="Number of results to return"),
):
    """
    Find nearest Channel Partners using PostGIS spatial queries.
    Filters out partners with high NPA percentages.
    """
    # TODO: Replace with actual PostGIS query via asyncpg
    # SQL would be:
    # SELECT *, ST_Distance(location, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography) AS distance
    # FROM channel_partners
    # WHERE npa_percentage <= %s
    # ORDER BY distance
    # LIMIT %s

    return {
        "partners": [
            {
                "id": 1,
                "name": "State Bank SCA Branch - Delhi",
                "partner_type": "SCA",
                "npa_percentage": 2.5,
                "distance_km": 3.2,
                "contact_info": "+91-11-23456789",
                "lat": lat + 0.01,
                "lng": lng + 0.02,
            }
        ],
        "total": 1,
    }
