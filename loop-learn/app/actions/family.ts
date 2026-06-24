'use server';

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

export async function getMyChildren(parentProfileId: string, orgId: string): Promise<MyStudent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select('id, name, grade_level')
    .eq('parent_id', parentProfileId)
    .eq('center_id', orgId)
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
    studentName: (Array.isArray(row.students) ? row.students[0] : row.students as { name: string } | null)?.name ?? 'Unknown',
    sessionSummary: row.session_summary as string,
    deliveryStatus: row.delivery_status as string,
    createdAt: row.created_at as string,
    sessionDate: (Array.isArray(row.sessions) ? row.sessions[0] : row.sessions as { scheduled_start: string } | null)?.scheduled_start ?? null,
  }));
}

export async function getMyStudentSessions(studentNames: string[], orgId: string): Promise<StudentSession[]> {
  if (!studentNames.length) return [];

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('sessions')
    .select('id, scheduled_start, student_name')
    .in('student_name', studentNames)
    .eq('center_id', orgId)
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
