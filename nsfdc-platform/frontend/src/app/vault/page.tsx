'use client';

import { ShaderBackground } from "@/components/ui/neuro-noise";

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, FileText, CheckCircle, XCircle, Shield, Eye, Trash2, Plus, AlertCircle } from 'lucide-react';
import { uploadVaultDoc } from '@/lib/api';
import { useTranslation } from '@/lib/I18nProvider';

interface VaultDoc {
  id: string;
  type: string;
  label: string;
  status: 'verified' | 'pending' | 'missing';
  fileName?: string;
  uploadedAt?: string;
  fileUrl?: string;
}

const ALL_DOC_TYPES: VaultDoc[] = [
  { id: '1', type: 'AADHAR', label: 'Aadhaar Card', status: 'missing' },
  { id: '2', type: 'CASTE_CERT', label: 'Caste Certificate', status: 'missing' },
  { id: '3', type: 'INCOME_CERT', label: 'Income Certificate', status: 'missing' },
  { id: '4', type: 'ADMISSION_LETTER', label: 'Admission Letter', status: 'missing' },
  { id: '5', type: 'PROJECT_REPORT', label: 'Project Report', status: 'missing' },
];

const statusConfig = {
  verified: { icon: CheckCircle, color: 'text-[#013e4e]', bg: 'bg-emerald-500/10', label: 'Verified' },
  pending: { icon: AlertCircle, color: 'text-[#013e4e]', bg: 'bg-amber-500/10', label: 'Pending' },
  missing: { icon: XCircle, color: 'text-[#9ca3af]', bg: 'bg-black/5', label: 'Not Uploaded' },
};

export default function VaultPage() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState(ALL_DOC_TYPES);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploaded = docs.filter((d) => d.status !== 'missing').length;
  const total = docs.length;
  const completeness = Math.round((uploaded / total) * 100);

  // Reference to store which document type is currently being uploaded
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Default to the first missing doc if no specific type was selected
    const docTypeToUpload = activeUploadType || docs.find((d) => d.status === 'missing')?.type || 'AADHAR';

    setUploading(true);
    try {
      // Send real API request to the backend
      // Using a placeholder user_id 'user123' for now since auth isn't fully connected
      const res = await uploadVaultDoc('user123', docTypeToUpload, file);
      
      // Update UI state on success
      const newFileUrl = URL.createObjectURL(file);
      setDocs((prev) =>
        prev.map((d) =>
          d.type === docTypeToUpload
            ? { 
                ...d, 
                status: (res.data.ai_analysis && !res.data.ai_analysis.is_valid) ? 'pending' : 'verified' as const, 
                fileName: file.name, 
                uploadedAt: new Date().toISOString().slice(0, 10),
                fileUrl: newFileUrl
              }
            : d
        )
      );
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Ensure backend is running and file is valid.');
    } finally {
      setUploading(false);
      setActiveUploadType(null);
      // Reset input so the same file can be selected again
      if (e.target) e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Real drag and drop requires manually taking the file from dataTransfer
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse handleFileSelect logic
      const synthEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(synthEvent);
    }
  };

  const handleDelete = (docType: string) => {
    if (confirm('Are you sure you want to remove this document from your vault?')) {
      setDocs((prev) =>
        prev.map((d) =>
          d.type === docType
            ? { ...d, status: 'missing' as const, fileName: undefined, uploadedAt: undefined }
            : d
        )
      );
    }
  };

  const handlePreview = (doc: VaultDoc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else if (doc.fileName) {
      alert(`Previewing: ${doc.fileName}\n\n(No local file blob available, maybe it was uploaded previously)`);
    } else {
      alert('No file available for preview.');
    }
  };

  return (
    <div className="relative min-h-screen bg-hummingbird-gradient overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-100 mix-blend-multiply pointer-events-none">
        <ShaderBackground className="w-full h-full" />
      </div>
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[#013e4e] mb-4">
              <Shield size={14} />
              {t('vault.badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {t('vault.title')} <span className="text-[#013e4e]">{t('vault.titleHighlight')}</span>
            </h1>
            <p className="text-[#5a5a5a]">{t('vault.desc')}</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Upload + Completeness ── */}
          <div className="space-y-6">
            {/* Completeness Ring */}
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
                  <span className="text-2xl font-bold text-[#272727]">{completeness}%</span>
                  <span className="text-[10px] text-[#5a5a5a]">{t('vault.progress.complete')}</span>
                </div>
              </div>
              <p className="text-sm text-[#5a5a5a]">{uploaded} {t('vault.progress.of')} {total} {t('vault.progress.uploaded')}</p>
            </GlassCard>

            {/* Upload Area */}
            <GlassCard
              hover={false}
              className={`p-8 border-2 border-dashed transition-all duration-300 ${
                dragOver
                  ? '!border-[#013e4e] !bg-[#013e4e]/10'
                  : uploading
                    ? '!border-amber-500/50 !bg-amber-500/5'
                    : '!border-black/5'
              }`}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="text-center cursor-pointer"
                onClick={() => document.getElementById('vault-file-input')?.click()}
              >
                {uploading ? (
                  <div className="py-4">
                    <div className="w-10 h-10 mx-auto mb-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[#013e4e] font-medium">{t('vault.uploading')}</p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-[#013e4e] animate-bounce' : 'text-[#9ca3af]'}`} />
                    <p className="text-sm text-[#5a5a5a] mb-1">
                      <span className="text-[#013e4e] font-medium">{t('vault.upload.click')}</span> {t('vault.upload.drag')}
                    </p>
                    <p className="text-[10px] text-[#9ca3af]">{t('vault.upload.formats')}</p>
                  </>
                )}
                <input id="vault-file-input" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
              </div>
            </GlassCard>
          </div>

          {/* ── Right: Document Grid ── */}
          <div className="lg:col-span-2 space-y-4">
            {docs.map((doc) => {
              const config = statusConfig[doc.status];
              const Icon = config.icon;

              return (
                <GlassCard key={doc.id} className="p-5 group">
                  <div className="flex items-center gap-4">
                    {/* Doc icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                      <FileText size={22} className={config.color} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#272727] text-sm">
                          {doc.type === 'AADHAR' ? t('vault.doc.aadhar') : doc.type === 'CASTE_CERT' ? t('vault.doc.caste') : doc.type === 'INCOME_CERT' ? t('vault.doc.income') : doc.type === 'ADMISSION_LETTER' ? t('vault.doc.admission') : t('vault.doc.project')}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
                          <Icon size={10} />
                          {doc.status === 'verified' ? t('vault.status.verified') : doc.status === 'pending' ? t('vault.status.pending') : t('vault.status.missing')}
                        </span>
                      </div>
                      {doc.fileName && (
                        <p className="text-xs text-[#9ca3af] mt-0.5 truncate">{doc.fileName}</p>
                      )}
                      {doc.uploadedAt && (
                        <p className="text-[10px] text-[#9ca3af]">{t('vault.doc.uploadedOn')} {doc.uploadedAt}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.status !== 'missing' ? (
                        <>
                          <button 
                            onClick={() => handlePreview(doc)}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-blue-400 transition-colors" 
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.type)}
                            className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-red-400 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveUploadType(doc.type);
                            document.getElementById('vault-file-input')?.click();
                          }}
                          className="p-2 rounded-lg bg-[#013e4e]/10 text-[#013e4e] hover:bg-[#013e4e]/15 transition-colors"
                          title="Upload"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}

            {/* Scheme Required Docs Notice */}
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
      </div>
    </div>
  );
}
