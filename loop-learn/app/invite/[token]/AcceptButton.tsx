'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from '@/app/actions/invitations';

export default function AcceptButton({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAccept = async () => {
    setStatus('loading');
    const result = await acceptInvitation(token);
    if ('error' in result) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      router.push(`/org/${result.orgId}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleAccept}
        disabled={status === 'loading'}
        className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining...
          </>
        ) : (
          'Accept Invitation'
        )}
      </button>
      {status === 'error' && (
        <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
