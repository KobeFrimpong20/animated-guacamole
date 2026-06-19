'use client';

// Main dashboard page — detects the logged-in user's role and renders
// the appropriate dashboard component. All roles land here after login.

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getRoleFromUser, Role } from '@/lib/roles';
import TutorDashboard from '../components/TutorDashboard';
import FamilyDashboard from '../components/FamilyDashboard';
import DirectorDashboard from '../components/DirectorDashboard';
import AdminDashboard from '../components/AdminDashboard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  // undefined = still loading, null = loaded but no role set, Role = fully resolved
  const [role, setRole] = useState<Role | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Extract display name, falling back to the email prefix
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';
      setUsername(name);
      setUserId(user.id);

      // Resolve the role — null if unset or unrecognized
      setRole(getRoleFromUser(user));
    });
  }, []);

  // Don't render anything while the user data is still loading.
  // This prevents a flash of the wrong dashboard.
  if (role === undefined) {
    return null;
  }

  // If the user has no role assigned, show a clear message instead of a broken UI.
  if (role === null) {
    return (
      <div className="p-8">
        <p className="text-zinc-500 dark:text-zinc-400">
          Your account does not have a role assigned yet. Please contact a director.
        </p>
      </div>
    );
  }

  // Render the dashboard that matches the user's role
  if (role === 'tutor')     return <TutorDashboard username={username} userId={userId} />;
  if (role === 'family')    return <FamilyDashboard username={username} userId={userId} />;
  if (role === 'director')  return <DirectorDashboard username={username} />;
  if (role === 'admin')     return <AdminDashboard username={username} />;
}
