import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('my_organizations')
    .select('center_name')
    .eq('org_id', orgId)
    .single();

  if (!membership) redirect('/organizations');

  const orgName = (membership.center_name as string) ?? '';

  return (
    <div className="min-h-full flex">
      <Sidebar orgId={orgId} orgName={orgName} />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
