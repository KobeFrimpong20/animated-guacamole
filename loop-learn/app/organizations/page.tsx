import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMyOrganizations } from '../actions/organizations';
import { getRoleFromUser } from '@/lib/roles';

const ROLE_LABELS: Record<string, string> = {
  director: 'Director',
  tutor: 'Tutor',
  family: 'Family',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  director: 'bg-blue-100 text-blue-700',
  tutor: 'bg-amber-100 text-amber-700',
  family: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role = getRoleFromUser(user);
  const canCreate = role === 'tutor' || role === 'director';
  const orgs = await getMyOrganizations();

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">My Organizations</h2>
          <p className="mt-1 text-sm text-brand-muted">Select an organization to get started.</p>
        </div>
        {canCreate && (
          <Link
            href="/organizations/new"
            className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            + New Organization
          </Link>
        )}
      </div>

      {orgs.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border">
          <svg className="mx-auto w-12 h-12 text-brand-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {canCreate ? (
            <>
              <p className="text-brand-muted mb-6">You are not part of any organization yet.</p>
              <Link
                href="/organizations/new"
                className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Create your first organization
              </Link>
            </>
          ) : (
            <p className="text-brand-muted max-w-sm mx-auto">
              You have not been added to any organization yet. Ask your tutor or director to send you an invite.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map(org => (
            <Link
              key={org.id}
              href={`/org/${org.id}`}
              className="group block p-6 bg-brand-card rounded-2xl border border-brand-border hover:border-brand-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[org.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {ROLE_LABELS[org.role] ?? org.role}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
                  {org.name}
                </h3>
              </div>

              <div className="mt-4 flex items-center text-xs text-brand-muted gap-1">
                <span>Open</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
