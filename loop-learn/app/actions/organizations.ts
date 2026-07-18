'use server';

import { createClient } from '@/lib/supabase/server';
import { getRoleFromUser } from '@/lib/roles';

export type OrgMembership = {
  id: string;
  name: string;
  role: string;
};

export async function getMyOrganizations(): Promise<OrgMembership[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('my_organizations')
    .select('org_id, role, center_name');

  if (error) {
    console.error('getMyOrganizations error:', error);
    return [];
  }

  return (data ?? [])
    .map(row => ({
      id: row.org_id as string,
      name: (row.center_name as string) ?? 'Unknown',
      role: row.role as string,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function createOrganization(
  name: string
): Promise<{ orgId: string } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const role = getRoleFromUser(user);
  if (role !== 'tutor' && role !== 'director') {
    return { error: 'Only tutors and directors can create organizations.' };
  }

  const trimmedName = name.trim();
  if (!trimmedName) return { error: 'Organization name cannot be empty.' };

  const { data: center, error: centerError } = await supabase
    .from('centers')
    .insert({ name: trimmedName, created_by: user.id })
    .select('id')
    .single();

  if (centerError || !center) {
    console.error('createOrganization center error:', centerError);
    return { error: 'Failed to create organization. Please try again.' };
  }

  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({ org_id: center.id, user_id: user.id, role: 'director' });

  if (memberError) {
    console.error('createOrganization member error:', memberError);
    await supabase.from('centers').delete().eq('id', center.id);
    return { error: 'Failed to set up your membership. Please try again.' };
  }

  return { orgId: center.id };
}
