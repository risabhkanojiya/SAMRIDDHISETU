from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import recommend, calculate, partners, vault, auth

app = FastAPI(title="SamriddhiSetu API", version="1.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(recommend.router, prefix="/api/recommend", tags=["AI Recommender"])
app.include_router(calculate.router, prefix="/api/calculate", tags=["EMI Calculator"])
app.include_router(partners.router, prefix="/api/partners", tags=["Geo-Routing"])
app.include_router(vault.router, prefix="/api/vault", tags=["Smart Digi-Vault"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "NSFDC Platform API is running"}
