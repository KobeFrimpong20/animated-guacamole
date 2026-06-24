'use server';

import { createClient } from '@/lib/supabase/server';

export type Tutor = {
  id: string;
  fullName: string | null;
  email: string;
};

export async function getTutors(orgId: string): Promise<Tutor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organization_members')
    .select('profiles(id, full_name, email)')
    .eq('org_id', orgId)
    .eq('role', 'tutor');

  if (error) {
    console.error('getTutors error:', error);
    return [];
  }

  return (data ?? [])
    .map(row => {
      const p = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as { id: string; full_name: string | null; email: string } | null;
      if (!p) return null;
      return { id: p.id, fullName: p.full_name, email: p.email };
    })
    .filter((t): t is Tutor => t !== null)
    .sort((a, b) => (a.fullName ?? a.email).localeCompare(b.fullName ?? b.email));
}

export async function saveSessionReport(input: {
  sessionId: number;
  orgId: string;
  studentId: string | null;
  confidence: number;
  focus: number;
  mastery: number;
  sessionSummary: string;
  whatWentWell: string;
  areasForGrowth: string;
  nextSessionPlan: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('session_reports')
    .insert({
      session_id: input.sessionId,
      center_id: input.orgId,
      ...(input.studentId ? { student_id: input.studentId } : {}),
      engagement_q1: input.confidence,
      engagement_q2: input.focus,
      engagement_q3: input.mastery,
      session_summary: input.sessionSummary,
      what_went_well: input.whatWentWell,
      areas_for_growth: input.areasForGrowth,
      next_session_plan: input.nextSessionPlan,
      delivery_status: 'sent',
      attendance_status: 'present',
    });

  if (error) {
    console.error('saveSessionReport error:', error);
    return { error: error.message };
  }

  return {};
}

export async function createSession(input: {
  orgId: string;
  tutorId: string;
  studentName: string;
  scheduledStart: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('sessions')
    .insert({
      center_id: input.orgId,
      tutor_id: input.tutorId,
      student_name: input.studentName,
      scheduled_start: input.scheduledStart,
    });

  if (error) {
    console.error('createSession error:', error);
    return { error: error.message };
  }

  return {};
}
