'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, FileText, CheckCircle, XCircle, Shield, Eye, Trash2, Plus, AlertCircle } from 'lucide-react';

interface VaultDoc {
  id: string;
  type: string;
  label: string;
  status: 'verified' | 'pending' | 'missing';
  fileName?: string;
  uploadedAt?: string;
}

const ALL_DOC_TYPES: VaultDoc[] = [
  { id: '1', type: 'AADHAR', label: 'Aadhaar Card', status: 'verified', fileName: 'aadhar_card.pdf', uploadedAt: '2024-12-15' },
  { id: '2', type: 'CASTE_CERT', label: 'Caste Certificate', status: 'verified', fileName: 'caste_cert.pdf', uploadedAt: '2024-12-15' },
  { id: '3', type: 'INCOME_CERT', label: 'Income Certificate', status: 'pending', fileName: 'income_proof.jpg', uploadedAt: '2025-01-02' },
  { id: '4', type: 'ADMISSION_LETTER', label: 'Admission Letter', status: 'missing' },
  { id: '5', type: 'PROJECT_REPORT', label: 'Project Report', status: 'missing' },
];

const statusConfig = {
  verified: { icon: CheckCircle, color: 'text-[#013e4e]', bg: 'bg-emerald-500/10', label: 'Verified' },
  pending: { icon: AlertCircle, color: 'text-[#013e4e]', bg: 'bg-amber-500/10', label: 'Pending' },
  missing: { icon: XCircle, color: 'text-[#9ca3af]', bg: 'bg-black/5', label: 'Not Uploaded' },
};

export default function VaultPage() {
  const [docs, setDocs] = useState(ALL_DOC_TYPES);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploaded = docs.filter((d) => d.status !== 'missing').length;
  const total = docs.length;
  const completeness = Math.round((uploaded / total) * 100);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Simulate upload
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      // Mark first missing doc as pending
      setDocs((prev) =>
        prev.map((d, i) =>
          d.status === 'missing' && !prev.slice(0, i).some((p) => p.status === 'missing')
            ? { ...d, status: 'pending' as const, fileName: 'uploaded_doc.pdf', uploadedAt: new Date().toISOString().slice(0, 10) }
            : d
        )
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-hummingbird-gradient">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-emerald-300 mb-4">
            <Shield size={14} />
            Encrypted & Secure
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Smart <span className="text-[#013e4e]">Digi-Vault</span>
          </h1>
          <p className="text-[#5a5a5a]">Upload once, auto-attach everywhere. Your documents are safe with us.</p>
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
                  <span className="text-[10px] text-[#5a5a5a]">Complete</span>
                </div>
              </div>
              <p className="text-sm text-[#5a5a5a]">{uploaded} of {total} documents uploaded</p>
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
                    <p className="text-sm text-[#013e4e] font-medium">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-[#013e4e] animate-bounce' : 'text-[#9ca3af]'}`} />
                    <p className="text-sm text-[#5a5a5a] mb-1">
                      <span className="text-[#013e4e] font-medium">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-[10px] text-[#9ca3af]">PDF, JPG, PNG (max 5MB)</p>
                  </>
                )}
                <input id="vault-file-input" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
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
                        <h3 className="font-semibold text-[#272727] text-sm">{doc.label}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
                          <Icon size={10} />
                          {config.label}
                        </span>
                      </div>
                      {doc.fileName && (
                        <p className="text-xs text-[#9ca3af] mt-0.5 truncate">{doc.fileName}</p>
                      )}
                      {doc.uploadedAt && (
                        <p className="text-[10px] text-[#9ca3af]">Uploaded: {doc.uploadedAt}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.status !== 'missing' ? (
                        <>
                          <button className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-blue-400 transition-colors" title="Preview">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-black/5 text-[#5a5a5a] hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => document.getElementById('vault-file-input')?.click()}
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
                  <h4 className="font-semibold text-[#013e4e] text-sm mb-1">Auto-attachment Ready</h4>
                  <p className="text-xs text-[#5a5a5a]">
                    When you apply for a scheme, SamriddhiSetu will automatically pull the required documents
                    from your vault and attach them to your application. No re-uploads needed.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
