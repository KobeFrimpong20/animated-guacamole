// All roles defined in the Supabase `user_role` postgres enum.
// This type is the single source of truth — all role checks should reference it.
// 'admin' is a placeholder role — its dashboard will be defined later.
export type Role = 'tutor' | 'director' | 'family' | 'admin';

// All valid role values as an array, useful for validation.
const VALID_ROLES: Role[] = ['tutor', 'director', 'family', 'admin'];

/**
 * Reads the role from a Supabase User object's metadata.
 *
 * Returns null if:
 *   - the user is not logged in (user is null)
 *   - the role field is missing from their metadata
 *   - the role field contains an unrecognized value
 *
 * Usage (client component):
 *   const { data: { user } } = await supabase.auth.getUser();
 *   const role = getRoleFromUser(user);
 */
export function getRoleFromUser(user: { user_metadata?: Record<string, unknown> } | null): Role | null {
  if (!user) return null;

  const raw = user.user_metadata?.role;

  // Guard against unexpected values (e.g. typos set in Supabase dashboard)
  if (typeof raw === 'string' && (VALID_ROLES as string[]).includes(raw)) {
    return raw as Role;
  }

  return null;
}
