import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getRoleFromUser } from '@/lib/roles';
import TutorDashboard from '../../components/TutorDashboard';
import FamilyDashboard from '../../components/FamilyDashboard';
import DirectorDashboard from '../../components/DirectorDashboard';
import AdminDashboard from '../../components/AdminDashboard';

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role = getRoleFromUser(user);
  const username =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    '';

  if (!role) {
    return (
      <div className="p-8">
        <p className="text-brand-muted">
          Your account does not have a role assigned yet. Please contact a director.
        </p>
      </div>
    );
  }

  if (role === 'tutor')    return <TutorDashboard username={username} userId={user.id} orgId={orgId} />;
  if (role === 'family')   return <FamilyDashboard username={username} userId={user.id} orgId={orgId} />;
  if (role === 'director') return <DirectorDashboard username={username} orgId={orgId} />;
  if (role === 'admin')    return <AdminDashboard username={username} />;
}
