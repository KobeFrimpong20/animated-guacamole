'use client';

// TutorDashboard — shown to users with the 'tutor' role.
// Displays three sections:
//   1. Create Report — opens the inline session report form (standalone, not linked to a session)
//   2. Upcoming Sessions — next scheduled sessions with a "Write report" button on each
//   3. Past Reports — recently submitted session reports

import { useState, useEffect } from 'react';
import SessionReportForm from './SessionReportForm';
import { getUpcomingSessions, getPastReports, UpcomingSession, PastReport } from '../actions/tutor';

interface Props {
  username: string;
  // userId is the auth UUID — used to query sessions/reports from the DB
  userId: string;
}

// Maps a delivery_status value to a color-coded pill label
function DeliveryBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    draft:       'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    failed:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const label = status.replace('_', ' ');
  const cls = styles[status] ?? styles.draft;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {label}
    </span>
  );
}

// Formats an ISO date string into "Mon, Jun 16 · 2:00 PM"
function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function TutorDashboard({ username, userId }: Props) {
  // null = dashboard shown
  // 'standalone' = freeform report form (not linked to a session)
  // UpcomingSession = report form pre-linked to that session
  const [formContext, setFormContext] = useState<null | 'standalone' | UpcomingSession>(null);

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [pastReports, setPastReports] = useState<PastReport[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  // Incrementing this triggers a re-fetch of sessions and reports after a report is submitted
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userId) return;

    setLoadingSessions(true);
    setLoadingReports(true);

    getUpcomingSessions(userId).then(data => {
      setUpcomingSessions(data);
      setLoadingSessions(false);
    });

    getPastReports(userId).then(data => {
      setPastReports(data);
      setLoadingReports(false);
    });
  }, [userId, refreshKey]);

  // Close the form and re-fetch so hasReport status and past reports update
  const handleCloseForm = () => {
    setFormContext(null);
    setRefreshKey(prev => prev + 1);
  };

  // --- Report form view ---
  if (formContext !== null) {
    const isSessionLinked = typeof formContext === 'object';
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={handleCloseForm}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <SessionReportForm
            // Only pass session props when opened from a session row
            sessionId={isSessionLinked ? formContext.id : undefined}
            prefilledStudentName={isSessionLinked ? (formContext.studentName ?? undefined) : undefined}
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
          {/* Standalone create report card — not linked to a session */}
          <button
            onClick={() => setFormContext('standalone')}
            className="group relative flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 text-white dark:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Create a report</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Generate and send a new session report to parents.
            </p>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* ── Info panels ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Your Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upcoming Sessions panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-base font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Upcoming Sessions
            </h3>
            {loadingSessions ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : upcomingSessions.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No upcoming sessions scheduled.
              </p>
            ) : (
              <ul className="space-y-4">
                {upcomingSessions.map(session => (
                  <li key={session.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {/* Student name — shown if the director set it on the session */}
                      {session.studentName && (
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {session.studentName}
                        </p>
                      )}
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatSessionDate(session.scheduledStart)}
                      </p>
                    </div>

                    {session.hasReport ? (
                      // Report already submitted — show a badge instead of the button
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
                        Submitted
                      </span>
                    ) : (
                      // No report yet — show the write report button
                      <button
                        onClick={() => setFormContext(session)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity flex-shrink-0"
                      >
                        Write report
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Past Reports panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-base font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Past Reports
            </h3>
            {loadingReports ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : pastReports.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No reports submitted yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {pastReports.map(report => (
                  <li key={report.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {report.studentName}
                      </p>
                      {report.sessionDate && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">
                          {formatSessionDate(report.sessionDate)}
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
