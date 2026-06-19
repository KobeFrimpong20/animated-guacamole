'use server';

// Server actions for fetching director-level overview data.
// Directors see all sessions and reports across all tutors.

import { createClient } from '@/lib/supabase/server';

export type DirectorSession = {
  id: number;
  scheduledStart: string;
  studentName: string | null;
  tutorName: string | null; // from profiles via tutor_id FK
};

export type DirectorReport = {
  id: number;
  studentName: string | null; // from students via student_id FK
  sessionDate: string | null; // from sessions via session_id FK
  deliveryStatus: string;
  createdAt: string;
};

// Returns all upcoming sessions across all tutors, ordered soonest first.
export async function getAllUpcomingSessions(limit = 10): Promise<DirectorSession[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name, profiles(full_name, email)')
    .gte('scheduled_start', now)
    .order('scheduled_start', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getAllUpcomingSessions error:', error);
    return [];
  }

  return (data ?? []).map(row => {
    const tutor = row.profiles as { full_name: string | null; email: string } | null;
    return {
      id: row.id as number,
      scheduledStart: row.scheduled_start as string,
      studentName: row.student_name as string | null,
      // Fall back to email if the tutor hasn't set a display name
      tutorName: tutor?.full_name || tutor?.email || null,
    };
  });
}

// Returns the most recently submitted session reports across all tutors.
export async function getAllRecentReports(limit = 10): Promise<DirectorReport[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_reports')
    .select('id, delivery_status, created_at, sessions(scheduled_start, student_name), students(name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getAllRecentReports error:', error);
    return [];
  }

  return (data ?? []).map(row => {
    const session = row.sessions as { scheduled_start: string; student_name: string | null } | null;
    const student = row.students as { name: string } | null;
    return {
      id: row.id as number,
      // Prefer the linked students record name; fall back to the session's student_name
      studentName: student?.name ?? session?.student_name ?? null,
      sessionDate: session?.scheduled_start ?? null,
      deliveryStatus: row.delivery_status as string,
      createdAt: row.created_at as string,
    };
  });
}
