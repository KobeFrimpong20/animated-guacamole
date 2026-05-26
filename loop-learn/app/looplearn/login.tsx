'use client';
import React, { useState } from 'react';
import { D, Role } from './data';

export function DesktopLogin({ onEnter }: { onEnter: (role: Role) => void }) {
  const [step, setStep] = useState<'role-select' | 'login'>('role-select');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState<Role>('tutor');
  const [remember, setRemember] = useState(true);

  const canSubmit = email.trim().length > 0 && pw.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onEnter(role);
  };

  const loginInputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${D.borderSoft}`, borderRadius: 11,
    fontFamily: 'inherit', fontSize: 14, color: D.text,
    outline: 'none', boxSizing: 'border-box',
  };

  const ROLE_OPTIONS: { id: Role; label: string; description: string; icon: string }[] = [
    { id: 'tutor',    label: 'Tutor',    description: 'Manage your sessions and reports',   icon: '📝' },
    { id: 'director', label: 'Director', description: 'Oversee your team and students',     icon: '🏫' },
    { id: 'parent',   label: 'Parent',   description: "Follow your child's progress",       icon: '👨‍👧' },
  ];

  const ROLE_LABELS: Record<Role, string> = {
    tutor: 'Tutor',
    director: 'Director',
    parent: 'Parent',
  };

  return (
    <div style={{ height: '100%', display: 'flex', fontFamily: D.font, color: D.text, background: '#fff' }}>
      {/* Brand panel */}
      <div style={{
        width: '46%', flexShrink: 0, position: 'relative',
        background: `linear-gradient(140deg, ${D.blueDeep} 0%, ${D.blue} 55%, #4d8eff 100%)`,
        color: '#fff', padding: '56px 56px 44px',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -120, right: -160 }}/>
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -90, left: -90 }}/>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M7 9.5V15c0 1.5 2.5 3 5 3s5-1.5 5-3V9.5"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Looplearn</div>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 'auto', position: 'relative' }}>
          <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.05, maxWidth: 460 }}>
            Tutoring,<br/>kept in the loop —<br/>for everyone.
          </div>
          <div style={{ fontSize: 15, opacity: 0.85, marginTop: 18, maxWidth: 420, lineHeight: 1.55 }}>
            One workspace for tutors, directors, and parents. Reports flow straight to the family, schedules update for the whole team, and every student&apos;s strengths get noticed.
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 38, flexWrap: 'wrap' }}>
            {[
              { icon: '📝', label: 'Session reports' },
              { icon: '🗓️', label: 'Shared schedule' },
              { icon: '✨', label: 'Knacks & strengths' },
            ].map(f => (
              <div key={f.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
                padding: '10px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>{f.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 36, fontSize: 12, opacity: 0.7, display: 'flex', gap: 22 }}>
          <span>© 2026 Looplearn</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex: 1, minWidth: 0, padding: '56px 64px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {step === 'role-select' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 13, color: D.textMute }}>
              New to Looplearn?{' '}
              <button style={{ background: 'transparent', border: 0, color: D.blue, fontWeight: 700, marginLeft: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                Request access
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420, alignSelf: 'center', width: '100%' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: D.text, letterSpacing: -0.8 }}>Sign in as</div>
              <div style={{ fontSize: 14, color: D.textMute, marginTop: 8 }}>Choose how you use Looplearn.</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                {ROLE_OPTIONS.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id); setStep('login'); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 18,
                      padding: '20px 22px', borderRadius: 14,
                      background: '#fff', border: `1.5px solid ${D.borderSoft}`,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = D.blue;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,102,255,0.12)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = D.borderSoft;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 13,
                      background: D.blueWash,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: D.text, letterSpacing: -0.2 }}>{r.label}</div>
                      <div style={{ fontSize: 13, color: D.textMute, marginTop: 2 }}>{r.description}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: D.textFaint, fontSize: 18 }}>›</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: D.textMute }}>
              <button
                type="button"
                onClick={() => setStep('role-select')}
                style={{ background: 'transparent', border: 0, color: D.textMute, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
              >
                ← Back
              </button>
              New to Looplearn?{' '}
              <button style={{ background: 'transparent', border: 0, color: D.blue, fontWeight: 700, marginLeft: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                Request access
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420, alignSelf: 'center', width: '100%' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: D.text, letterSpacing: -0.8 }}>Welcome back</div>
              <div style={{ fontSize: 14, color: D.textMute, marginTop: 8 }}>
                Signing in as <span style={{ color: D.blue, fontWeight: 700 }}>{ROLE_LABELS[role]}</span>.
              </div>

              {/* SSO row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
                <SSOButton label="Continue with Google" icon={
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-7.9z"/>
                    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8C3.8 20.4 7.6 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.7 14.1a6.7 6.7 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8z"/>
                    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 12 1C7.6 1 3.8 3.6 2 7.1l3.7 2.8C6.6 7.4 9.1 5.4 12 5.4z"/>
                  </svg>
                }/>
                <SSOButton label="Continue with SSO" icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                }/>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: D.textFaint, fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>
                <div style={{ flex: 1, height: 1, background: D.borderSoft }}/>
                OR
                <div style={{ flex: 1, height: 1, background: D.borderSoft }}/>
              </div>

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <LoginField label="Email">
                  <input type="email" placeholder="you@school.org" value={email} onChange={e => setEmail(e.target.value)} style={loginInputStyle}/>
                </LoginField>
                <LoginField label="Password" right={
                  <button type="button" style={{ background: 'transparent', border: 0, color: D.blue, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Forgot?</button>
                }>
                  <input type="password" placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)} style={loginInputStyle}/>
                </LoginField>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: D.textMute, cursor: 'pointer', marginTop: 4 }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: D.blue }}/>
                  Keep me signed in on this device
                </label>

                <button type="submit" disabled={!canSubmit} style={{
                  marginTop: 8,
                  width: '100%', padding: '13px 0', borderRadius: 12, border: 0,
                  background: canSubmit ? D.blue : '#cdd9f0',
                  color: '#fff', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 700,
                  cursor: canSubmit ? 'pointer' : 'default',
                  boxShadow: canSubmit ? '0 12px 28px rgba(0,102,255,0.3)' : 'none',
                  letterSpacing: -0.1,
                }}>Sign in</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoginField({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: D.textMute, letterSpacing: 0.3 }}>{label}</div>
        {right}
      </div>
      {children}
    </label>
  );
}

function SSOButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '11px 0', borderRadius: 11,
      background: '#fff', border: `1.5px solid ${D.borderSoft}`,
      fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: D.text,
      cursor: 'pointer',
    }}>{icon} {label}</button>
  );
}
