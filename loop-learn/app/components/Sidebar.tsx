'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getRoleFromUser, Role } from '@/lib/roles';

const NAV_BY_ROLE: Record<Role, { href: string; label: string; d1: string; d2?: string }[]> = {
  tutor: [
    {
      href: '/availability',
      label: 'Availability',
      d1: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
  ],
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
      d1: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197',
      d2: 'M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ],
  admin: [],
};

export default function Sidebar({ orgId, orgName }: { orgId: string; orgName: string }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';
      setUsername(name);
      setRole(getRoleFromUser(user));
    });
  }, []);

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
    router.push('/login');
  };

  const initials = username
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const base = `/org/${orgId}`;
  const roleNavItems = role
    ? NAV_BY_ROLE[role].map(item => ({ ...item, href: `${base}${item.href}` }))
    : [];

  return (
    <aside className="w-64 bg-brand-card border-r border-brand-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-brand-border">
        <Link href="/organizations" className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          All organizations
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-brand-primary">Loop-Learn</h1>
        {orgName && (
          <p className="mt-1 text-sm text-brand-muted truncate" title={orgName}>{orgName}</p>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 pt-4">
        <Link
          href={base}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-brand-text hover:bg-[#D8D1C7] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        {roleNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-brand-muted hover:bg-[#D8D1C7] hover:text-brand-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.d1} />
              {item.d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.d2} />}
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-brand-primary transition-all"
            >
              {initials}
            </button>

            {showMenu && (
              <div className="absolute bottom-10 left-0 bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden w-36">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
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
            <p className="text-sm font-medium truncate text-brand-text">{username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
