'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrganization } from '../actions/organizations';

export default function CreateOrgForm({ alreadyDirector }: { alreadyDirector: boolean }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await createOrganization(name);

    if ('error' in result) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      router.push(`/org/${result.orgId}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-8 py-10">
      <div className="mb-8">
        <Link href="/organizations" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
          ← Back to organizations
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-brand-text mb-1">Create Organization</h2>
      <p className="text-sm text-brand-muted mb-8">
        You will be added as the director of this organization.
      </p>

      {alreadyDirector && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          You are already a director of another organization. You can still create a new one.
        </div>
      )}

      <div className="p-8 bg-white rounded-2xl border border-brand-border shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-text">
              Organization name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g. Bright Minds Tutoring"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Organization'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
