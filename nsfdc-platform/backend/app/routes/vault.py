from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.gemini_service import verify_document_ocr

router = APIRouter()

@router.get("/docs")
async def get_vault_documents(user_id: str):
    """Retrieve all documents from the user's Smart Digi-Vault."""
    # TODO: Query vault_documents table by user_id
    return {
        "documents": [],
        "message": "No documents found. Upload your KYC documents to get started.",
    }


@router.post("/docs")
async def upload_document(
    user_id: str = Form(...),
    document_type: str = Form(..., description="e.g., AADHAR, INCOME_CERT, CASTE_CERT"),
    file: UploadFile = File(...),
):
    """
    Upload a document to the Smart Digi-Vault.
    Automatically runs AI OCR verification on Caste and Income certificates.
    """
    # 1. Read the file into bytes
    image_bytes = await file.read()
    
    # 2. Initialize an empty verification result
    ai_verification = None

    # 3. Only run the expensive AI vision on relevant documents
    if document_type in ["CASTE_CERT", "INCOME_CERT"]:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, 
                detail="For AI verification, please upload an image file (JPEG/PNG)."
            )
        
        try:
            # Send the image to our Gemini engine
            ai_verification = verify_document_ocr(
                image_bytes=image_bytes,
                mime_type=file.content_type
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI Vision Error: {str(e)}")

    # 4. Return the standard mock data PLUS the AI's structural analysis
    return {
        "message": f"Document '{file.filename}' uploaded successfully",
        "document_type": document_type,
        "file_url": f"https://storage.example.com/vault/{user_id}/{file.filename}",
        "ai_analysis": ai_verification
    }