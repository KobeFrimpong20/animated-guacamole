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
    sent:        'bg-emerald-50 text-emerald-600',
    pending:     'bg-amber-50 text-amber-700',
    in_progress: 'bg-teal-50 text-teal-700',
    draft:       'bg-stone-100 text-stone-500',
    failed:      'bg-rose-50 text-rose-600',
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
            className="mb-8 flex items-center gap-2 text-brand-muted hover:text-brand-text transition-colors"
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
        <h1 className="text-4xl font-bold tracking-tight text-brand-text">
          Hello, {username}!
        </h1>
        <p className="text-lg text-brand-muted">
          What would you like to do today?
        </p>
      </div>

      {/* ── Action cards ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Create a session card */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-brand-border shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center mb-6 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand-text">Create a session</h3>
            <p className="text-brand-muted">
              Schedule a new tutoring session and assign it to a tutor.
            </p>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>

        </div>
      </section>

      {/* ── Overview panels ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* All upcoming sessions panel */}
          <div className="bg-white rounded-3xl border border-brand-border p-6">
            <h3 className="text-base font-bold mb-4 text-brand-text">
              Upcoming Sessions
            </h3>
            {loadingSessions ? (
              <p className="text-sm text-brand-muted">Loading…</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-brand-muted">
                No upcoming sessions scheduled.
              </p>
            ) : (
              <ul className="space-y-4">
                {sessions.map(session => (
                  <li key={session.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">
                        {session.studentName ?? 'Unknown student'}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {formatDate(session.scheduledStart)}
                      </p>
                    </div>
                    {session.tutorName && (
                      <span className="text-xs text-brand-muted flex-shrink-0">
                        {session.tutorName}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* All recent reports panel */}
          <div className="bg-white rounded-3xl border border-brand-border p-6">
            <h3 className="text-base font-bold mb-4 text-brand-text">
              Recent Reports
            </h3>
            {loadingReports ? (
              <p className="text-sm text-brand-muted">Loading…</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-brand-muted">
                No reports submitted yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {reports.map(report => (
                  <li key={report.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">
                        {report.studentName ?? 'Unknown student'}
                      </p>
                      {report.sessionDate && (
                        <p className="text-xs text-brand-muted">
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
