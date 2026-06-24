'use server';

import { createClient } from '@/lib/supabase/server';

export type Student = {
  id: string;
  name: string;
  parentEmail: string | null;
  gradeLevel: string | null;
};

export async function getStudents(orgId: string): Promise<Student[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select('id, name, grade_level')
    .eq('center_id', orgId)
    .order('name', { ascending: true });

  if (error) {
    console.error('getStudents error:', error);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    parentEmail: null,
    gradeLevel: row.grade_level as string | null,
  }));
}
