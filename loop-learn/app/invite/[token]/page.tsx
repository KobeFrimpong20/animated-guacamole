import { createClient } from '@/lib/supabase/server';
import { getInvitationByToken } from '@/app/actions/invitations';
import AcceptButton from './AcceptButton';
import Link from 'next/link';

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInvitationByToken(token);

  // Invalid, expired, or already accepted
  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-bg">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full text-rose-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-brand-text">Invalid invitation</h2>
          <p className="text-brand-muted mb-6">
            This invitation link has expired, already been used, or doesn&apos;t exist.
          </p>
          <Link
            href="/organizations"
            className="inline-block px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Go to organizations
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const roleLabel = invite.role === 'family' ? 'parent' : invite.role;

  // Logged in — show accept UI
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-bg">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Loop-Learn</h1>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-brand-border shadow-md text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-brand-card rounded-full text-brand-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-brand-text">You&apos;ve been invited</h2>
            <p className="text-brand-muted mb-1">
              <span className="font-medium text-brand-text">{invite.inviterName}</span> invited you to join
            </p>
            <p className="text-xl font-bold text-brand-text mb-1">{invite.orgName}</p>
            <p className="text-sm text-brand-muted mb-8">as a <span className="font-medium">{roleLabel}</span></p>
            <AcceptButton token={token} />
          </div>
          <p className="text-center mt-6 text-sm text-brand-muted">
            Not you?{' '}
            <Link href="/login" className="font-medium text-brand-primary hover:underline">
              Sign in with a different account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Logged out — show signup / login CTAs
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Loop-Learn</h1>
        </div>
        <div className="p-8 bg-white rounded-2xl border border-brand-border shadow-md text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-brand-card rounded-full text-brand-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-brand-text">You&apos;ve been invited</h2>
          <p className="text-brand-muted mb-1">
            <span className="font-medium text-brand-text">{invite.inviterName}</span> invited you to join
          </p>
          <p className="text-xl font-bold text-brand-text mb-1">{invite.orgName}</p>
          <p className="text-sm text-brand-muted mb-8">as a <span className="font-medium">{roleLabel}</span></p>

          <div className="flex flex-col gap-3">
            <Link
              href={`/signup?invite=${token}`}
              className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all text-center"
            >
              Create an account
            </Link>
            <Link
              href={`/login?invite=${token}`}
              className="w-full py-3 bg-brand-card text-brand-text font-bold rounded-xl hover:bg-[#D8D1C7] transition-all text-center"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
