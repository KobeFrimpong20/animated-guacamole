'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Trash2 } from 'lucide-react';
import { cancelInvitation, type OrgMember } from '@/app/actions/invitations';
import InviteModal from './InviteModal';

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expires_at: string;
}

interface Props {
  orgId: string;
  isDirector: boolean;
  members: OrgMember[];
  pendingInvites: PendingInvite[];
}

// Role pill colors
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    director: 'bg-brand-card text-brand-primary',
    tutor:    'bg-teal-50 text-teal-700',
    family:   'bg-violet-50 text-violet-700',
  };
  const cls = styles[role] ?? 'bg-stone-100 text-stone-500';
  const label = role === 'family' ? 'parent' : role;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MembersClient({ orgId, isDirector, members, pendingInvites }: Props) {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const result = await cancelInvitation(id);
    console.log('cancelInvitation result:', result);
    setCancellingId(null);
    router.refresh();
  };

  return (
    <div className="p-8 flex flex-col gap-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-text">Members</h1>
          <p className="text-brand-muted mt-1">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
        </div>
        {isDirector && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite member
          </button>
        )}
      </div>

      {/* Members table */}
      <section>
        <div className="bg-white rounded-3xl border border-brand-border overflow-hidden">
          {members.length === 0 ? (
            <div className="p-12 text-center text-brand-muted">No members yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-card">
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Name</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Email</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Role</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-brand-text">
                      {member.fullName ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">{member.email}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {formatDate(member.joinedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Pending invites — directors only */}
      {isDirector && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-4">
            Pending Invitations
          </h2>
          <div className="bg-white rounded-3xl border border-brand-border overflow-hidden">
            {pendingInvites.length === 0 ? (
              <div className="p-8 text-center text-sm text-brand-muted">No pending invitations.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-card">
                    <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Email</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Role</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-widest text-brand-muted px-6 py-3">Expires</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {pendingInvites.map(invite => (
                    <tr key={invite.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="px-6 py-4 text-sm text-brand-muted">{invite.email}</td>
                      <td className="px-6 py-4">
                        <RoleBadge role={invite.role} />
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-muted">
                        {formatDate(invite.expires_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCancel(invite.id)}
                          disabled={cancellingId === invite.id}
                          className="p-1.5 text-brand-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {showInviteModal && (
        <InviteModal orgId={orgId} onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}
