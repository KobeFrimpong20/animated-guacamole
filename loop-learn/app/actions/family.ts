'use server';

// Server actions for fetching family-specific data.
// A family account can have one or more students linked via students.parent_id.

import { createClient } from '@/lib/supabase/server';

export type MyStudent = {
  id: string;
  name: string;
  gradeLevel: string | null;
};

export type StudentReport = {
  id: number;
  studentName: string;
  sessionSummary: string;
  deliveryStatus: string;
  createdAt: string;
  sessionDate: string | null;
};

export type StudentSession = {
  id: number;
  studentName: string;
  scheduledStart: string;
};

// Returns all students linked to this family account.
export async function getMyChildren(parentProfileId: string): Promise<MyStudent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select('id, name, grade_level')
    .eq('parent_id', parentProfileId)
    .order('name', { ascending: true });

  if (error) {
    console.error('getMyChildren error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as string,
    name: row.name as string,
    gradeLevel: row.grade_level as string | null,
  }));
}

// Returns the most recent session reports for the given student IDs.
export async function getMyStudentReports(studentIds: string[]): Promise<StudentReport[]> {
  if (!studentIds.length) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_reports')
    .select('id, session_summary, delivery_status, created_at, sessions(scheduled_start), students(name)')
    .in('student_id', studentIds)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('getMyStudentReports error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as number,
    studentName: (row.students as { name: string } | null)?.name ?? 'Unknown',
    sessionSummary: row.session_summary as string,
    deliveryStatus: row.delivery_status as string,
    createdAt: row.created_at as string,
    sessionDate: (row.sessions as { scheduled_start: string } | null)?.scheduled_start ?? null,
  }));
}

// Returns upcoming sessions for the given student names.
// Sessions are matched by student_name since the sessions table does not store a student_id FK.
export async function getMyStudentSessions(studentNames: string[]): Promise<StudentSession[]> {
  if (!studentNames.length) return [];

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name')
    .in('student_name', studentNames)
    .gte('scheduled_start', now)
    .order('scheduled_start', { ascending: true })
    .limit(5);

  if (error) {
    console.error('getMyStudentSessions error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as number,
    studentName: row.student_name as string,
    scheduledStart: row.scheduled_start as string,
  }));
}
