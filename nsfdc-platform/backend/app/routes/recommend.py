from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import match_scheme, SchemeRecommendation

# Initialize the router with a prefix to match the frontend's API calls
router = APIRouter()

# We keep this EXACTLY as your teammate wrote it so the frontend doesn't break
class RecommendRequest(BaseModel):
    project_type: str       # e.g., 'micro_enterprise', 'education', 'agriculture'
    estimated_cost: float   # Project cost in INR
    annual_income: float    # Family income in INR
    education_status: str   # e.g., 'graduate', 'post_graduate', 'school'

@router.post("/", response_model=SchemeRecommendation)
async def recommend_scheme(request: RecommendRequest):
    """
    AI-powered scheme recommendation engine.
    Matches user profile to the best NSFDC credit/education scheme using Gemini.
    """
    try:
        # Combine project type and education into a descriptive loan purpose for Gemini to analyze
        ai_loan_purpose = f"Project Type: {request.project_type}. Education Level: {request.education_status}."
        
        # Trigger our Gemini AI matching engine
        recommendation = match_scheme(
            annual_income=int(request.annual_income),
            project_cost=int(request.estimated_cost),
            loan_purpose=ai_loan_purpose,
            target_group="SC" # Defaulting to SC as per NSFDC baseline criteria
        )
        return recommendation
        
    except Exception as e:
        # If the AI fails, return a clean 500 error
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")