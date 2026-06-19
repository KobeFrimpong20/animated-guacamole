'use server';

// Server actions for fetching tutor-specific data.
// Sessions are matched by tutor_id (UUID) — the auth user's ID stored on the sessions row.

import { createClient } from '@/lib/supabase/server';

export type UpcomingSession = {
  id: number;
  scheduledStart: string;
  studentName: string | null;
  // true if a report has already been submitted for this session
  hasReport: boolean;
};

export type PastReport = {
  id: number;
  studentName: string;
  deliveryStatus: string;
  createdAt: string;
  sessionDate: string | null;
};

// Returns the next `limit` sessions scheduled in the future for the given tutor.
// Also fetches session_reports(id) to determine whether a report already exists —
// the UNIQUE constraint means there can only ever be 0 or 1 report per session.
export async function getUpcomingSessions(tutorId: string, limit = 5): Promise<UpcomingSession[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name, session_reports(id)')
    .eq('tutor_id', tutorId)
    .gte('scheduled_start', now)
    .order('scheduled_start', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getUpcomingSessions error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as number,
    scheduledStart: row.scheduled_start as string,
    studentName: row.student_name as string | null,
    hasReport: Array.isArray(row.session_reports) && (row.session_reports as unknown[]).length > 0,
  }));
}

// Returns the `limit` most recently created session reports for the given tutor.
// Uses a two-step query: first find session IDs owned by this tutor, then fetch their reports.
export async function getPastReports(tutorId: string, limit = 5): Promise<PastReport[]> {
  const supabase = await createClient();

  // Step 1: get all session IDs where tutor_id matches
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id, scheduled_start')
    .eq('tutor_id', tutorId);

  if (sessionsError || !sessions?.length) return [];

  const sessionIds = sessions.map(s => s.id as number);
  // Build a lookup so we can attach the session date to each report
  const sessionDateById: Record<number, string> = Object.fromEntries(
    sessions.map(s => [s.id as number, s.scheduled_start as string])
  );

  // Step 2: fetch reports for those session IDs, most recent first
  const { data, error } = await supabase
    .from('session_reports')
    .select('id, students(name), delivery_status, created_at, session_id')
    .in('session_id', sessionIds)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getPastReports error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as number,
    studentName: (row.students as { name: string } | null)?.name ?? 'Unknown',
    deliveryStatus: row.delivery_status as string,
    createdAt: row.created_at as string,
    sessionDate: sessionDateById[row.session_id as number] ?? null,
  }));
}
