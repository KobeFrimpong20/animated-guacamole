'use client';
import React, { useState, useEffect } from 'react';
import { D, MOCK, GoFn } from './data';
import { Icon } from './icons';
import { DAvatar, DPill, DCard, DBtn, DPageHeader, DEmpty, ReportSection, KnackBadge } from './ui';

// ── Director: Dashboard ────────────────────────────────────────────────────

export function DirectorHome({ go }: { go: GoFn }) {
  const today = MOCK.schedule.find(d => d.date === 19) || MOCK.schedule[0];
  const allReports = [
    ...MOCK.pendingReports.map(r => ({ ...r, _status: 'sent' as const })),
    ...MOCK.approvedReports.map(r => ({ ...r, _status: 'sent' as const, summary: r.summary || r.highlight, submittedAt: r.sentAt })),
  ];
  const queue = allReports.slice(0, Math.max(today.sessions.length, 1));

  const kpis = [
    { label: 'Active students',    value: MOCK.students.length, delta: '+2 this month',            tone: 'blue' },
    { label: 'Completed reports',  value: allReports.length,    delta: 'Sent in the last 7 days',  tone: 'green' },
    { label: 'Sessions this week', value: MOCK.schedule.reduce((n, d) => n + d.sessions.length, 0), delta: '3 unassigned', tone: 'amber' },
    { label: 'Absences',           value: 2,                    delta: 'Students missed this week', tone: 'red' },
  ];
  const accentColor: Record<string, string> = { blue: D.blue, amber: D.amber, green: D.green, red: D.red };

  return (
    <div>
      <DPageHeader
        title="Good morning, Jordan"
        subtitle="Wednesday, May 20 · Northbridge Learning"
        right={<>
          <DBtn variant="soft" icon={<Icon.sparkle width={14} height={14}/>}>Ask Jordan AI</DBtn>
          <DBtn icon={<Icon.plus width={16} height={16}/>}>New session</DBtn>
        </>}
      />
      <div style={{ padding: '0 36px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {kpis.map(k => (
            <DCard key={k.label} style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: D.textMute, letterSpacing: 0.2 }}>{k.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: D.text, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{k.value}</div>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: accentColor[k.tone] }}/>
              </div>
              <div style={{ fontSize: 12, color: D.textMute, marginTop: 8 }}>{k.delta}</div>
            </DCard>
          ))}
        </div>

        {/* Two-column row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'stretch' }}>
          {/* Reports */}
          <DCard padded={false} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Reports</div>
                <div style={{ fontSize: 12.5, color: D.textMute, marginTop: 2 }}>{allReports.length} reports total</div>
              </div>
              <button onClick={() => go('director-reports')} style={{ background: 'transparent', border: 0, color: D.blue, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>View all →</button>
            </div>
            <div style={{ flex: 1 }}>
              {queue.map(r => (
                <button key={r.id} onClick={() => go('director-reports', { reportId: r.id })} style={{
                  display: 'flex', width: '100%', textAlign: 'left',
                  alignItems: 'center', gap: 14, padding: '14px 22px',
                  borderTop: `1px solid ${D.borderSoft}`,
                  background: 'transparent', border: 0, borderTopColor: D.borderSoft,
                  borderTopStyle: 'solid', borderTopWidth: 1,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <DAvatar initials={(r.tutor || 'MC').split(' ').map((w: string) => w[0]).join('')} size={36}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: D.text }}>{r.student} · {r.subject}</div>
                    <div style={{ fontSize: 12.5, color: D.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{r.summary}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <DPill tone="green">Sent</DPill>
                    <div style={{ fontSize: 11, color: D.textFaint, fontWeight: 600 }}>{r.submittedAt}</div>
                  </div>
                </button>
              ))}
            </div>
          </DCard>

          {/* Today's sessions */}
          <DCard padded={false} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 22px 12px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Today&apos;s sessions</div>
              <div style={{ fontSize: 12.5, color: D.textMute, marginTop: 2 }}>{today.sessions.length} scheduled</div>
            </div>
            <div style={{ flex: 1 }}>
              {today.sessions.length === 0 ? (
                <div style={{ padding: '0 22px 22px' }}><DEmpty>No sessions today</DEmpty></div>
              ) : today.sessions.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 22px', borderTop: `1px solid ${D.borderSoft}`, alignItems: 'center' }}>
                  <div style={{ width: 56, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: D.text, fontVariantNumeric: 'tabular-nums' }}>{s.time}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{s.student}</div>
                    <div style={{ fontSize: 12, color: D.textMute }}>with {s.tutor}</div>
                  </div>
                  <DPill tone="blue">Booked</DPill>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 22px 18px', borderTop: `1px solid ${D.borderSoft}` }}>
              <DBtn variant="soft" full onClick={() => go('director-schedule')}>Open schedule</DBtn>
            </div>
          </DCard>
        </div>

        {/* Activity */}
        <DCard padded={false}>
          <div style={{ padding: '18px 22px 12px' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Recent activity</div>
          </div>
          {[
            { who: 'Maya Chen',    icon: '📝', what: 'sent a report for Sofia Ruiz to Elena',      when: '2h ago' },
            { who: 'Elena Ruiz',   icon: '💬', what: 'replied in messages — "Thanks!"',            when: '3h ago' },
            { who: 'Marcus Lee',   icon: '🚫', what: "missed Thursday's 4pm session",             when: 'Yesterday' },
            { who: 'Tariq Banner', icon: '🗓️', what: 'set availability for next week',            when: 'Yesterday' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: `1px solid ${D.borderSoft}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: D.panelSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: D.text }}><b>{a.who}</b> {a.what}</span>
              </div>
              <div style={{ fontSize: 11.5, color: D.textFaint, fontWeight: 600 }}>{a.when}</div>
            </div>
          ))}
        </DCard>
      </div>
    </div>
  );
}

// ── Director: Reports (master-detail) ─────────────────────────────────────

export function DirectorReports({ go, params }: { go: GoFn; params?: { reportId?: string } }) {
  const all = [
    ...MOCK.pendingReports.map(r => ({ ...r, _status: 'sent' as const })),
    ...MOCK.approvedReports.map(r => ({ ...r, _status: 'sent' as const, submittedAt: r.sentAt })),
  ];
  const [selectedId, setSelectedId] = useState(params?.reportId || all[0]?.id);
  const [filter, setFilter] = useState<'all' | 'thisWeek'>('all');

  useEffect(() => { if (params?.reportId) setSelectedId(params.reportId); }, [params?.reportId]);

  const filtered = filter === 'thisWeek'
    ? all.filter(r => /h ago|Yesterday/.test(r.submittedAt || ''))
    : all;
  const selected = all.find(r => r.id === selectedId) || filtered[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Reports" subtitle={`${all.length} reports sent to families`}/>
      <div style={{ display: 'flex', gap: 0, padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        {/* List */}
        <div style={{
          width: 380, flexShrink: 0,
          background: D.panel, borderRadius: '14px 0 0 14px',
          borderRight: `1px solid ${D.borderSoft}`,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          <div style={{ padding: '14px 16px 10px', display: 'flex', gap: 4 }}>
            {([
              { id: 'all' as const, label: `All · ${all.length}` },
              { id: 'thisWeek' as const, label: 'This week' },
            ]).map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                background: filter === f.id ? D.blueWash : 'transparent',
                color: filter === f.id ? D.blueDeep : D.textMute,
                border: 0, padding: '6px 12px', borderRadius: 8,
                fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(r => {
              const active = r.id === selectedId;
              const tutorInitials = r.tutor ? r.tutor.split(' ').map((w: string) => w[0]).join('') : (r.tutorInitials || 'TC');
              return (
                <button key={r.id} onClick={() => setSelectedId(r.id)} style={{
                  display: 'flex', width: '100%', textAlign: 'left',
                  gap: 12, padding: '14px 18px',
                  borderLeft: active ? `3px solid ${D.blue}` : '3px solid transparent',
                  background: active ? D.blueWash : 'transparent',
                  border: 0, cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: `1px solid ${D.borderSoft}`, alignItems: 'flex-start',
                }}>
                  <DAvatar initials={tutorInitials} size={36}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.student}</div>
                      <div style={{ fontSize: 11, color: D.textFaint, fontWeight: 600, flexShrink: 0 }}>{r.submittedAt || r.sentAt}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 600, marginBottom: 6 }}>{r.subject}</div>
                    <div style={{ fontSize: 12, color: D.textMute, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.summary}
                    </div>
                    <div style={{ marginTop: 8 }}><DPill tone="green">Sent</DPill></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div style={{
          flex: 1, minWidth: 0,
          background: D.panel, borderRadius: '0 14px 14px 0',
          overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {!selected ? (
            <div style={{ padding: 48, color: D.textFaint, textAlign: 'center' }}>Select a report.</div>
          ) : (
            <div style={{ padding: '28px 36px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 700, letterSpacing: 0.4 }}>SESSION REPORT</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6, marginTop: 4 }}>
                    {selected.student} · {selected.subject}
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12.5, color: D.textMute, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <DAvatar initials={(selected.tutor || 'MC').split(' ').map((w: string) => w[0]).join('')} size={20}/>
                      {selected.tutor || 'Maya Chen'}
                    </span>
                    <span>·</span>
                    <span>{selected.sessionDate || selected.sentAt}</span>
                    {selected.duration && <><span>·</span><span>{selected.duration}</span></>}
                  </div>
                </div>
                <DPill tone="green">✓ Sent to parent</DPill>
              </div>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <ReportSection label="Summary">{selected.summary}</ReportSection>
                {selected.strengths && <ReportSection label="Strengths">{selected.strengths}</ReportSection>}
                {selected.growth && <ReportSection label="Growth areas">{selected.growth}</ReportSection>}
                {selected.homework && <ReportSection label="Homework">{selected.homework}</ReportSection>}
                {selected.next && <ReportSection label="Next session">{selected.next}</ReportSection>}
                {selected.knack && (
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' }}>Knack attached</div>
                    <KnackBadge knackId={selected.knack} knacks={MOCK.knacks}/>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
