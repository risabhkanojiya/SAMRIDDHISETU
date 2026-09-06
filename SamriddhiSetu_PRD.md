# Product Requirements Document (PRD)
**Product Name:** SamriddhiSetu (NSFDC Platform)  
**Team:** Team Tatkal  
**Theme:** Financial Inclusion / FinTech  

---

## 1. Product Overview
**1.1 Background**
To promote the socio-economic empowerment of the Scheduled Caste (SC) population, the government provides financial assistance and educational loans (6.5% to 8% interest). Funds are routed through a 'Channel Finance System' (100+ SCAs, PSBs, RRBs, NBFC-MFIs). Direct applications are not entertained.

**1.2 The Problem**
Citizens lack awareness of which credit scheme fits their needs. They face difficulties identifying the nearest authorized Channel Partner equipped to process their specific loan category. This fragmentation leads to offline confusion, repetitive document submissions, misrouted applications, and disbursement delays.

**1.3 The Solution**
An intelligent, multi-lingual digital platform that bridges the gap between beneficiaries and channelizing agencies through AI-driven recommendations, a personalized document vault, and geo-spatial routing that filters out high-NPA partners.

---

## 2. Target Audience & User Personas
* **Persona 1: The Beneficiary (Primary User)**
  * *Profile:* Rural/Semi-urban SC citizens, students, and micro-entrepreneurs (Annual family income < ₹5.00 Lakhs).
  * *Pain Points:* Low financial literacy, language barriers, repetitive paperwork, not knowing where to apply.
* **Persona 2: The Channel Partner (Secondary User)**
  * *Profile:* Branch managers at State Channelizing Agencies (SCAs), Regional Rural Banks (RRBs), and NBFCs.
  * *Pain Points:* Receiving applications that don't meet their current funding eligibility; high NPA (Non-Performing Asset) rates.

---

## 3. Core Features & Functional Requirements

### 3.1 Multi-lingual Interface (Bhashini Integration)
* **Requirement:** The UI must support multiple regional languages (Hindi, English, etc.) natively.
* **Feature:** Voice-assisted input and text-to-speech for visually impaired or low-literacy users.

### 3.2 Smart Scheme Recommender (AI Engine)
* **Requirement:** An AI/Rule-based engine to match users to schemes (e.g., Micro Finance up to ₹1.40L, Term Loan up to ₹50L, Education Loan).
* **Inputs:** Project type, estimated cost, annual family income, education status.
* **Output:** The single most suitable credit/educational scheme.

### 3.3 Dynamic Financial Calculator
* **Requirement:** A dynamic slider/tool to calculate projected EMIs.
* **Logic:** Must account for specific scheme guidelines (max limits, 6.5% to 15% interest rates) and moratorium periods (3 to 12 months).

### 3.4 Smart Digi-Vault (Document Precedence)
* **Requirement:** A secure cloud storage vault mapped to the user's profile via OTP login.
* **Feature:** Users upload base documents (Aadhar, Income/Caste Certificate) once.
* **Precedence Logic:** When a scheme is recommended, the vault automatically sorts, highlights, and attaches the exact documents required for that specific scheme (e.g., Admission Letter for Education loans; Project Report for Term loans).

### 3.5 Geo-Spatial Partner Locator & Router
* **Requirement:** A map-based interface to identify the nearest eligible Channel Partner.
* **Logic:** 
  1. Calculate physical distance using user GPS coordinates.
  2. Filter partners based on real-time fund utilization and NPA limits (do not route to partners with high overdues).
  3. Digitally submit the application directly to the optimal partner.

---

## 4. User Journey (The "Happy Path")
1. **Onboarding:** User visits platform, selects language (or voice prompt), and logs in via Phone Number + OTP.
2. **Profile & Vault:** User uploads basic KYC documents to their Smart Digi-Vault.
3. **Needs Assessment:** User answers 4 simple questions (Income, Project Cost, Education, Purpose).
4. **Recommendation:** AI analyzes the inputs and recommends "Micro Finance Scheme".
5. **Calculation:** User adjusts loan amount on the EMI calculator to see monthly payments.
6. **Auto-Attachment:** The Smart Digi-Vault automatically pulls the user's Aadhar, Caste Certificate, and Income proof, attaching them to the application.
7. **Routing:** System queries the database, finds a local RRB 5km away with good fund availability, and submits the application.
8. **Tracking:** User receives a digital tracking ID via SMS.

---

## 5. Technical Architecture (Stack)
* **Frontend:** Next.js (React), Tailwind CSS, Zustand (State Management), Mapbox GL JS.
* **Backend:** Python FastAPI (REST APIs), Uvicorn.
* **Database:** PostgreSQL with **PostGIS** extension (for spatial/distance queries).
* **Cloud/Storage:** Supabase Storage or AWS S3 (for the Digi-Vault).
* **AI/External APIs:** 
  * Google Gemini / Scikit-learn (Scheme recommendation logic)
  * Bhashini API (Language translation & Voice-to-Text)

---

### 5.1 Project Directory Structure
```text
nsfdc-platform/
├── frontend/                          # Next.js (PWA + Mobile Responsive)
│   ├── src/
│   │   ├── app/                       
│   │   │   ├── page.tsx               # Landing & Scheme Discovery input
│   │   │   ├── results/page.tsx       # Matched Scheme & EMI breakdown
│   │   │   ├── locator/page.tsx       # Mapbox Partner Locator & routing
│   │   │   ├── vault/page.tsx         # User Dashboard for the Smart Digi-Vault
│   │   │   └── login/page.tsx         # Auth page (OTP/Phone based for rural users)
│   │   ├── components/
│   │   │   ├── EmiCalculator.tsx      # Dynamic moratorium + repayment slider
│   │   │   ├── MapView.tsx            # Mapbox GL container with branch pins
│   │   │   ├── VoiceInput.tsx         # Bhashini audio capture button
│   │   │   ├── DocumentUpload.tsx     # Caste/Income certificate OCR upload
│   │   │   └── VaultManager.tsx       # UI for sorting/previewing prioritized docs
│   │   ├── store/                     # State management (Zustand)
│   │   │   └── useAppStore.ts         # Holds user session, scheme state, and vault docs
│   │   └── lib/
│   │       ├── api.ts                 # Axios calls to FastAPI backend
│   │       └── i18n.ts                # Localization dictionary (Hindi/English)
│   └── package.json
│
├── backend/                           # Python FastAPI Service
│   ├── app/
│   │   ├── main.py                    # App entrypoint, CORS, and route registration
│   │   ├── core/
│   │   │   ├── config.py              # Environment variables (.env reader)
│   │   │   ├── db.py                  # Supabase / PostgreSQL connection client
│   │   │   └── security.py            # JWT / OTP verification logic for Auth
│   │   ├── routes/
│   │   │   ├── auth.py                # POST /send-otp, POST /verify-otp
│   │   │   ├── recommend.py           # POST /recommend (AI matching pipeline)
│   │   │   ├── calculate.py           # POST /calculate-emi (Moratorium logic)
│   │   │   ├── partners.py            # GET /partners/nearest (PostGIS spatial query)
│   │   │   ├── verify.py              # POST /verify-doc (OCR verification)
│   │   │   └── vault.py               # GET & POST /vault/docs (Fetch/Upload to cloud)
│   │   └── services/
│   │       ├── gemini_service.py      # Gemini API calls (Schema-enforced JSON output)
│   │       ├── postgis_service.py     # SQL raw queries for ST_Distance + NPA filter
│   │       ├── storage_service.py     # Supabase Storage / AWS S3 client wrapper
│   │       └── bhashini_service.py    # Backend proxy for Bhashini (protects API keys)
│   ├── requirements.txt
│   └── .env
│
└── database/                          # Seed data & Migrations
    ├── schema.sql                     # PostGIS extension, tables, and spatial indices
    ├── seed_partners.sql              # Mock channel partners with GPS coordinates
    └── 02_vault_schema.sql            # Tables for 'users' and 'vault_documents'
```

---

## 6. Success Metrics (KPIs)
To measure the success of the platform during and after the hackathon:
* **Recommendation Accuracy:** % of users successfully matching with a valid scheme based on NSFDC rules.
* **Application Completion Rate:** % increase in completed applications due to the Smart Digi-Vault reducing drop-offs.
* **Routing Efficiency:** Reduction in misrouted applications sent to partners with high NPAs.
* **Time-to-Apply:** Average time taken for a user to go from landing page to successful application submission (Goal: < 5 minutes).
