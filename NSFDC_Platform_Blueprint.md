# NSFDC Platform: Complete Implementation Blueprint

This document contains all the necessary context, terminal commands, and core boilerplate code you need to build the `nsfdc-platform` in your Antigravity IDE. You can use this as your master reference.

---

## 1. Project Initialization Commands

Run these commands in your terminal to set up the base structure for the frontend, backend, and database.

### Create Folders & Initialize Next.js (Frontend)
```bash
# Create main project folder
mkdir nsfdc-platform
cd nsfdc-platform

# Initialize Next.js with Tailwind, TypeScript, and App Router
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# Install necessary frontend packages (Zustand for state, Mapbox for maps, Axios)
cd frontend
npm install zustand mapbox-gl axios lucide-react
npm install -D @types/mapbox-gl
cd ..
```

### Initialize FastAPI (Backend)
```bash
# Create backend folders
mkdir -p backend/app/core backend/app/routes backend/app/services database

# Setup Python Virtual Environment
cd backend
python -m venv venv

# Activate Virtual Environment (Windows)
.\venv\Scripts\activate

# Install Backend Dependencies
pip install fastapi uvicorn pydantic python-dotenv asyncpg supabase google-generativeai python-jose[cryptography] passlib[bcrypt] python-multipart
```

---

## 2. Database Schema (`database/schema.sql`)

This script sets up PostGIS for spatial queries (finding nearest partners) and the tables for users, channel partners, and the Smart Digi-Vault.

```sql
-- Enable PostGIS extension for spatial routing
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table (For Authentication & Vault Access)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Channel Partners Table (SCA, RRB, NBFC)
CREATE TABLE channel_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(50) NOT NULL, -- 'SCA', 'RRB', 'NBFC-MFI'
    npa_percentage DECIMAL(5,2),       -- To filter out high NPAs
    fund_utilization DECIMAL(5,2),
    location GEOMETRY(Point, 4326),    -- PostGIS spatial data
    contact_info VARCHAR(255)
);

-- Smart Digi-Vault Table
CREATE TABLE vault_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL, -- e.g., 'AADHAR', 'INCOME_CERT', 'CASTE_CERT'
    file_url VARCHAR(500) NOT NULL,     -- URL to S3/Supabase storage bucket
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Index for fast nearest-neighbor queries
CREATE INDEX idx_channel_partners_location ON channel_partners USING GIST(location);
```

---

## 3. Backend Boilerplate (FastAPI)

### `backend/app/main.py`
The entry point for your FastAPI server.
```python
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
```

---

## 4. Frontend Boilerplate (Next.js)

### State Management: `frontend/src/store/useAppStore.ts`
Use Zustand to manage the user's data across the Recommender, Calculator, and Vault without prop-drilling.

```typescript
import { create } from 'zustand';

interface AppState {
  user: any | null;
  recommendedScheme: string | null;
  emiDetails: any | null;
  vaultDocuments: any[];
  setUser: (user: any) => void;
  setRecommendedScheme: (scheme: string) => void;
  setEmiDetails: (details: any) => void;
  setVaultDocuments: (docs: any[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  recommendedScheme: null,
  emiDetails: null,
  vaultDocuments: [],
  setUser: (user) => set({ user }),
  setRecommendedScheme: (scheme) => set({ recommendedScheme: scheme }),
  setEmiDetails: (details) => set({ emiDetails: details }),
  setVaultDocuments: (docs) => set({ vaultDocuments: docs }),
}));
```

### Main Page Layout: `frontend/src/app/page.tsx`
```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">SamriddhiSetu</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Intelligent financial assistance and scheme recommender for SC beneficiaries.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <Link href="/recommend" className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🔍 AI Scheme Recommender</h2>
          <p className="text-gray-500">Find the right loan or education scheme based on your profile.</p>
        </Link>

        <Link href="/vault" className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">📁 Smart Digi-Vault</h2>
          <p className="text-gray-500">Securely store and auto-attach your documents for applications.</p>
        </Link>
      </div>
    </main>
  );
}
```

---

## Next Steps in your IDE
1. Open your Antigravity IDE in your target directory.
2. Run the commands in **Section 1** in the terminal to set up the scaffolding.
3. Use the Antigravity assistant to start filling out the specific files (`schema.sql`, `main.py`, `page.tsx`) using the code blocks provided here.
4. Let the IDE's agent handle installing the remaining dependencies and running the dev servers (`npm run dev` and `uvicorn app.main:app --reload`).
