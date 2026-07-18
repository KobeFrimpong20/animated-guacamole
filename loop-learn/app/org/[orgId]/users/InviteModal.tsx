'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { createInvitation } from '@/app/actions/invitations';

interface Props {
  orgId: string;
  onClose: () => void;
}

export default function InviteModal({ orgId, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'tutor' | 'family'>('tutor');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await createInvitation(orgId, email, role);

    if ('error' in result) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      setStatus('success');
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <h3 className="font-bold text-lg text-brand-text">Invite a member</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-brand-muted" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full text-emerald-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-bold text-brand-text mb-1">Invitation sent</h4>
            <p className="text-sm text-brand-muted mb-6">
              An invite email was sent to <span className="font-medium text-brand-text">{email}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-brand-text">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-brand-text">
                Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'tutor' | 'family')}
                className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="tutor">Tutor</option>
                <option value="family">Parent / Family</option>
              </select>
            </div>

            {status === 'error' && (
              <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {errorMessage}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-brand-card text-brand-text font-bold rounded-xl hover:bg-[#D8D1C7] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send invite'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
