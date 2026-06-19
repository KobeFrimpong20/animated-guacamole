'use client';

import { useState, useEffect } from 'react';
import { sendEmail } from '../actions/send-email';
import { SessionReportView, SessionReportData } from './SessionReportView';
import { getStudents, Student } from '../actions/students';
import { saveSessionReport } from '../actions/sessions';
import { createClient } from '@/lib/supabase/client';

type Step = 'form' | 'preview' | 'success';

interface Props {
  // When provided, the form is linked to a scheduled session.
  // Student and tutor fields are pre-filled and locked; report is saved to DB on submit.
  sessionId?: number;
  prefilledStudentName?: string;
}

export default function SessionReportForm({ sessionId, prefilledStudentName }: Props) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<SessionReportData>({
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

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStudents().then(data => {
      setStudents(data);

      // If the form was opened from a session row, find and lock the matching student
      if (prefilledStudentName) {
        const match = data.find(s => s.name === prefilledStudentName);
        if (match) {
          // Found a matching students record — use its ID and parent email
          setSelectedStudentId(match.id);
          setFormData(prev => ({
            ...prev,
            studentName: match.name,
            email: match.parentEmail ?? '',
          }));
        } else {
          // Name from session doesn't match any student record — display it but no student_id
          setFormData(prev => ({ ...prev, studentName: prefilledStudentName }));
        }
      }
    });

    // Auto-populate the tutor name from the logged-in user's metadata
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';
      setFormData(prev => ({ ...prev, tutorName: name }));
    });
  }, [prefilledStudentName]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const student = students.find(s => s.id === e.target.value);
    if (!student) return;
    setSelectedStudentId(student.id);
    setFormData(prev => ({
      ...prev,
      studentName: student.name,
      email: student.parentEmail ?? '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof SessionReportData, name === 'confidence' || name === 'focus' || name === 'mastery' ? parseInt(value) : value);
  };

  const updateField = (name: keyof SessionReportData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShowPreview = (e: React.SubmitEvent) => {
    e.preventDefault();
    setStep('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveAndSend = async () => {
    setStatus('loading');
    setMessage('');

    try {
      // Step 1: send the email
      const result = await sendEmail(formData);
      if (!result?.success) {
        setStatus('error');
        setMessage(result?.error || 'Failed to send report.');
        return;
      }

      // Step 2: if linked to a session, save the report to the DB
      if (sessionId) {
        const saveResult = await saveSessionReport({
          sessionId,
          studentId: selectedStudentId || null,
          confidence: formData.confidence,
          focus: formData.focus,
          mastery: formData.mastery,
          sessionSummary: formData.sessionSummary,
          whatWentWell: formData.whatWentWell,
          areasForGrowth: formData.areasForGrowth,
          nextSessionPlan: formData.nextSessionPlan,
        });
        // Email already sent — log the DB error but don't fail the success screen
        if (saveResult.error) {
          console.warn('Email sent but report DB save failed:', saveResult.error);
        }
      }

      setStep('success');
      setStatus('idle');
    } catch {
      setStatus('error');
      setMessage('An unexpected error occurred.');
    }
  };

  if (step === 'success') {
    return (
      <div className="w-full max-w-2xl p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Report Sent!</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          The session report for {formData.studentName} has been successfully sent to {formData.email}.
        </p>
        <button
          onClick={() => {
            setStep('form');
            setSelectedStudentId('');
            setFormData({
              ...formData,
              email: '',
              studentName: '',
              sessionSummary: '',
              whatWentWell: '',
              areasForGrowth: '',
              nextSessionPlan: '',
            });
          }}
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all"
        >
          Create New Report
        </button>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="w-full max-w-3xl space-y-8">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm text-center">
          This is a preview of how the email will look. You can click any field to make final adjustments.
        </div>

        <SessionReportView 
          {...formData} 
          isEditable={true} 
          onChange={updateField} 
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => setStep('form')}
            disabled={status === 'loading'}
            className="flex-1 py-4 px-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            Back to Edit
          </button>
          <button
            onClick={handleApproveAndSend}
            disabled={status === 'loading'}
            className="flex-[2] py-4 px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              'Approve & Send Report'
            )}
          </button>
        </div>
        
        {message && (
          <p className="text-center font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Create Session Report</h2>
      
      <form onSubmit={handleShowPreview} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Student</label>
              {sessionId ? (
                // Read-only when opened from a session — student was set by the director
                <>
                  <input
                    value={formData.studentName}
                    readOnly
                    className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    Report will be sent to: {formData.email || 'no parent email on file'}
                  </p>
                </>
              ) : (
                // Dropdown when opened from the standalone "Create a report" card
                <>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={handleStudentChange}
                    className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    <option value="">Select a student…</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {selectedStudentId && (
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      Report will be sent to: {formData.email || 'no parent email on file'}
                    </p>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutor Name</label>
              {/* Read-only — auto-populated from the logged-in user's profile */}
              <input
                name="tutorName"
                required
                value={formData.tutorName}
                readOnly
                className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
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
            className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Preview Report
          </button>
        </div>
      </form>
    </div>
  );
}
