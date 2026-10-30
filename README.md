# 🌉 SamriddhiSetu (समृद्धि सेतु)
### *Bridging Beneficiaries to Financial Empowerment — NSFDC Digital Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?style=flat&logo=postgresql)](https://postgis.net/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-8E75C2?style=flat&logo=googlegemini)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Overview

**SamriddhiSetu** is an intelligent, multi-lingual digital platform built to transform how Scheduled Caste (SC) beneficiaries access concessional credit and educational loans from the **National Scheduled Castes Finance and Development Corporation (NSFDC)**.

In India, financial assistance is routed through a decentralized 'Channel Finance System' consisting of over 100+ State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs. Direct applications to NSFDC are not entertained. However, beneficiaries—particularly in rural and semi-urban areas—face acute challenges:
- Lack of awareness of which credit scheme matches their specific financial profile.
- Difficulty identifying and reaching the nearest active authorized channel partner equipped to process their specific loan category.
- High NPA (Non-Performing Asset) rates at certain partner branches leading to rejection or disbursement delays.
- Repetitive, cumbersome paperwork and physical bank visits.

**SamriddhiSetu** bridges this gap using AI-driven scheme recommendations, dynamic repayment projections with moratorium considerations, a prioritized Smart Digi-Vault, and geo-spatial partner routing that filters out high-NPA institutions.

---

## ✨ Key Features

- 🧠 **Smart Scheme Recommender (AI Engine)**: Powered by **Google Gemini**, users answer 4 simple questions (family income, project type, cost, and education) to receive an instant, accurate scheme match (e.g., Micro Finance Scheme up to ₹1.40L, Term Loan up to ₹50L, Education Loan).
- 🗺️ **Geo-Spatial Partner Locator & Router**: Uses **PostgreSQL + PostGIS** to calculate real-time proximity to authorized SCAs, RRBs, and NBFC-MFIs, automatically filtering out branches with high NPA percentages or poor fund utilization.
- 📂 **Smart Digi-Vault (Document Precedence)**: Upload KYC documents (Aadhaar, Caste Certificate, Income Certificate) once. The vault automatically prioritizes, validates, and packages the exact mandatory proofs needed for the matched scheme.
- 🧮 **Dynamic EMI & Moratorium Calculator**: Interactive sliders tailored to NSFDC concessional interest rates (6.5% – 8%) and moratorium grace periods (3 – 12 months) for transparent financial planning.
- 🎙️ **Multilingual & Voice-First Accessibility**: Native support for regional languages (Hindi & English) with Bhashini integration and voice-guided prompts for rural and low-literacy users.
- 🎨 **Modern Aesthetics**: Built with Next.js 16 App Router, React 19, Framer Motion, GSAP, 3D Canvas rendering, and Tailwind CSS.

---

## 🏗️ Technical Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Zustand](https://github.com/pmndrs/zustand), [Leaflet](https://leafletjs.com/), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+), [Uvicorn](https://www.uvicorn.org/), [Pydantic v2](https://docs.pydantic.dev/) |
| **Database & GIS** | [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/) Extension (ST_Distance queries & spatial indexing) |
| **AI / Machine Learning** | [Google Gemini API](https://ai.google.dev/) (`google-genai` SDK) |
| **Storage & Auth** | [Supabase](https://supabase.com/) / AWS S3, OTP-based secure authentication |
| **Language & Voice** | [Bhashini](https://bhashini.gov.in/) API integration |

---

## 📁 Repository Structure

```text
SamriddhiSetu/
├── NSFDC_Platform_Blueprint.md         # Architecture blueprint & implementation masterplan
├── SamriddhiSetu_PRD.md                 # Product Requirements Document
├── README.md                            # Project documentation
│
└── nsfdc-platform/
    ├── frontend/                        # Next.js App Router (TypeScript, Tailwind, PWA)
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── page.tsx             # Interactive Landing & Scheme Discovery
    │   │   │   ├── recommend/page.tsx   # 4-Step AI Scheme Matching Questionnaire
    │   │   │   ├── results/page.tsx     # Matched Scheme & Dynamic EMI Breakdown
    │   │   │   ├── locator/page.tsx     # Interactive Map & High-NPA Filtered Routing
    │   │   │   ├── vault/page.tsx       # Smart Digi-Vault & Document Precedence
    │   │   │   └── login/page.tsx       # OTP & Phone-based Rural Onboarding
    │   │   ├── components/              # Modular UI components (3D Canvas, GlassCard, etc.)
    │   │   ├── store/                   # Zustand global state management
    │   │   └── lib/                     # API client, i18n localization dictionary
    │   └── package.json
    │
    ├── backend/                         # Python FastAPI REST Service
    │   ├── app/
    │   │   ├── main.py                  # API Gateway, CORS, and route registration
    │   │   ├── core/                    # Config, DB connection, and security
    │   │   ├── routes/                  # API endpoints (recommend, calculate, partners, vault)
    │   │   └── services/                # Gemini AI, PostGIS spatial queries, Bhashini proxy
    │   └── requirements.txt
    │
    └── database/                        # Database schemas & migrations
        ├── schema.sql                   # PostGIS spatial tables & indexes
        └── seed_partners.sql            # Seed channel partners with geospatial coordinates
```

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/risabhkanojiya/SAMRIDDHISETU.git
cd SAMRIDDHISETU
```

### 2. Frontend Setup
```bash
cd nsfdc-platform/frontend
npm install
npm run dev
```
The application will be running at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd ../backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API documentation will be available at `http://localhost:8000/docs`.

---

## 👥 Contributors
Developed by **Team Tatkal** for the **NSFDC Financial Inclusion Hackathon**.
