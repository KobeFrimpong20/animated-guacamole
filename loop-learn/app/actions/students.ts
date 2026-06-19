'use server';

import { createClient } from '@/lib/supabase/server';

export type Student = {
  id: string;
  name: string;
  parentEmail: string | null;
  gradeLevel: string | null;
};

export async function getStudents(): Promise<Student[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select('id, name, grade_level')
    .order('name', { ascending: true });

  if (error) {
    console.error('getStudents error:', error);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    // parentEmail will be populated once students are linked to family accounts via parent_id
    parentEmail: null,
    gradeLevel: row.grade_level as string | null,
  }));
}
