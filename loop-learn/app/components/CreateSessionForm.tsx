'use client';

// CreateSessionForm — used by directors to schedule a new tutoring session.
// Lets the director pick a tutor, pick a student, and set a date/time.
// On submit, inserts a row into the sessions table.

import { useState, useEffect } from 'react';
import { getTutors, createSession, Tutor } from '../actions/sessions';
import { getStudents, Student } from '../actions/students';

interface Props {
  // Called when the session is created successfully — lets the parent close the form
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateSessionForm({ onSuccess, onCancel }: Props) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [tutorId, setTutorId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load tutors and students in parallel when the form mounts
    getTutors().then(setTutors);
    getStudents().then(setStudents);
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

    const result = await createSession({ tutorId, studentName: student.name, scheduledStart });

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-lg p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Create Session</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Tutor picker — shows all profiles with role = 'tutor' */}
        <div>
          <label className="block text-sm font-medium mb-1">Tutor</label>
          <select
            required
            value={tutorId}
            onChange={e => setTutorId(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
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
          <label className="block text-sm font-medium mb-1">Student</label>
          <select
            required
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/50">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={status === 'loading'}
            className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-[2] py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating…' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  );
}
