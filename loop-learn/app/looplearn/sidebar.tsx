'use client';
import React from 'react';
import { D, Role, Screen } from './data';
import { Icon } from './icons';
import { DAvatar } from './ui';

type NavItem = { id: Screen; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  tutor: [
    { id: 'tutor-home',     label: 'Home',     icon: Icon.home },
    { id: 'tutor-reports',  label: 'Reports',  icon: Icon.book },
    { id: 'tutor-calendar', label: 'Calendar', icon: Icon.calendar },
    { id: 'tutor-inbox',    label: 'Inbox',    icon: Icon.chat },
  ],
  director: [
    { id: 'director-home',     label: 'Dashboard', icon: Icon.home },
    { id: 'director-reports',  label: 'Reports',   icon: Icon.inbox },
    { id: 'director-schedule', label: 'Schedule',  icon: Icon.calendar },
    { id: 'director-students', label: 'Students',  icon: Icon.user },
    { id: 'director-messages', label: 'Messages',  icon: Icon.chat },
  ],
  parent: [
    { id: 'parent-home',     label: 'Home',     icon: Icon.home },
    { id: 'parent-reports',  label: 'Reports',  icon: Icon.book },
    { id: 'parent-student',  label: 'Sofia',    icon: Icon.user },
    { id: 'parent-messages', label: 'Messages', icon: Icon.chat },
  ],
};

const ROLE_PROFILES: Record<Role, { name: string; initials: string; sub: string; color: string }> = {
  tutor:    { name: 'Maya Chen',   initials: 'MC', sub: 'Tutor',    color: D.blue },
  director: { name: 'Jordan Park', initials: 'JP', sub: 'Director', color: D.blueDeep },
  parent:   { name: 'Elena Ruiz',  initials: 'ER', sub: 'Parent',   color: '#7c3aed' },
};

export function Sidebar({ role, screen, go, onSignOut }: {
  role: Role;
  screen: Screen;
  go: (s: Screen) => void;
  onSignOut: () => void;
}) {
  const items = NAV_BY_ROLE[role];
  const profile = ROLE_PROFILES[role];

  const isActive = (item: NavItem) =>
    screen === item.id ||
    (item.id.includes('-reports') && screen.includes('-report'));

  return (
    <div style={{
      width: D.sidebarW, flexShrink: 0, height: '100%',
      background: D.panel, borderRight: `1px solid ${D.borderSoft}`,
      display: 'flex', flexDirection: 'column',
      padding: '22px 14px 16px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: D.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(0,102,255,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M7 9.5V15c0 1.5 2.5 3 5 3s5-1.5 5-3V9.5"/>
          </svg>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: D.text, letterSpacing: -0.4 }}>Looplearn</div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {items.map(item => {
          const active = isActive(item);
          return (
            <button key={item.id} onClick={() => go(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 11px', borderRadius: 10,
              background: active ? D.blueWash : 'transparent',
              color: active ? D.blueDeep : D.textMute,
              border: 0, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1,
              textAlign: 'left',
            }}>
              <item.icon width={18} height={18}/>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 8px 4px', marginTop: 8 }}>
        <DAvatar initials={profile.initials} color={profile.color} size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: D.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</div>
          <div style={{ fontSize: 10.5, color: D.textFaint, fontWeight: 600 }}>{profile.sub}</div>
        </div>
        <button onClick={onSignOut} title="Sign out" style={{
          width: 28, height: 28, borderRadius: 8, border: 0,
          background: 'transparent', color: D.textFaint, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.signout width={15} height={15}/>
        </button>
      </div>
    </div>
  );
}
