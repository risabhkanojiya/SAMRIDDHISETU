from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class OTPRequest(BaseModel):
    phone_number: str


class OTPVerify(BaseModel):
    phone_number: str
    otp: str


@router.post("/send-otp")
async def send_otp(request: OTPRequest):
    """Send OTP to the user's phone number."""
    # TODO: Integrate with SMS gateway (e.g., Twilio, MSG91)
    return {"message": f"OTP sent to {request.phone_number}", "success": True}


@router.post("/verify-otp")
async def verify_otp(request: OTPVerify):
    """Verify the OTP and return a JWT token."""
    # TODO: Implement actual OTP verification and JWT generation
    return {"message": "OTP verified successfully", "token": "placeholder_jwt_token"}
