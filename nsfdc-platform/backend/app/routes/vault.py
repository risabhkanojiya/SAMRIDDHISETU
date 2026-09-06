from fastapi import APIRouter, UploadFile, File

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
    user_id: str,
    document_type: str,
    file: UploadFile = File(...),
):
    """
    Upload a document to the Smart Digi-Vault.
    Supported types: AADHAR, INCOME_CERT, CASTE_CERT, ADMISSION_LETTER, PROJECT_REPORT
    """
    # TODO: Upload to Supabase Storage / AWS S3, store metadata in vault_documents table
    return {
        "message": f"Document '{file.filename}' uploaded successfully",
        "document_type": document_type,
        "file_url": f"https://storage.example.com/vault/{user_id}/{file.filename}",
    }
