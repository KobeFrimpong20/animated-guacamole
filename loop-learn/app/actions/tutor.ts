'use server';

import { createClient } from '@/lib/supabase/server';

export type UpcomingSession = {
  id: number;
  scheduledStart: string;
  studentName: string | null;
  hasReport: boolean;
};

export type PastReport = {
  id: number;
  studentName: string;
  deliveryStatus: string;
  createdAt: string;
  sessionDate: string | null;
};

export async function getUpcomingSessions(tutorId: string, orgId: string, limit = 5): Promise<UpcomingSession[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name, session_reports(id)')
    .eq('tutor_id', tutorId)
    .eq('center_id', orgId)
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

export async function getPastReports(tutorId: string, orgId: string, limit = 5): Promise<PastReport[]> {
  const supabase = await createClient();

  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id, scheduled_start')
    .eq('tutor_id', tutorId)
    .eq('center_id', orgId);

  if (sessionsError || !sessions?.length) return [];

  const sessionIds = sessions.map(s => s.id as number);
  const sessionDateById: Record<number, string> = Object.fromEntries(
    sessions.map(s => [s.id as number, s.scheduled_start as string])
  );

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
    studentName: (Array.isArray(row.students) ? row.students[0] : row.students as { name: string } | null)?.name ?? 'Unknown',
    deliveryStatus: row.delivery_status as string,
    createdAt: row.created_at as string,
    sessionDate: sessionDateById[row.session_id as number] ?? null,
  }));
}
