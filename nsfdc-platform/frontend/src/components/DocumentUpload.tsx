'use client';

import { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onUpload?: (file: File, documentType: string) => void;
}

const DOCUMENT_TYPES = [
  { value: 'AADHAR', label: 'Aadhaar Card' },
  { value: 'INCOME_CERT', label: 'Income Certificate' },
  { value: 'CASTE_CERT', label: 'Caste Certificate' },
  { value: 'ADMISSION_LETTER', label: 'Admission Letter' },
  { value: 'PROJECT_REPORT', label: 'Project Report' },
];

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [selectedType, setSelectedType] = useState('AADHAR');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus('uploading');
    try {
      // TODO: Call uploadVaultDoc API
      onUpload?.(selectedFile, selectedType);
      setStatus('success');
      setSelectedFile(null);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload Document</h3>

      <div className="space-y-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {DOCUMENT_TYPES.map((dt) => (
            <option key={dt.value} value={dt.value}>{dt.label}</option>
          ))}
        </select>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition"
        >
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-500">
            {selectedFile ? selectedFile.name : 'Click to select a file (PDF, JPG, PNG)'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || status === 'uploading'}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
        >
          {status === 'uploading' ? 'Uploading...' : 'Upload Document'}
        </button>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <FileCheck size={18} /> Document uploaded successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={18} /> Upload failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
