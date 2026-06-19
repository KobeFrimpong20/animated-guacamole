'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface UploadResult {
  success: number;
  skipped: number;
  errors: { row: number; error: string }[];
}

export default function ImportSchedulesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/schedule/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload schedules');
      }

      setResult(data);
      setStatus('complete');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-brand-text">Import Schedules</h1>
        <p className="text-brand-muted">
          Upload a CSV file to bulk import tutoring sessions into your center.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center text-brand-muted">
              <Upload className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-brand-text">Choose a CSV file</h2>
          <p className="text-sm text-brand-muted mb-8">
            Your CSV should include: Date (MM/DD/YYYY), Time (02:00PM), Tutor Email, Parent Email, and Student Name.
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />

          <label
            htmlFor="csv-upload"
            className="block w-full py-3 px-4 bg-brand-card border border-dashed border-brand-border rounded-xl cursor-pointer hover:bg-[#D8D1C7] transition-all mb-4 text-brand-muted"
          >
            {file ? file.name : 'Select file...'}
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
            className="w-full py-3 px-6 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'uploading' ? 'Importing...' : 'Start Import'}
          </button>
        </div>
      </div>

      {/* Success/Summary State */}
      {status === 'complete' && result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
            <div>
              <p className="text-sm text-emerald-700 font-medium">Imported</p>
              <p className="text-2xl font-bold text-emerald-800">{result.success}</p>
            </div>
          </div>
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
            <AlertCircle className="text-amber-600 w-8 h-8" />
            <div>
              <p className="text-sm text-amber-700 font-medium">Skipped (Duplicates)</p>
              <p className="text-2xl font-bold text-amber-800">{result.skipped}</p>
            </div>
          </div>
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4">
            <X className="text-rose-600 w-8 h-8" />
            <div>
              <p className="text-sm text-rose-700 font-medium">Errors</p>
              <p className="text-2xl font-bold text-rose-800">{result.errors.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {(status === 'error' || (result && result.errors.length > 0)) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-brand-border flex items-center justify-between bg-rose-50">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-bold text-lg">Import Errors</h3>
              </div>
              <button
                onClick={() => {
                  if (status === 'error') setStatus('idle');
                  if (result) setResult({ ...result, errors: [] });
                }}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-4 bg-rose-50 text-rose-700 rounded-xl mb-4 text-sm">
                  {errorMessage}
                </div>
              )}
              {result && result.errors.length > 0 && (
                <ul className="space-y-3">
                  {result.errors.map((err, idx) => (
                    <li key={idx} className="flex gap-3 text-sm border-b border-brand-border pb-3 last:border-0">
                      <span className="font-bold text-brand-muted w-16">Row {err.row}:</span>
                      <span className="text-brand-text">{err.error}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-6 bg-brand-card text-right">
              <button
                onClick={() => {
                  if (status === 'error') setStatus('idle');
                  if (result) setResult({ ...result, errors: [] });
                }}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
