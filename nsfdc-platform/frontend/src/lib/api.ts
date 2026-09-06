import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auth ──
export const sendOtp = (phone_number: string) =>
  api.post('/auth/send-otp', { phone_number });

export const verifyOtp = (phone_number: string, otp: string) =>
  api.post('/auth/verify-otp', { phone_number, otp });

// ── Scheme Recommender ──
export const getRecommendation = (data: {
  project_type: string;
  estimated_cost: number;
  annual_income: number;
  education_status: string;
}) => api.post('/recommend/', data);

// ── EMI Calculator ──
export const calculateEmi = (data: {
  loan_amount: number;
  interest_rate?: number;
  tenure_months?: number;
  moratorium_months?: number;
}) => api.post('/calculate/emi', data);

// ── Partners ──
export const getNearestPartners = (lat: number, lng: number, max_npa?: number) =>
  api.get('/partners/nearest', { params: { lat, lng, max_npa } });

// ── Vault ──
export const getVaultDocs = (user_id: string) =>
  api.get('/vault/docs', { params: { user_id } });

export const uploadVaultDoc = (user_id: string, document_type: string, file: File) => {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('document_type', document_type);
  formData.append('file', file);
  return api.post(`/vault/docs`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
