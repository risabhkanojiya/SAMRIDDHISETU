"""
Cloud Storage Service.
Wraps Supabase Storage / AWS S3 for the Smart Digi-Vault.
"""
from app.core.config import settings

# TODO: Initialize Supabase client
# from supabase import create_client
# supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


async def upload_file(user_id: str, file_name: str, file_content: bytes, content_type: str) -> str:
    """Upload a file to cloud storage and return the public URL."""
    # TODO: Implement actual Supabase/S3 upload
    file_path = f"vault/{user_id}/{file_name}"
    # response = supabase.storage.from_("documents").upload(file_path, file_content)
    return f"https://storage.example.com/{file_path}"


async def get_file_url(file_path: str) -> str:
    """Get the public URL for a stored file."""
    # TODO: Implement actual URL generation
    return f"https://storage.example.com/{file_path}"


async def delete_file(file_path: str) -> bool:
    """Delete a file from cloud storage."""
    # TODO: Implement actual deletion
    return True
