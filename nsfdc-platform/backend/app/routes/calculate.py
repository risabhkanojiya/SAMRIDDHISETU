from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class EMIRequest(BaseModel):
    loan_amount: float
    interest_rate: float = 6.5     # Default NSFDC rate
    tenure_months: int = 60        # Default 5-year tenure
    moratorium_months: int = 6     # Grace period before repayment


@router.post("/emi")
async def calculate_emi(request: EMIRequest):
    """
    Calculate EMI with moratorium period support.
    Uses reducing balance method for accurate projections.
    """
    principal = request.loan_amount
    monthly_rate = request.interest_rate / (12 * 100)
    n = request.tenure_months - request.moratorium_months  # Effective repayment months

    if monthly_rate == 0:
        emi = principal / n
    else:
        emi = principal * monthly_rate * (1 + monthly_rate) ** n / ((1 + monthly_rate) ** n - 1)

    total_payment = emi * n
    total_interest = total_payment - principal

    return {
        "emi": round(emi, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
        "effective_tenure_months": n,
        "moratorium_months": request.moratorium_months,
    }
