'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getRoleFromUser, Role } from '@/lib/roles';

// Nav items shown beneath Dashboard for each role.
// Each item has the route href, display label, and two SVG path strings for the icon.
// Using two paths (d1/d2) covers icons that need a compound shape.
const NAV_BY_ROLE: Record<Role, { href: string; label: string; d1: string; d2?: string }[]> = {
  tutor: [
    {
      href: '/availability',
      label: 'Availability',
      d1: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
  ],
  // 'family' is the DB enum value for the parent/guardian role
  family: [
    {
      href: '/calendar',
      label: 'Calendar',
      d1: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      href: '/reports',
      label: 'Session Reports',
      d1: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
  ],
  director: [
    {
      href: '/schedule/upload',
      label: 'Import Schedules',
      d1: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    },
    {
      href: '/users',
      label: 'Manage Users',
      // Two paths needed for the "group of people" icon shape
      d1: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197',
      d2: 'M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ],
  // 'admin' is a placeholder role — nav items will be defined later
  admin: [],
};

export default function Sidebar() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  // role is null while loading or if the user has no role set in metadata
  const [role, setRole] = useState<Role | null>(null);
  // Controls visibility of the logout dropdown above the avatar
  const [showMenu, setShowMenu] = useState(false);
  // Ref used to detect clicks outside the avatar/menu so we can close it
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Extract display name from metadata fields, falling back to email prefix
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';
      setUsername(name);

      // Read the role from user_metadata using our shared helper
      setRole(getRoleFromUser(user));
    });
  }, []);

  // Close the menu when the user clicks anywhere outside the avatar/menu container
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redirect to login after signing out
    router.push('/login');
  };

  const initials = username
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Look up the nav items for the current role (empty array if role is null/loading)
  const roleNavItems = role ? NAV_BY_ROLE[role] : [];

  return (
    <aside className="w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-black dark:text-white">Loop-Learn</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {/* Dashboard is shown to every role */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        {/* Role-specific nav items — populated from NAV_BY_ROLE above */}
        {roleNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.d1} />
              {/* Render the second path only for compound icons */}
              {item.d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.d2} />}
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">

          {/* Avatar — click to open/close the logout menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-zinc-400 dark:hover:ring-zinc-500 transition-all"
            >
              {initials}
            </button>

            {/* Logout menu — floats above the avatar when open */}
            {showMenu && (
              <div className="absolute bottom-10 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden w-36">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate dark:text-zinc-200">{username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
