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
