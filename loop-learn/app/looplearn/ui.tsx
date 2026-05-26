'use client';
import React from 'react';
import { D } from './data';

// ── Avatar ─────────────────────────────────────────────────────────────────

export function DAvatar({ initials, color = D.blue, size = 36, ring = false }: {
  initials: string; color?: string; size?: number; ring?: boolean;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, letterSpacing: -0.2,
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 3px rgba(255,255,255,1), 0 0 0 4px ${color}33` : 'none',
    }}>{initials}</div>
  );
}

// ── Pill ───────────────────────────────────────────────────────────────────

type PillTone = 'blue' | 'amber' | 'green' | 'red' | 'gray';

const PILL_TONES: Record<PillTone, { bg: string; fg: string }> = {
  blue:  { bg: D.blueSoft,                fg: D.blueDeep },
  amber: { bg: 'rgba(245,158,11,0.14)',   fg: '#b45309' },
  green: { bg: 'rgba(16,185,129,0.14)',   fg: '#047857' },
  red:   { bg: 'rgba(239,68,68,0.12)',    fg: '#b91c1c' },
  gray:  { bg: '#eef2fa',                 fg: D.textMute },
};

export function DPill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: PillTone }) {
  const t = PILL_TONES[tone];
  return (
    <span style={{
      background: t.bg, color: t.fg,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 700, letterSpacing: 0.1,
      whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>{children}</span>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

export function DCard({ children, style, padded = true }: {
  children: React.ReactNode; style?: React.CSSProperties; padded?: boolean;
}) {
  return (
    <div style={{
      background: D.panel, borderRadius: 16,
      boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
      padding: padded ? 20 : 0,
      ...style,
    }}>{children}</div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'soft' | 'ghost' | 'danger' | 'success';

const BTN_STYLES: Record<BtnVariant, { bg: string; fg: string; shadow: string }> = {
  primary: { bg: D.blue,                     fg: '#fff',     shadow: '0 6px 16px rgba(0,102,255,0.25)' },
  soft:    { bg: D.blueWash,                 fg: D.blueDeep, shadow: 'none' },
  ghost:   { bg: 'transparent',              fg: D.textMute, shadow: 'none' },
  danger:  { bg: 'rgba(239,68,68,0.1)',      fg: '#b91c1c',  shadow: 'none' },
  success: { bg: D.green,                    fg: '#fff',     shadow: '0 6px 16px rgba(16,185,129,0.25)' },
};

export function DBtn({ children, variant = 'primary', onClick, icon, small = false, full = false, disabled = false }: {
  children: React.ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  icon?: React.ReactNode;
  small?: boolean;
  full?: boolean;
  disabled?: boolean;
}) {
  const s = BTN_STYLES[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#cdd9f0' : s.bg,
      color: disabled ? '#fff' : s.fg,
      border: 0, borderRadius: 10, cursor: disabled ? 'default' : 'pointer',
      padding: small ? '7px 12px' : '10px 16px',
      fontFamily: 'inherit', fontSize: small ? 12.5 : 13.5, fontWeight: 700,
      letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      boxShadow: disabled ? 'none' : s.shadow,
      width: full ? '100%' : 'auto',
    }}>{icon}{children}</button>
  );
}

// ── Section label ──────────────────────────────────────────────────────────

export function DSectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 12px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, textTransform: 'uppercase' }}>{children}</div>
      {right}
    </div>
  );
}

// ── Page header ────────────────────────────────────────────────────────────

export function DPageHeader({ title, subtitle, right }: {
  title: string; subtitle?: string; right?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '32px 36px 24px', gap: 16 }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 14, color: D.textMute, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

export function DEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: 32, textAlign: 'center', color: D.textFaint, fontSize: 13,
      background: D.panelSoft, borderRadius: 14, fontStyle: 'italic',
    }}>{children}</div>
  );
}

// ── Report section (used in detail panels) ─────────────────────────────────

export function ReportSection({ label, children, editable, editing, setEditing }: {
  label: string;
  children: React.ReactNode;
  editable?: boolean;
  editing?: boolean;
  setEditing?: (v: boolean) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
        {editable && setEditing && (
          <button onClick={() => setEditing(!editing)} style={{
            background: 'transparent', border: 0, color: D.blue, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
          }}>{editing ? 'Done' : 'Edit'}</button>
        )}
      </div>
      {editing ? (
        <textarea defaultValue={String(children)} style={{
          width: '100%', minHeight: 90, padding: 14,
          border: `1.5px solid ${D.blue}`, borderRadius: 12,
          fontFamily: 'inherit', fontSize: 13.5, color: D.text, lineHeight: 1.55,
          background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        }}/>
      ) : (
        <div style={{ fontSize: 13.5, color: D.text, lineHeight: 1.6 }}>{children}</div>
      )}
    </div>
  );
}

// ── Knack badge (shared across director/parent report views) ───────────────

export function KnackBadge({ knackId, knacks }: {
  knackId: string;
  knacks: Array<{ id: string; emoji: string; label: string; tag: string }>;
}) {
  const k = knacks.find(x => x.id === knackId);
  if (!k) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: D.blueWash, borderRadius: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 20,
        background: `linear-gradient(135deg, ${D.blue} 0%, #4d8eff 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>{k.emoji}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: D.text }}>{k.label}</div>
        <div style={{ fontSize: 12, color: D.textMute }}>{k.tag}</div>
      </div>
    </div>
  );
}

// ── Form helpers (used in TutorCompose) ────────────────────────────────────

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: `1px solid ${D.borderSoft}`, borderRadius: 10,
  fontFamily: 'inherit', fontSize: 13.5, color: D.text,
  outline: 'none', boxSizing: 'border-box',
};

export function FormInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return <input defaultValue={defaultValue} placeholder={placeholder} style={inputStyle}/>;
}

export function FormSelect({ options }: { options: string[] }) {
  return (
    <select style={{ ...inputStyle, background: '#fff' }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}
