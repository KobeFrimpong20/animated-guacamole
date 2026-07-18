import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgMembers, getPendingInvitations } from '@/app/actions/invitations';
import MembersClient from './MembersClient';

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get the current user's role within this org
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership) redirect('/organizations');

  const isDirector = membership.role === 'director';

  const [members, pendingInvites] = await Promise.all([
    getOrgMembers(orgId),
    isDirector ? getPendingInvitations(orgId) : Promise.resolve([]),
  ]);

  return (
    <MembersClient
      orgId={orgId}
      isDirector={isDirector}
      members={members}
      pendingInvites={pendingInvites}
    />
  );
}
