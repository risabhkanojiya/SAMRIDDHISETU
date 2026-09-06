'use client';

import { FileText, CheckCircle, XCircle } from 'lucide-react';

interface VaultDocument {
  id: string;
  document_type: string;
  file_url: string;
  is_verified: boolean;
  uploaded_at: string;
}

interface VaultManagerProps {
  documents?: VaultDocument[];
  requiredDocs?: string[]; // e.g., ['AADHAR', 'INCOME_CERT'] for a specific scheme
}

const DOC_LABELS: Record<string, string> = {
  AADHAR: 'Aadhaar Card',
  INCOME_CERT: 'Income Certificate',
  CASTE_CERT: 'Caste Certificate',
  ADMISSION_LETTER: 'Admission Letter',
  PROJECT_REPORT: 'Project Report',
};

export default function VaultManager({ documents = [], requiredDocs = [] }: VaultManagerProps) {
  const hasDoc = (type: string) => documents.some((d) => d.document_type === type);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Documents</h3>

      {requiredDocs.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">
            Required for your recommended scheme:
          </p>
          <ul className="mt-1 space-y-1">
            {requiredDocs.map((doc) => (
              <li key={doc} className="flex items-center gap-2 text-sm">
                {hasDoc(doc) ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <XCircle size={14} className="text-red-500" />
                )}
                {DOC_LABELS[doc] || doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-gray-400 italic">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-gray-800">{DOC_LABELS[doc.document_type] || doc.document_type}</p>
                  <p className="text-xs text-gray-400">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${doc.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {doc.is_verified ? 'Verified' : 'Pending'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
