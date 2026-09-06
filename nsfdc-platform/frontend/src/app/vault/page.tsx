'use client';

import { useState, useRef } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, FileText, CheckCircle, XCircle, Shield, Eye, Trash2, Plus, AlertCircle, Brain, User, BadgeCheck, IndianRupee, Percent, Loader2, X, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/I18nProvider';
import AnimatedCounter from '@/components/AnimatedCounter';

type DocType = 'AADHAAR' | 'CASTE_CERT' | 'INCOME_CERT' | 'ADMISSION_LETTER' | 'PROJECT_REPORT';
type DocStatus = 'missing' | 'pending' | 'verified';

// ── Types ──────────────────────────────────────────────────
interface AiAnalysis {
  is_valid_sc_certificate: boolean;
  caste_name: string;
  stated_annual_income: number;
  is_income_within_limit: boolean;
  extracted_name: string;
  document_confidence_score: number;
}

interface VaultDoc {
  id: string;
  type: DocType;
  label: string;
  status: DocStatus;
  fileName?: string;
  uploadedAt?: string;
  ai_analysis?: AiAnalysis | null;
  localPreviewUrl?: string;
  fileType?: string;
  aiVerification?: {
    valid: boolean;
    confidence: number;
    extractedFields: Record<string, string>;
  };
}

const BACKEND_URL = 'http://localhost:8000';

const statusConfig = {
  verified: { icon: CheckCircle, color: 'text-[#013e4e]', bg: 'bg-emerald-500/10', label: 'AI Verified' },
  pending: { icon: AlertCircle, color: 'text-[#013e4e]', bg: 'bg-amber-500/10', label: 'Pending Review' },
  missing: { icon: XCircle, color: 'text-[#9ca3af]', bg: 'bg-black/5', label: 'Not Uploaded' },
};

export default function VaultPage() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<VaultDoc[]>([
    { id: '1', type: 'AADHAAR', label: 'Aadhaar Card', status: 'missing' },
    { id: '2', type: 'CASTE_CERT', label: 'Caste Certificate', status: 'missing' },
    { id: '3', type: 'INCOME_CERT', label: 'Income Certificate', status: 'missing' },
    { id: '4', type: 'ADMISSION_LETTER', label: 'Admission Letter', status: 'missing' },
    { id: '5', type: 'PROJECT_REPORT', label: 'Project Report', status: 'missing' },
  ]);
  
  const DOC_TYPES: { value: DocType; label: string; desc: string }[] = [
    { value: 'AADHAAR', label: t('vault.doc.aadhar'), desc: 'Upload front & back' },
    { value: 'CASTE_CERT', label: t('vault.doc.caste'), desc: 'Issued by SDM/Tehsildar' },
    { value: 'INCOME_CERT', label: t('vault.doc.income'), desc: 'Annual family income proof' },
    { value: 'ADMISSION_LETTER', label: t('vault.doc.admission'), desc: 'For education loans only' },
    { value: 'PROJECT_REPORT', label: t('vault.doc.project'), desc: 'For business loans only' },
  ];

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocType | ''>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VaultDoc | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploaded = docs.filter((d) => d.status !== 'missing').length;
  const total = docs.length;
  const completeness = Math.round((uploaded / total) * 100);

  const uploadFile = async (file: File) => {
    if (!selectedDocType) {
      setUploadError('Please select a document type before uploading.');
      return;
    }

    setUploadError(null);
    setUploading(true);

    const localPreviewUrl = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append('user_id', 'demo_user_001');
      formData.append('document_type', selectedDocType);
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/vault/docs`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed (HTTP ${response.status})`);
      }

      const data = await response.json();

      let newStatus: 'verified' | 'pending' = 'pending';
      if (data.ai_analysis) {
        const analysis = data.ai_analysis as AiAnalysis;
        if (analysis.is_valid_sc_certificate && analysis.document_confidence_score >= 0.7) {
          newStatus = 'verified';
        }
      }

      setDocs((prev) =>
        prev.map((d) =>
          d.type === selectedDocType
            ? {
                ...d,
                status: newStatus,
                fileName: file.name,
                uploadedAt: new Date().toISOString().slice(0, 10),
                ai_analysis: data.ai_analysis || null,
                localPreviewUrl,
                fileType: file.type,
              }
            : d
        )
      );

      if (data.ai_analysis) {
        const docId = docs.find((d) => d.type === selectedDocType)?.id;
        if (docId) setExpandedAnalysis(docId);
      }

      setSelectedDocType('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Is the backend running?';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-hummingbird-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e7eb] shadow-sm text-xs font-semibold text-emerald-600 mb-4">
            <Shield size={14} />
            {t('vault.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#272727]">
            {t('vault.title')} <span className="text-emerald-600">{t('vault.titleHighlight')}</span>
          </h1>
          <p className="text-[#5a5a5a] text-lg max-w-2xl mx-auto">
            {t('vault.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <GlassCard hover={false} className="p-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${completeness * 3.27} 327`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#272727]"><AnimatedCounter end={completeness} />%</span>
                  <span className="text-[10px] text-[#5a5a5a]">{t('vault.progress.complete')}</span>
                </div>
              </div>
              <p className="text-sm text-[#5a5a5a]">{uploaded} {t('vault.progress.of')} {total} {t('vault.progress.uploaded')}</p>
            </GlassCard>

            <GlassCard hover={false} className="p-5">
              <label className="block text-sm font-semibold text-[#272727] mb-2">
                {t('vault.doc.select')}
              </label>
              <select
                id="doc-type-select"
                value={selectedDocType}
                onChange={(e) => { setSelectedDocType(e.target.value as DocType); setUploadError(null); }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/5 border border-black/10 text-sm text-[#272727] focus:outline-none focus:ring-2 focus:ring-[#013e4e]/30 transition-all"
              >
                <option value="">{t('vault.doc.choose')}</option>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                <Sparkles size={18} className="shrink-0 mt-0.5 text-blue-600" />
                <p>{t('vault.ai.msg')}</p>
              </div>
            </GlassCard>

            <GlassCard
              hover={false}
              className={`p-8 border-2 border-dashed transition-all duration-300 ${
                !selectedDocType
                  ? '!border-black/5 opacity-50 cursor-not-allowed'
                  : dragOver
                    ? '!border-[#013e4e] !bg-[#013e4e]/10'
                    : uploading
                      ? '!border-amber-500/50 !bg-amber-500/5'
                      : '!border-black/10'
              }`}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); if (selectedDocType) setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={selectedDocType ? handleDrop : (e) => e.preventDefault()}
                className="text-center cursor-pointer"
                onClick={() => selectedDocType && fileInputRef.current?.click()}
              >
                <label className="block text-sm font-semibold text-[#272727] mb-3">
                  2. {t('vault.upload.title')}
                </label>
                {uploading ? (
                  <div className="py-4">
                    <Loader2 size={40} className="mx-auto mb-3 text-[#013e4e] animate-spin" />
                    <p className="text-sm text-[#013e4e] font-medium">
                      {t('vault.uploading')}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-[#013e4e] animate-bounce' : 'text-[#9ca3af]'}`} />
                    <p className="text-sm text-[#5a5a5a] mb-1">
                      {selectedDocType
                        ? <><span className="text-[#013e4e] font-medium">{t('vault.upload.click')}</span> {t('vault.upload.drag')}</>
                        : t('vault.upload.selectFirst')}
                    </p>
                    <p className="text-[10px] text-[#9ca3af]">{t('vault.upload.formats')}</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  id="vault-file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            </GlassCard>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 animate-in fade-in">
                <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{uploadError}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {docs.map((doc) => {
              const config = statusConfig[doc.status];
              const hasAnalysis = !!doc.ai_analysis;
              const isExpanded = expandedAnalysis === doc.id;

              return (
                <GlassCard key={doc.id} className="p-5 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                      <FileText size={22} className={config.color} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#272727] text-sm">
                          {DOC_TYPES.find(d => d.value === doc.type)?.label || doc.label}
                        </h3>
                        {doc.status === 'verified' && (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 size={10} /> {t('vault.status.verified')}
                          </div>
                        )}
                        {doc.status === 'pending' && (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            <Clock size={10} /> {t('vault.status.pending')}
                          </div>
                        )}
                      </div>
                      {doc.fileName && (
                        <p className="text-xs text-[#9ca3af] mt-0.5 truncate">{doc.fileName}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.status !== 'missing' ? (
                        <>
                          {hasAnalysis && (
                            <button
                              onClick={() => setExpandedAnalysis(isExpanded ? null : doc.id)}
                              className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-purple-500/10 text-purple-600' : 'hover:bg-black/5 text-[#5a5a5a] hover:text-purple-500'}`}
                              title="AI Analysis"
                            >
                              <Brain size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-blue-400 transition-colors"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (doc.localPreviewUrl) URL.revokeObjectURL(doc.localPreviewUrl);
                              setDocs((prev) =>
                                prev.map((d) =>
                                  d.id === doc.id
                                    ? { id: d.id, type: d.type, label: d.label, status: 'missing' as const }
                                    : d
                                )
                              );
                              if (expandedAnalysis === doc.id) setExpandedAnalysis(null);
                              if (previewDoc?.id === doc.id) setPreviewDoc(null);
                            }}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDocType(doc.type);
                            setTimeout(() => fileInputRef.current?.click(), 100);
                          }}
                          className="p-2 rounded-lg bg-[#013e4e]/10 text-[#013e4e] hover:bg-[#013e4e]/15 transition-colors"
                          title="Upload"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {hasAnalysis && isExpanded && doc.ai_analysis && (
                    <div className="mt-4 pt-4 border-t border-black/5 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain size={14} className="text-purple-600" />
                        <h4 className="text-xs font-semibold text-purple-700">{t('vault.ai.reportTitle')}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl ${doc.ai_analysis.is_valid_sc_certificate ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <BadgeCheck size={14} className={doc.ai_analysis.is_valid_sc_certificate ? 'text-emerald-600' : 'text-red-500'} />
                            <span className="text-[10px] font-medium text-[#5a5a5a]">SC Certificate</span>
                          </div>
                          <p className={`text-sm font-bold ${doc.ai_analysis.is_valid_sc_certificate ? 'text-emerald-700' : 'text-red-600'}`}>
                            {doc.ai_analysis.is_valid_sc_certificate ? 'Valid ✓' : 'Invalid ✗'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-purple-500/10">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Percent size={14} className="text-purple-600" />
                            <span className="text-[10px] font-medium text-[#5a5a5a]">{t('vault.ai.confidence')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-purple-700">
                              {Math.round(doc.ai_analysis.document_confidence_score * 100)}%
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-500/10">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User size={14} className="text-blue-600" />
                            <span className="text-[10px] font-medium text-[#5a5a5a]">{t('vault.ai.extName')}</span>
                          </div>
                          <p className="text-sm font-bold text-blue-700 truncate">{doc.ai_analysis.extracted_name}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10">
                          <div className="flex items-center gap-1.5 mb-1">
                            <BadgeCheck size={14} className="text-amber-600" />
                            <span className="text-[10px] font-medium text-[#5a5a5a]">{t('vault.ai.caste')}</span>
                          </div>
                          <p className="text-sm font-bold text-amber-700 truncate">{doc.ai_analysis.caste_name}</p>
                        </div>

                        {doc.ai_analysis.stated_annual_income > 0 && (
                          <div className={`p-3 rounded-xl col-span-2 ${doc.ai_analysis.is_income_within_limit ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <IndianRupee size={14} className={doc.ai_analysis.is_income_within_limit ? 'text-emerald-600' : 'text-red-500'} />
                              <span className="text-[10px] font-medium text-[#5a5a5a]">{t('vault.ai.income')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-bold ${doc.ai_analysis.is_income_within_limit ? 'text-emerald-700' : 'text-red-600'}`}>
                                ₹{doc.ai_analysis.stated_annual_income.toLocaleString('en-IN')}
                              </p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${doc.ai_analysis.is_income_within_limit ? 'bg-emerald-500/20 text-emerald-700' : 'bg-red-500/20 text-red-600'}`}>
                                {doc.ai_analysis.is_income_within_limit ? t('vault.ai.withinLimit') : t('vault.ai.exceedsLimit')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}

            <GlassCard hover={false} className="p-5 !border-amber-500/20 !bg-amber-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#013e4e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#013e4e] text-sm mb-1">{t('vault.auto.title')}</h4>
                  <p className="text-xs text-[#5a5a5a]">
                    {t('vault.auto.desc')}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {previewDoc && previewDoc.localPreviewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#013e4e]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#272727]">
                    {DOC_TYPES.find(d => d.value === previewDoc.type)?.label || previewDoc.label}
                  </h3>
                  <p className="text-[10px] text-[#9ca3af]">{previewDoc.fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
              {previewDoc.fileType?.startsWith('image/') ? (
                <img
                  src={previewDoc.localPreviewUrl}
                  alt={previewDoc.label}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                />
              ) : previewDoc.fileType === 'application/pdf' ? (
                <iframe
                  src={previewDoc.localPreviewUrl}
                  title={previewDoc.label}
                  className="w-full h-[70vh] rounded-lg border border-black/5"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto mb-3 text-[#9ca3af]" />
                  <p className="text-sm text-[#5a5a5a]">{t('vault.modal.notAvail')}</p>
                  <a
                    href={previewDoc.localPreviewUrl}
                    download={previewDoc.fileName}
                    className="mt-3 inline-block text-sm text-[#013e4e] font-medium hover:underline"
                  >
                    {t('vault.modal.dl')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
