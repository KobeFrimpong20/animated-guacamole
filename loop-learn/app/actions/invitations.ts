'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { InvitationEmail } from '../../emails/InvitationEmail';
import * as React from 'react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Creates an invitation and sends the invite email.
// Only directors of the org may call this.
export async function createInvitation(
  orgId: string,
  email: string,
  role: 'tutor' | 'family'
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify caller is a director of this org
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || membership.role !== 'director') {
    return { error: 'Only directors can invite members' };
  }

  // Check if the email already belongs to an org member
  const { data: alreadyMember } = await supabase
    .from('profiles')
    .select('id, organization_members!inner(org_id)')
    .eq('email', email)
    .eq('organization_members.org_id', orgId)
    .maybeSingle();

  if (alreadyMember) return { error: 'This person is already a member of the organization' };

  // Check for an existing pending invitation
  const { data: pendingInvite } = await supabase
    .from('invitations')
    .select('id')
    .eq('org_id', orgId)
    .eq('email', email)
    .eq('accepted', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (pendingInvite) return { error: 'A pending invitation already exists for this email' };

  // Fetch org name and inviter name for the email
  const [{ data: center }, { data: inviter }] = await Promise.all([
    supabase.from('centers').select('name').eq('id', orgId).single(),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ]);

  // Insert the invitation
  const { data: invitation, error: insertError } = await supabase
    .from('invitations')
    .insert({ org_id: orgId, email, role, invited_by: user.id })
    .select('token')
    .single();

  if (insertError || !invitation) {
    console.error('Invitation insert error:', insertError);
    return { error: 'Failed to create invitation' };
  }

  // Send the email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: 'Loop-Learn <onboarding@resend.dev>',
      to: [email],
      subject: `You've been invited to join ${center?.name ?? 'an organization'} on Loop-Learn`,
      react: React.createElement(InvitationEmail, {
        orgName: center?.name ?? 'the organization',
        inviterName: inviter?.full_name ?? 'A director',
        role,
        inviteUrl: `${APP_URL}/invite/${invitation.token}`,
      }),
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return { error: 'Invitation created but email failed to send' };
    }
  } catch (e) {
    console.error('Email send error:', e);
    return { error: 'Invitation created but email failed to send' };
  }

  return { success: true };
}

// Accepts an invitation for the currently logged-in user.
export async function acceptInvitation(
  token: string
): Promise<{ orgId: string } | { error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Look up the invitation
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('id, org_id, role, email, accepted, expires_at')
    .eq('token', token)
    .single();

  if (fetchError || !invitation) return { error: 'Invitation not found' };
  if (invitation.accepted) return { error: 'This invitation has already been used' };
  if (new Date(invitation.expires_at) < new Date()) return { error: 'This invitation has expired' };

  // Insert into organization_members (RLS policy "Users can join via valid invitation" covers this)
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({ org_id: invitation.org_id, user_id: user.id, role: invitation.role });

  if (memberError) {
    console.error('Member insert error:', memberError);
    return { error: 'Failed to join organization' };
  }

  // Mark the invitation as accepted
  await supabase
    .from('invitations')
    .update({ accepted: true })
    .eq('id', invitation.id);

  return { orgId: invitation.org_id };
}

// Returns all pending (unexpired, unaccepted) invitations for an org.
// Only directors of the org may call this.
export async function getPendingInvitations(
  orgId: string
): Promise<{ id: string; email: string; role: string; expires_at: string }[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('invitations')
    .select('id, email, role, expires_at')
    .eq('org_id', orgId)
    .eq('accepted', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  return data ?? [];
}

export type OrgMember = {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  joinedAt: string;
};

// Returns all members of an org with their profile info.
export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('organization_members')
    .select('role, joined_at, profiles(id, full_name, email)')
    .eq('org_id', orgId)
    .order('joined_at', { ascending: true });

  return (data ?? [])
    .map(row => {
      const profileData = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      const p = profileData as { id: string; full_name: string | null; email: string } | null;
      return {
        id: p?.id ?? '',
        fullName: p?.full_name ?? null,
        email: p?.email ?? '',
        role: row.role as string,
        joinedAt: row.joined_at as string,
      };
    })
    .filter(m => m.id);
}

export type InvitationDetails = {
  token: string;
  orgId: string;
  orgName: string;
  inviterName: string;
  role: string;
  email: string;
};

// Fetches invitation metadata by token — used on the /invite/[token] page.
// Accessible to logged-out users (RLS allows public SELECT on invitations).
export async function getInvitationByToken(
  token: string
): Promise<InvitationDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invitations')
    .select('org_id, email, role, accepted, expires_at, centers(name), profiles!invitations_invited_by_fkey(full_name)')
    .eq('token', token)
    .single();

  if (error || !data) return null;
  if (data.accepted) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  const centerData = Array.isArray(data.centers) ? data.centers[0] : data.centers;
  const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

  return {
    token,
    orgId: data.org_id as string,
    orgName: (centerData as { name: string } | null)?.name ?? 'the organization',
    inviterName: (profileData as { full_name: string | null } | null)?.full_name ?? 'A director',
    role: data.role as string,
    email: data.email as string,
  };
}

// Cancels a pending invitation by ID.
export async function cancelInvitation(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}
