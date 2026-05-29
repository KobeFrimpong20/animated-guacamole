'use client';

import { useState } from 'react';
import { sendEmail } from '../actions/send-email';

export default function SessionReportForm() {
  const [formData, setFormData] = useState({
    email: '',
    studentName: '',
    tutorName: '',
    confidence: 3,
    focus: 3,
    mastery: 3,
    sessionSummary: '',
    whatWentWell: '',
    areasForGrowth: '',
    nextSessionPlan: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'confidence' || name === 'focus' || name === 'mastery' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const result = await sendEmail(formData);
      if (result?.success) {
        setStatus('success');
        setMessage('Session report sent successfully!');
      } else {
        setStatus('error');
        setMessage(result?.error || 'Failed to send report.');
      }
    } catch {
      setStatus('error');
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Create Session Report</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="parent@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                name="studentName"
                required
                value={formData.studentName}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutor Name</label>
              <input
                name="tutorName"
                required
                value={formData.tutorName}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Jane Smith"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold">Metrics (1-5)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Confidence</label>
              <select 
                name="confidence" 
                value={formData.confidence} 
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Focus</label>
              <select 
                name="focus" 
                value={formData.focus} 
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mastery</label>
              <select 
                name="mastery" 
                value={formData.mastery} 
                onChange={handleChange}
                className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Session Feedback</h3>
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Summary - What did you cover and how did it go?
            </label>
            <textarea
              name="sessionSummary"
              required
              value={formData.sessionSummary}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="
                (e.g., Focused on essay thesis statements. Sarah drafted three options and learned how to argue
                a specific claim rather than a broad topic.)
              "
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Share A Breakthrough Or Win - What Went Well Today?
            </label>
            <textarea
              name="whatWentWell"
              required
              value={formData.whatWentWell}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="
                (e.g., Maya mastered her 7s times tables today and was incredibly proud of her speed
                during our flashcard game.)
              "
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Areas for Growth - What needs more practice?
            </label>
            <textarea
              name="areasForGrowth"
              required
              value={formData.areasForGrowth}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="
                (e.g., Vocabulary retention. Chloe understands the definitions during the session but struggles
                to recall them without hints. We need to build her active recall.
              "
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Next Session Plan - What is the game plan for next session?
            </label>
            <textarea
              name="nextSessionPlan"
              required
              value={formData.nextSessionPlan}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="
                (e.g., We will review the feedback from his history essay draft and start outline revisions for
                the final submission.)
              "
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Sending Report...' : 'Send Session Report'}
          </button>
          
          {message && (
            <p className="mt-4 text-center font-medium">
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
