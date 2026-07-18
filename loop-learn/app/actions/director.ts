'use server';

import { createClient } from '@/lib/supabase/server';

export type DirectorSession = {
  id: number;
  scheduledStart: string;
  studentName: string | null;
  tutorName: string | null;
};

export type DirectorReport = {
  id: number;
  studentName: string | null;
  sessionDate: string | null;
  deliveryStatus: string;
  createdAt: string;
};

export async function getAllUpcomingSessions(orgId: string, limit = 10): Promise<DirectorSession[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name, profiles(full_name, email)')
    .eq('center_id', orgId)
    .gte('scheduled_start', now)
    .order('scheduled_start', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getAllUpcomingSessions error:', error);
    return [];
  }

  return (data ?? []).map(row => {
    const profileData = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const tutor = profileData as { full_name: string | null; email: string } | null;
    return {
      id: row.id as number,
      scheduledStart: row.scheduled_start as string,
      studentName: row.student_name as string | null,
      tutorName: tutor?.full_name || tutor?.email || null,
    };
  });
}

export async function getAllRecentReports(orgId: string, limit = 10): Promise<DirectorReport[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_reports')
    .select('id, delivery_status, created_at, sessions(scheduled_start, student_name), students(name)')
    .eq('center_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getAllRecentReports error:', error);
    return [];
  }

  return (data ?? []).map(row => {
    const sessionData = Array.isArray(row.sessions) ? row.sessions[0] : row.sessions;
    const studentData = Array.isArray(row.students) ? row.students[0] : row.students;
    const session = sessionData as { scheduled_start: string; student_name: string | null } | null;
    const student = studentData as { name: string } | null;
    return {
      id: row.id as number,
      studentName: student?.name ?? session?.student_name ?? null,
      sessionDate: session?.scheduled_start ?? null,
      deliveryStatus: row.delivery_status as string,
      createdAt: row.created_at as string,
    };
  });
}
