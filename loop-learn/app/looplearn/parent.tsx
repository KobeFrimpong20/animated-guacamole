'use client';
import React, { useState, useEffect } from 'react';
import { D, MOCK, MONTH_META, GoFn } from './data';
import { Icon } from './icons';
import { DAvatar, DPill, DCard, DBtn, DPageHeader, DSectionLabel, DEmpty } from './ui';
import { StudentDetail } from './director-more';

// ── Parent: Home ──────────────────────────────────────────────────────────

export function ParentHomeD({ go }: { go: GoFn }) {
  const child = MOCK.students.find(s => s.name === MOCK.parent.studentName) || MOCK.students[0];
  const latestReport = {
    id: 'r1', student: 'Sofia Ruiz', subject: 'Algebra I',
    tutor: 'Maya Chen', tutorInitials: 'MC', sentAt: 'Just now',
    summary: MOCK.pendingReports[0].summary,
    highlight: 'Caught the trick on problem 4 unprompted — big confidence win.',
  };

  return (
    <div>
      <DPageHeader title="Hi Elena" subtitle="Wednesday, May 20, 2026"/>
      <div style={{ padding: '0 36px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* New report hero */}
          <button onClick={() => go('parent-reports', { reportId: latestReport.id })} style={{
            background: D.blue, color: '#fff', borderRadius: 18, padding: 28,
            cursor: 'pointer', border: 0, textAlign: 'left',
            boxShadow: '0 16px 40px rgba(0,102,255,0.28)', fontFamily: 'inherit',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }}/>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, opacity: 0.9 }}>NEW REPORT</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>{latestReport.student} · {latestReport.subject}</div>
            <div style={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.55, marginBottom: 18, maxWidth: 540 }}>{latestReport.summary}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <DAvatar initials="MC" size={32} color="rgba(255,255,255,0.25)"/>
              <div style={{ fontSize: 13 }}>From Maya · just now</div>
              <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Open report <Icon.arrow width={16} height={16}/>
              </div>
            </div>
          </button>

          {/* Older reports */}
          <DCard padded={false}>
            <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Recent reports</div>
              <button onClick={() => go('parent-reports')} style={{ background: 'transparent', border: 0, color: D.blue, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>View all →</button>
            </div>
            {MOCK.approvedReports.map(r => (
              <button key={r.id} onClick={() => go('parent-reports', { reportId: r.id })} style={{
                display: 'flex', width: '100%', textAlign: 'left',
                padding: '14px 22px', alignItems: 'center', gap: 12,
                borderTop: `1px solid ${D.borderSoft}`,
                background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <DAvatar initials={r.tutorInitials || 'MC'} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{r.subject} · {r.sentAt}</div>
                  <div style={{ fontSize: 12, color: D.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.highlight}</div>
                </div>
                <DPill tone="gray">Read</DPill>
              </button>
            ))}
          </DCard>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <DCard>
            <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3, marginBottom: 12 }}>Quick actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <QuickAction icon="📅" label="Request a session" sub="Pick dates that work for you" onClick={() => go('parent-request')}/>
              <QuickAction icon="💬" label="Message Jordan" sub="Director · usually replies same day" onClick={() => go('parent-messages')}/>
              <QuickAction icon="👤" label={`${child.name.split(' ')[0]}'s profile`} sub="Goal, subjects, tutors" onClick={() => go('parent-student')}/>
            </div>
          </DCard>

          <DCard>
            <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3, marginBottom: 4 }}>{child.name}</div>
            <div style={{ fontSize: 12, color: D.textMute, marginBottom: 12 }}>{child.grade}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {child.subjects.map(s => <DPill key={s} tone="blue">{s}</DPill>)}
            </div>
          </DCard>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: D.panelSoft, border: 0, borderRadius: 12, cursor: 'pointer',
      fontFamily: 'inherit', textAlign: 'left', width: '100%',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: D.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{label}</div>
        <div style={{ fontSize: 11.5, color: D.textMute }}>{sub}</div>
      </div>
      <Icon.arrow width={14} height={14} style={{ color: D.textFaint }}/>
    </button>
  );
}

// ── Parent: Reports (master-detail) ───────────────────────────────────────

export function ParentReportsD({ go: _go, params }: { go: GoFn; params?: { reportId?: string } }) {
  const reports = [
    {
      id: 'r1', student: 'Sofia Ruiz', subject: 'Algebra I',
      tutor: 'Maya Chen', tutorInitials: 'MC', sentAt: 'Just now',
      summary: MOCK.pendingReports[0].summary,
      strengths: MOCK.pendingReports[0].strengths,
      growth: MOCK.pendingReports[0].growth,
      homework: MOCK.pendingReports[0].homework,
      next: MOCK.pendingReports[0].next,
      knack: 'debugger',
    },
    ...MOCK.approvedReports,
  ];
  const [selectedId, setSelectedId] = useState(params?.reportId || reports[0].id);
  const selected = reports.find(r => r.id === selectedId) || reports[0];
  useEffect(() => { if (params?.reportId) setSelectedId(params.reportId); }, [params?.reportId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Sofia's reports" subtitle={`${reports.length} total`}/>
      <div style={{ display: 'flex', padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        {/* List */}
        <div style={{
          width: 360, flexShrink: 0,
          background: D.panel, borderRadius: '14px 0 0 14px',
          borderRight: `1px solid ${D.borderSoft}`, overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {reports.map((r, idx) => {
            const active = r.id === selectedId;
            return (
              <button key={r.id} onClick={() => setSelectedId(r.id)} style={{
                display: 'flex', width: '100%', textAlign: 'left',
                gap: 12, padding: '14px 18px',
                borderLeft: active ? `3px solid ${D.blue}` : '3px solid transparent',
                background: active ? D.blueWash : 'transparent',
                borderBottom: `1px solid ${D.borderSoft}`,
                border: 0, cursor: 'pointer', fontFamily: 'inherit', alignItems: 'flex-start',
              }}>
                <DAvatar initials={r.tutorInitials || 'MC'} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{r.subject}</div>
                    <div style={{ fontSize: 11, color: D.textFaint, fontWeight: 600 }}>{r.sentAt}</div>
                  </div>
                  <div style={{ fontSize: 12, color: D.textMute, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.summary || r.highlight}
                  </div>
                  {idx === 0 && <div style={{ marginTop: 8 }}><DPill tone="blue">New</DPill></div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div style={{
          flex: 1, minWidth: 0,
          background: D.panel, borderRadius: '0 14px 14px 0',
          overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          <div style={{ padding: '28px 36px 40px' }}>
            <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 700, letterSpacing: 0.4 }}>SESSION REPORT</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6, marginTop: 4 }}>{selected.student} · {selected.subject}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <DAvatar initials={selected.tutorInitials || 'MC'} size={24}/>
              <div style={{ fontSize: 12.5, color: D.textMute }}>From {selected.tutor} · {selected.sentAt}</div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {([
                ['Summary', selected.summary || selected.highlight],
                ['Strengths', selected.strengths],
                ['Growth areas', selected.growth],
                ['Homework', selected.homework],
                ['Next session', selected.next],
              ] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontSize: 13.5, color: D.text, lineHeight: 1.6 }}>{v}</div>
                </div>
              ))}

              {selected.knack && (() => {
                const k = MOCK.knacks.find(x => x.id === selected.knack);
                if (!k) return null;
                return (
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' }}>
                      {selected.student.split(' ')[0]}&apos;s knack
                    </div>
                    {/* Hero knack card */}
                    <div style={{
                      background: `linear-gradient(135deg, ${D.blueDeep} 0%, ${D.blue} 55%, #4d8eff 100%)`,
                      borderRadius: 16, padding: '20px 22px', color: '#fff', marginBottom: 14,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, opacity: 0.8, marginBottom: 10 }}>KNACK SPOTTED</div>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ fontSize: 40 }}>{k.emoji}</div>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{k.label}</div>
                          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{k.tag}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 14, lineHeight: 1.5 }}>{k.desc}</div>
                    </div>
                    {/* Paths to imagine */}
                    <div style={{ background: D.panelSoft, borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 10 }}>🧭 PATHS TO IMAGINE</div>
                      {k.careers.map((c, i) => (
                        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: i ? `1px solid ${D.borderSoft}` : 0 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 11, background: D.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: D.blueDeep }}>{i + 1}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: D.text }}>{c}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Parent: Student profile ───────────────────────────────────────────────

export function ParentStudentD({ go }: { go: GoFn }) {
  const student = MOCK.students.find(s => s.name === MOCK.parent.studentName) || MOCK.students[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title={student.name} subtitle={student.grade}/>
      <div style={{ padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        <DCard padded={false}>
          <StudentDetail student={student} go={go}/>
        </DCard>
      </div>
    </div>
  );
}

// ── Parent: Messages ──────────────────────────────────────────────────────

export function ParentMessagesD({ go: _go }: { go: GoFn }) {
  const messages = MOCK.threads.parentDirector;
  const [draft, setDraft] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Messages"/>
      <div style={{ padding: '0 36px 36px', flex: 1, minHeight: 0, display: 'flex' }}>
        <DCard padded={false} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${D.borderSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <DAvatar initials="JP" color={D.blueDeep} size={40}/>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: D.text }}>Jordan Park</div>
              <div style={{ fontSize: 12, color: D.textMute }}>Director · Northbridge Learning</div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  background: m.from === 'me' ? D.blue : D.panelSoft,
                  color: m.from === 'me' ? '#fff' : D.text,
                  borderRadius: 16, padding: '10px 14px',
                  fontSize: 13.5, lineHeight: 1.45,
                }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${D.borderSoft}`, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message Jordan…" style={{
              flex: 1, minHeight: 40, maxHeight: 120,
              padding: '10px 14px', borderRadius: 12, border: 0,
              background: D.panelSoft, fontFamily: 'inherit', fontSize: 13.5,
              color: D.text, outline: 'none', resize: 'none', boxSizing: 'border-box',
            }}/>
            <DBtn icon={<Icon.send width={14} height={14}/>}>Send</DBtn>
          </div>
        </DCard>
      </div>
    </div>
  );
}

// ── Parent: Request session ───────────────────────────────────────────────

export function ParentRequestD({ go }: { go: GoFn }) {
  const child = MOCK.students.find(s => s.name === MOCK.parent.studentName) || MOCK.students[0];
  const [subject, setSubject] = useState(child.subjects[0]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const { today, firstDow, daysInMonth } = MONTH_META;
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const toggleDay = (d: number) => setSelected(prev => {
    const next = { ...prev };
    if (next[d]) delete next[d]; else next[d] = 'afternoon';
    return next;
  });
  const setWindow = (d: number, w: string) => setSelected(prev => ({ ...prev, [d]: w }));
  const selectedDays = Object.keys(selected).map(Number).sort((a, b) => a - b);
  const canSubmit = selectedDays.length > 0;

  if (sent) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: D.green, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, boxShadow: '0 16px 40px rgba(16,185,129,0.32)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6 }}>Request sent</div>
        <div style={{ fontSize: 14, color: D.textMute, marginTop: 10, maxWidth: 420, lineHeight: 1.5 }}>
          Jordan will confirm a tutor and time within a day. You&apos;ll get a notification when it&apos;s booked.
        </div>
        <div style={{ marginTop: 24 }}><DBtn onClick={() => go('parent-home')}>Back to home</DBtn></div>
      </div>
    );
  }

  return (
    <div>
      <DPageHeader
        title="Request a session"
        subtitle={`For ${child.name.split(' ')[0]}`}
        right={<DBtn variant="ghost" onClick={() => go('parent-home')}>Cancel</DBtn>}
      />
      <div style={{ padding: '0 36px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, alignItems: 'start' }}>
        <DCard>
          <DSectionLabel>Subject</DSectionLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
            {child.subjects.map(sub => {
              const on = subject === sub;
              return (
                <button key={sub} onClick={() => setSubject(sub)} style={{
                  background: on ? D.blue : D.panelSoft, color: on ? '#fff' : D.text,
                  border: 0, padding: '9px 16px', borderRadius: 999,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: on ? '0 6px 16px rgba(0,102,255,0.25)' : 'none',
                }}>{sub}</button>
              );
            })}
          </div>

          <DSectionLabel>Preferred dates</DSectionLabel>
          <div style={{ background: D.panelSoft, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
              {dows.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: D.textMute, letterSpacing: 0.5, padding: '6px 0' }}>{d.toUpperCase()}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((d, i) => {
                if (d == null) return <div key={i} style={{ aspectRatio: '1' }}/>;
                const past = d < today, isToday = d === today, isSelected = selected[d] != null;
                return (
                  <button key={i} disabled={past} onClick={() => toggleDay(d)} style={{
                    aspectRatio: '1', border: 0, padding: 0,
                    background: isSelected ? D.blue : isToday ? D.blueWash : '#fff',
                    color: isSelected ? '#fff' : isToday ? D.blueDeep : D.text,
                    fontSize: 14, fontWeight: isSelected || isToday ? 800 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    cursor: past ? 'default' : 'pointer', opacity: past ? 0.35 : 1,
                    borderRadius: 10, fontFamily: 'inherit',
                  }}>{d}</button>
                );
              })}
            </div>
          </div>

          {selectedDays.length > 0 && (
            <>
              <DSectionLabel right={
                <button onClick={() => setSelected({})} style={{ background: 'transparent', border: 0, color: D.textMute, fontWeight: 700, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.4 }}>Clear all</button>
              }>Time windows</DSectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedDays.map(d => {
                  const dow = dows[(firstDow + d - 1) % 7];
                  const w = selected[d];
                  return (
                    <div key={d} style={{ background: D.panelSoft, borderRadius: 12, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: D.text, fontVariantNumeric: 'tabular-nums' }}>May {d}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: D.textMute }}>{dow}</div>
                        </div>
                        <button onClick={() => toggleDay(d)} style={{ background: 'transparent', border: 0, color: D.textFaint, cursor: 'pointer', padding: 4 }}>
                          <Icon.x width={14} height={14}/>
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                        {[
                          { id: 'afternoon', label: 'Afternoon', sub: '3–5pm' },
                          { id: 'evening',   label: 'Evening',   sub: '5–8pm' },
                          { id: 'anytime',   label: 'Anytime',   sub: '' },
                        ].map(opt => {
                          const on = w === opt.id;
                          return (
                            <button key={opt.id} onClick={() => setWindow(d, opt.id)} style={{
                              background: on ? D.blueWash : '#fff',
                              border: on ? `1.5px solid ${D.blue}` : `1.5px solid ${D.borderSoft}`,
                              borderRadius: 10, padding: '8px 4px', cursor: 'pointer',
                              fontFamily: 'inherit', textAlign: 'center',
                            }}>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? D.blueDeep : D.text }}>{opt.label}</div>
                              {opt.sub && <div style={{ fontSize: 10.5, color: on ? D.blueDeep : D.textMute, marginTop: 1 }}>{opt.sub}</div>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <DSectionLabel>Note for Jordan (optional)</DSectionLabel>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Anything the team should know — upcoming test, focus area, preferred tutor…"
            style={{
              width: '100%', minHeight: 90, padding: 12,
              border: `1px solid ${D.borderSoft}`, borderRadius: 12,
              fontFamily: 'inherit', fontSize: 13.5, color: D.text, lineHeight: 1.55,
              background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}/>
        </DCard>

        {/* Summary */}
        <DCard>
          <div style={{ fontSize: 16, fontWeight: 800, color: D.text, marginBottom: 4 }}>Request summary</div>
          <div style={{ fontSize: 12.5, color: D.textMute, marginBottom: 16 }}>Jordan reviews and confirms within a day.</div>
          <SummaryRow label="Student" value={child.name}/>
          <SummaryRow label="Subject" value={subject}/>
          <SummaryRow label="Dates" value={
            selectedDays.length === 0
              ? <span style={{ color: D.textFaint }}>None yet</span>
              : <span>{selectedDays.length} {selectedDays.length === 1 ? 'date' : 'dates'}</span>
          }/>
          {selectedDays.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {selectedDays.map(d => <DPill key={d} tone="blue">May {d} · {selected[d]}</DPill>)}
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <DBtn full disabled={!canSubmit} onClick={() => setSent(true)}>
              {canSubmit ? `Send request · ${selectedDays.length} ${selectedDays.length === 1 ? 'date' : 'dates'}` : 'Pick at least one date'}
            </DBtn>
          </div>
        </DCard>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${D.borderSoft}`, fontSize: 13 }}>
      <div style={{ color: D.textMute, fontWeight: 600 }}>{label}</div>
      <div style={{ color: D.text, fontWeight: 700, textAlign: 'right' }}>{value}</div>
    </div>
  );
}
