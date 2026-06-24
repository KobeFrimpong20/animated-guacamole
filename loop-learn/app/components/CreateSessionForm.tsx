'use client';

// CreateSessionForm — used by directors to schedule a new tutoring session.
// Lets the director pick a tutor, pick a student, and set a date/time.
// On submit, inserts a row into the sessions table.

import { useState, useEffect } from 'react';
import { getTutors, createSession, Tutor } from '../actions/sessions';
import { getStudents, Student } from '../actions/students';

interface Props {
  orgId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateSessionForm({ orgId, onSuccess, onCancel }: Props) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [tutorId, setTutorId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTutors(orgId).then(setTutors);
    getStudents(orgId).then(setStudents);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Look up the selected student's name to store on the session row
    const student = students.find(s => s.id === studentId);
    if (!student) {
      setStatus('error');
      setErrorMessage('Please select a student.');
      return;
    }

    // Combine the separate date and time inputs into a single ISO datetime string
    const scheduledStart = new Date(`${date}T${time}`).toISOString();

    const result = await createSession({ orgId, tutorId, studentName: student.name, scheduledStart });

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-lg p-8 bg-white rounded-2xl border border-brand-border shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-text">Create Session</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Tutor picker — shows all profiles with role = 'tutor' */}
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-text">Tutor</label>
          <select
            required
            value={tutorId}
            onChange={e => setTutorId(e.target.value)}
            className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select a tutor…</option>
            {tutors.map(t => (
              <option key={t.id} value={t.id}>
                {t.fullName || t.email}
              </option>
            ))}
          </select>
        </div>

        {/* Student picker — shows all rows from the students table */}
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-text">Student</label>
          <select
            required
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select a student…</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}{s.gradeLevel ? ` (${s.gradeLevel})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Date and time — combined into a single ISO string on submit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-text">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-text">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={status === 'loading'}
            className="flex-1 py-2.5 bg-brand-card text-brand-text font-bold rounded-xl hover:bg-[#D8D1C7] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-[2] py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating…' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  );
}
