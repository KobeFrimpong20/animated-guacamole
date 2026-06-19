'use client';

// DirectorDashboard — shown to users with the 'director' role.
// Shows session creation, an overview of all upcoming sessions, and recent reports.

import { useState, useEffect } from 'react';
import CreateSessionForm from './CreateSessionForm';
import {
  getAllUpcomingSessions,
  getAllRecentReports,
  DirectorSession,
  DirectorReport,
} from '../actions/director';

interface Props {
  username: string;
}

// Color-coded pill for a report's delivery status
function DeliveryBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    draft:       'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    failed:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const cls = styles[status] ?? styles.draft;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

// Formats an ISO date string into "Mon, Jun 16 · 2:00 PM"
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function DirectorDashboard({ username }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [sessions, setSessions] = useState<DirectorSession[]>([]);
  const [reports, setReports] = useState<DirectorReport[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  // Incrementing this after a session is created re-fetches the overview panels
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoadingSessions(true);
    setLoadingReports(true);

    getAllUpcomingSessions().then(data => {
      setSessions(data);
      setLoadingSessions(false);
    });

    getAllRecentReports().then(data => {
      setReports(data);
      setLoadingReports(false);
    });
  }, [refreshKey]);

  // Called when a session is successfully created — closes form and refreshes panels
  const handleSessionCreated = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };

  // --- Create session form view ---
  if (showForm) {
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <button
            onClick={() => setShowForm(false)}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <CreateSessionForm
            onSuccess={handleSessionCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  // --- Main dashboard ---
  return (
    <div className="p-8 h-full flex flex-col gap-10">

      {/* Greeting */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Hello, {username}!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          What would you like to do today?
        </p>
      </div>

      {/* ── Action cards ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Create a session card */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 text-white dark:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Create a session</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Schedule a new tutoring session and assign it to a tutor.
            </p>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>

        </div>
      </section>

      {/* ── Overview panels ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* All upcoming sessions panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-base font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Upcoming Sessions
            </h3>
            {loadingSessions ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No upcoming sessions scheduled.
              </p>
            ) : (
              <ul className="space-y-4">
                {sessions.map(session => (
                  <li key={session.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {session.studentName ?? 'Unknown student'}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatDate(session.scheduledStart)}
                      </p>
                    </div>
                    {session.tutorName && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                        {session.tutorName}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* All recent reports panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-base font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Recent Reports
            </h3>
            {loadingReports ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No reports submitted yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {reports.map(report => (
                  <li key={report.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {report.studentName ?? 'Unknown student'}
                      </p>
                      {report.sessionDate && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {formatDate(report.sessionDate)}
                        </p>
                      )}
                    </div>
                    <DeliveryBadge status={report.deliveryStatus} />
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
