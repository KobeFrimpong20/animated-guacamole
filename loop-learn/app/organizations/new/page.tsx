import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getRoleFromUser } from '@/lib/roles';
import { getMyOrganizations } from '../../actions/organizations';
import CreateOrgForm from '../../components/CreateOrgForm';

export default async function NewOrganizationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role = getRoleFromUser(user);
  if (role !== 'tutor' && role !== 'director') redirect('/organizations');

  const orgs = await getMyOrganizations();
  const alreadyDirector = orgs.some(org => org.role === 'director');

  return <CreateOrgForm alreadyDirector={alreadyDirector} />;
}
