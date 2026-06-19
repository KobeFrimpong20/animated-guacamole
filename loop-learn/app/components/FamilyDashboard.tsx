'use client';

// FamilyDashboard — shown to users with the 'family' role (parents/guardians).
// Shows their children, recent session reports, and upcoming sessions.

import { useState, useEffect } from 'react';
import {
  getMyChildren,
  getMyStudentReports,
  getMyStudentSessions,
  MyStudent,
  StudentReport,
  StudentSession,
} from '../actions/family';

interface Props {
  username: string;
  // userId is the auth UUID — matches profiles.id, used to find linked students
  userId: string;
}

// Formats an ISO date string into "Mon, Jun 16 · 2:00 PM"
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function FamilyDashboard({ username, userId }: Props) {
  const [children, setChildren] = useState<MyStudent[]>([]);
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Step 1: fetch this family's children
    getMyChildren(userId).then(kids => {
      setChildren(kids);
      setLoadingChildren(false);

      if (!kids.length) {
        // No children linked — nothing else to fetch
        setLoadingReports(false);
        setLoadingSessions(false);
        return;
      }

      const studentIds = kids.map(k => k.id);
      const studentNames = kids.map(k => k.name);

      // Step 2: fetch reports and sessions in parallel once we have the student IDs/names
      getMyStudentReports(studentIds).then(data => {
        setReports(data);
        setLoadingReports(false);
      });

      getMyStudentSessions(studentNames).then(data => {
        setSessions(data);
        setLoadingSessions(false);
      });
    });
  }, [userId]);

  return (
    <div className="p-8 h-full flex flex-col gap-10">

      {/* Greeting */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Hello, {username}!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Here's what's happening with your child's sessions.
        </p>
      </div>

      {/* My Children — shows linked students as name chips */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          My Children
        </h2>
        {loadingChildren ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : children.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            No children linked to your account yet. Contact a director to get set up.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {children.map(child => (
              <span
                key={child.id}
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {child.name}
                {child.gradeLevel && (
                  <span className="ml-1.5 text-zinc-400 dark:text-zinc-500">
                    {child.gradeLevel}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Info panels */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Reports panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-base font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Recent Reports
            </h3>
            {loadingReports ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                No session reports yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {reports.map(report => (
                  <li key={report.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {report.studentName}
                      </p>
                      {report.sessionDate && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                          {formatDate(report.sessionDate)}
                        </p>
                      )}
                    </div>
                    {/* Show a short excerpt of the session summary */}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {report.sessionSummary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upcoming Sessions panel */}
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
              <ul className="space-y-3">
                {sessions.map(session => (
                  <li key={session.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {session.studentName}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatDate(session.scheduledStart)}
                      </p>
                    </div>
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
