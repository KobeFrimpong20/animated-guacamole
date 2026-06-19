'use client';

import { useState } from 'react';
import { sendEmail } from '../actions/send-email';

export default function EmailButton() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSend = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await sendEmail(email);
      if (result.success) {
        setStatus('success');
        setMessage('Email sent successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to send email.');
      }
    } catch {
      setStatus('error');
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-xl border border-brand-border shadow-sm">
      <form onSubmit={handleSend} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            required
            className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2 px-4 bg-brand-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Sending...
            </>
          ) : (
            'Send Email'
          )}
        </button>

        {message && (
          <p className={`text-sm text-center ${status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
