import os
import json
import time
from typing import Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Automatically load variables from .env into Python's environment
load_dotenv()

# Read API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Try reading from core settings if available
try:
    from app.core.config import settings
    if not GEMINI_API_KEY:
        GEMINI_API_KEY = getattr(settings, "GEMINI_API_KEY", None)
except ImportError:
    pass

# Helper to ensure client is ready
def get_client() -> genai.Client:
    key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is missing. Check your .env file in the backend directory.")
    return genai.Client(api_key=key)


def _call_with_retry(fn, max_retries: int = 3, base_delay: float = 2.0):
    """Retry a Gemini API call on transient 503/429 errors with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            error_str = str(e)
            is_transient = any(code in error_str for code in ["503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED"])
            if is_transient and attempt < max_retries - 1:
                wait = base_delay * (2 ** attempt)
                print(f"[Gemini] Transient error (attempt {attempt+1}/{max_retries}), retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise

# ---------------------------------------------------------
# 1. Pydantic Models (Enforcing Strict JSON Output)
# ---------------------------------------------------------

class SchemeRecommendation(BaseModel):
    is_eligible: bool = Field(
        description="True if citizen meets hard criteria (Income <= 5,00,000 INR & Scheduled Caste category)."
    )
    ineligibility_reason: str = Field(
        description="Clear explanation if ineligible (e.g. Income exceeds ₹5.00 Lakh cap). If eligible, write 'N/A'."
    )
    recommended_scheme_code: str = Field(
        description="Exact scheme code: 'MFS' (Micro Finance Scheme), 'TL' (Term Loan), 'ELS' (Education Loan), or 'GBS' (Green Business Scheme)."
    )
    recommended_scheme_name: str = Field(
        description="Full official name of the NSFDC concessional credit scheme."
    )
    max_eligible_loan: int = Field(
        description="Maximum loan limit permitted for this scheme in INR."
    )
    interest_rate_pct: float = Field(
        description="Concessional interest rate percentage per annum (e.g., 4.0, 5.0, 6.0)."
    )
    moratorium_months: int = Field(
        description="Moratorium grace period allowed in months (typically 3 to 12)."
    )
    max_repayment_years: int = Field(
        description="Maximum loan repayment tenure in years excluding moratorium."
    )
    rationale: str = Field(
        description="Short, human-readable reason why this scheme matches the user's intent."
    )


class CertificateVerificationResult(BaseModel):
    is_valid_sc_certificate: bool = Field(
        description="True if the document is a recognized Scheduled Caste (SC) certificate."
    )
    caste_name: str = Field(
        description="Extracted sub-caste/community name stated on the document. If none found, write 'N/A'."
    )
    stated_annual_income: int = Field(
        description="Extracted annual income in INR if mentioned. If none mentioned, output 0."
    )
    is_income_within_limit: bool = Field(
        description="True if extracted income <= 500000 INR, or True if not mentioned on caste cert."
    )
    extracted_name: str = Field(
        description="Beneficiary name extracted from the document. If none found, write 'N/A'."
    )
    document_confidence_score: float = Field(
        description="Confidence score between 0.0 and 1.0 regarding document authenticity and legibility."
    )


# ---------------------------------------------------------
# 2. Service Functions
# ---------------------------------------------------------

def match_scheme(
    annual_income: int,
    project_cost: int,
    loan_purpose: str,
    target_group: str = "SC"
) -> SchemeRecommendation:
    """
    Evaluates applicant parameters against official NSFDC criteria:
    - Micro Finance Scheme (MFS): Projects up to ₹1,40,000 (unit cost). Concessional rate ~5%.
    - Term Loan (TL): Projects up to ₹50,00,000 (NSFDC provides up to 90-95%). Rate 6-9%.
    - Educational Loan Scheme (ELS): For higher/professional education up to ₹20,00,000.
    - Hard Cap: Annual family income MUST NOT exceed ₹5,00,000.
    """
    # Hardcoded safety guardrail before API invocation
    if annual_income > 500000 or target_group.upper() != "SC":
        return SchemeRecommendation(
            is_eligible=False,
            ineligibility_reason="Income exceeds the maximum NSFDC limit of ₹5.00 Lakh/year or category is not SC.",
            recommended_scheme_code="NONE",
            recommended_scheme_name="Ineligible for NSFDC Schemes",
            max_eligible_loan=0,
            interest_rate_pct=0.0,
            moratorium_months=0,
            max_repayment_years=0,
            rationale="Beneficiary does not satisfy primary statutory requirements under Ministry guidelines."
        )

    system_instruction = """
    You are an expert financial assistance rule engine for the National Scheduled Castes Finance and Development Corporation (NSFDC).
    Classify applicant criteria into the most suitable NSFDC concessional credit program:
    1. Micro Finance Scheme (MFS): Project cost <= 1,40,000 INR. Moratorium: 3-6 months. Interest: 5% p.a.
    2. Term Loan (TL): Project cost up to 50,00,000 INR. Moratorium: 6-12 months. Interest: 6-8% p.a.
    3. Education Loan Scheme (ELS): Purpose related to higher education, study, tuition. Moratorium: Course period + 6-12 months. Interest: ~4% p.a.
    4. Green Business Scheme (GBS): Purpose related to e-rickshaws, solar units, organic farming. Moratorium: 6 months. Interest: ~5-6% p.a.

    Always return structured JSON strictly conforming to the provided schema.
    """

    user_prompt = f"""
    Evaluate the following applicant:
    - Target Group / Category: {target_group}
    - Annual Family Income: ₹{annual_income}
    - Estimated Project Cost: ₹{project_cost}
    - Intended Purpose: "{loan_purpose}"
    """

    client = get_client()

    def _call():
        return client.models.generate_content(
            model="gemini-3.6-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=SchemeRecommendation,
                temperature=0.1
            )
        )

    response = _call_with_retry(_call)
    return SchemeRecommendation.model_validate_json(response.text)


def verify_document_ocr(
    image_bytes: bytes,
    mime_type: str = "image/jpeg"
) -> CertificateVerificationResult:
    """
    Uses Gemini Multimodal Vision to inspect government certificates (Caste / Income proof).
    Extracts text, identifies the caste group, and verifies income ceiling.
    """
    system_instruction = """
    You are an AI document verification auditor for the Ministry of Social Justice and Empowerment.
    Analyze the provided certificate image:
    1. Verify if it is an authentic Indian Scheduled Caste (SC) certificate or State Income Certificate.
    2. Extract the beneficiary's full name, stated sub-caste, and annual income (if present).
    3. Verify whether the income is <= 5,00,000 INR.
    4. Provide a confidence score (0.0 to 1.0). If blurry, forged, or unreadable, set low confidence and false validity.

    Always output structured JSON strictly matching the CertificateVerificationResult schema.
    """

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type=mime_type
    )

    client = get_client()

    def _call():
        return client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                "Inspect and extract details from this government certificate image.",
                image_part
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=CertificateVerificationResult,
                temperature=0.0
            )
        )

    response = _call_with_retry(_call)
    return CertificateVerificationResult.model_validate_json(response.text)