'use server';

// Server actions for session management.

import { createClient } from '@/lib/supabase/server';

export type Tutor = {
  id: string;
  fullName: string | null;
  email: string;
};

// Returns all users with role = 'tutor' from the profiles table.
// Used to populate the tutor dropdown in the Create Session form.
export async function getTutors(): Promise<Tutor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'tutor')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('getTutors error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    id: row.id as string,
    fullName: row.full_name as string | null,
    email: row.email as string,
  }));
}

// Saves a completed session report to the DB.
// Called after the email is successfully sent so delivery_status is set to 'sent'.
// engagement_q1/q2/q3 map to confidence/focus/mastery from the report form.
export async function saveSessionReport(input: {
  sessionId: number;
  studentId: string | null; // null if the student couldn't be matched to a students record
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
      // Only include student_id if we have a match — field is nullable
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

// Inserts a new session row.
// subject_id is not stored on sessions — it is set by the tutor when writing the report.
export async function createSession(input: {
  tutorId: string;
  studentName: string;
  scheduledStart: string; // ISO datetime string
}): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('sessions')
    .insert({
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
