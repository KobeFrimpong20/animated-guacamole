'use client';
import React, { useState } from 'react';
import { D, MOCK, MONTH_META, GoFn } from './data';
import { Icon } from './icons';
import { DAvatar, DPill, DCard, DBtn, DPageHeader, DEmpty, FormField, FormInput, FormSelect } from './ui';
import { DirectorMessages } from './director-more';

// ── Tutor: Home ───────────────────────────────────────────────────────────

export function TutorHomeD({ go }: { go: GoFn }) {
  const today = MOCK.schedule.find(d => d.date === 19) || MOCK.schedule[0];
  const reportItems = [
    ...MOCK.pendingReports.map(r => ({ student: r.student, subject: r.subject, when: r.submittedAt!, status: 'pending' as const })),
    ...MOCK.approvedReports.map(r => ({ student: r.student, subject: r.subject, when: r.sentAt!, status: 'approved' as const })),
  ];

  return (
    <div>
      <DPageHeader
        title="Good afternoon, Maya"
        subtitle="Wednesday, May 20"
        right={<>
          <DBtn variant="soft" onClick={() => go('tutor-calendar')}>Set availability</DBtn>
          <DBtn icon={<Icon.plus width={16} height={16}/>} onClick={() => go('tutor-compose')}>New report</DBtn>
        </>}
      />
      <div style={{ padding: '0 36px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Sessions this week',       value: 5, delta: '2 today' },
            { label: 'Reports awaiting review',  value: 2, delta: 'Sent in last 24h' },
            { label: 'Active students',          value: 4, delta: 'Across 3 subjects' },
            { label: 'Hours set',               value: 18, delta: 'May 2026' },
          ].map(k => (
            <DCard key={k.label} style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: D.textMute, letterSpacing: 0.2 }}>{k.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: D.text, letterSpacing: -1, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
              <div style={{ fontSize: 12, color: D.textMute, marginTop: 8 }}>{k.delta}</div>
            </DCard>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, alignItems: 'start' }}>
          {/* Today's sessions */}
          <DCard padded={false}>
            <div style={{ padding: '18px 22px 12px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Today&apos;s sessions</div>
              <div style={{ fontSize: 12.5, color: D.textMute, marginTop: 2 }}>{today.sessions.length} scheduled</div>
            </div>
            {today.sessions.length === 0 ? (
              <div style={{ padding: '0 22px 22px' }}><DEmpty>No sessions today</DEmpty></div>
            ) : today.sessions.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 22px', borderTop: `1px solid ${D.borderSoft}`, alignItems: 'center' }}>
                <div style={{ width: 56, fontSize: 14, fontWeight: 800, color: D.blueDeep, fontVariantNumeric: 'tabular-nums' }}>{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{s.student}</div>
                  <div style={{ fontSize: 12, color: D.textMute }}>60 minutes · Algebra I</div>
                </div>
                <DBtn variant="soft" small icon={<Icon.book width={14} height={14}/>} onClick={() => go('tutor-compose')}>Write report</DBtn>
              </div>
            ))}
          </DCard>

          {/* Recent reports */}
          <DCard padded={false}>
            <div style={{ padding: '18px 22px 12px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: D.text, letterSpacing: -0.3 }}>Recent reports</div>
              <div style={{ fontSize: 12.5, color: D.textMute, marginTop: 2 }}>Sent in the last week</div>
            </div>
            {reportItems.map((r, i) => (
              <div key={i} style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${D.borderSoft}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: D.text }}>{r.student}</div>
                  <div style={{ fontSize: 11.5, color: D.textMute }}>{r.subject} · {r.when}</div>
                </div>
                {r.status === 'pending' ? <DPill tone="amber">Pending</DPill> : <DPill tone="green">Approved</DPill>}
              </div>
            ))}
          </DCard>
        </div>
      </div>
    </div>
  );
}

// ── Tutor: Reports (master-detail) ────────────────────────────────────────

export function TutorReportsD({ go }: { go: GoFn }) {
  const all = [
    ...MOCK.pendingReports.map(r => ({ ...r, _status: 'pending' as const })),
    ...MOCK.approvedReports.map(r => ({ ...r, _status: 'approved' as const })),
  ];
  const [selectedId, setSelectedId] = useState(all[0]?.id);
  const selected = all.find(r => r.id === selectedId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Your reports" subtitle={`${MOCK.pendingReports.length} pending · ${MOCK.approvedReports.length} approved`}
        right={<DBtn icon={<Icon.plus width={16} height={16}/>} onClick={() => go('tutor-compose')}>New report</DBtn>}/>
      <div style={{ display: 'flex', padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        <div style={{
          width: 360, flexShrink: 0,
          background: D.panel, borderRadius: '14px 0 0 14px',
          borderRight: `1px solid ${D.borderSoft}`, overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {all.map(r => {
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{r.student}</div>
                    <div style={{ fontSize: 11, color: D.textFaint, fontWeight: 600 }}>{r.submittedAt || r.sentAt}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 600, marginBottom: 6 }}>{r.subject}</div>
                  <div style={{ fontSize: 12, color: D.textMute, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.summary}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {r._status === 'pending' ? <DPill tone="amber">In review</DPill> : <DPill tone="green">Approved</DPill>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{
          flex: 1, minWidth: 0,
          background: D.panel, borderRadius: '0 14px 14px 0', overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {selected && (
            <div style={{ padding: '28px 36px 40px' }}>
              <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 700, letterSpacing: 0.4 }}>{selected._status.toUpperCase()}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6, marginTop: 4 }}>{selected.student} · {selected.subject}</div>
              <div style={{ fontSize: 13, color: D.textMute, marginTop: 8 }}>{selected.sessionDate || selected.sentAt}{selected.duration ? ` · ${selected.duration}` : ''}</div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {([
                  ['Summary', selected.summary],
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tutor: Calendar (availability) ───────────────────────────────────────

export function TutorCalendarD({ go: _go }: { go: GoFn }) {
  const { name, daysInMonth, firstDow, today } = MONTH_META;
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [hours, setHours] = useState<Record<number, number>>({
    5: 3, 6: 4, 12: 5, 13: 4, 14: 2, 19: 3, 20: 4, 21: 2, 22: 3, 26: 3, 27: 4, 28: 2,
  });
  const [busy, setBusy] = useState<Record<number, boolean>>({ 16: true, 17: true });
  const [selectedDay, setSelectedDay] = useState(today);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const totalHours = Object.values(hours).reduce((a, b) => a + b, 0);
  const availDays = Object.keys(hours).length;
  const busyDays = Object.keys(busy).length;

  return (
    <div>
      <DPageHeader title="Your availability" subtitle="Tap a day to set or clear your hours"
        right={<>
          <DBtn variant="soft">Copy from last week</DBtn>
          <DBtn>Save</DBtn>
        </>}
      />
      <div style={{ padding: '0 36px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, alignItems: 'start' }}>
        <DCard padded={false}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${D.borderSoft}` }}>
            {dows.map(d => <div key={d} style={{ padding: '14px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: D.textMute, letterSpacing: 0.5 }}>{d.toUpperCase()}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((d, i) => {
              const row = Math.floor(i / 7), col = i % 7;
              const isToday = d === today, isSelected = d === selectedDay;
              const h = d ? (hours[d] || 0) : 0;
              const isBusy = d != null && !!busy[d];
              const bg = isBusy ? 'rgba(239,68,68,0.08)'
                : isSelected ? D.blue
                : h >= 5 ? '#bcd2ff'
                : h > 0 ? D.blueWash
                : '#fff';
              const fg = isSelected ? '#fff' : isBusy ? D.red : h > 0 ? D.blueDeep : D.text;
              return (
                <button key={i} disabled={d == null} onClick={() => d && setSelectedDay(d)} style={{
                  minHeight: 100, padding: 12, border: 0,
                  borderTop: row ? `1px solid ${D.borderSoft}` : 0,
                  borderLeft: col ? `1px solid ${D.borderSoft}` : 0,
                  background: bg, color: fg,
                  cursor: d ? 'pointer' : 'default',
                  fontFamily: 'inherit', textAlign: 'left',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  opacity: d ? 1 : 0.4,
                  outline: isToday && !isSelected ? `2px solid ${D.blueDeep}` : 'none',
                  outlineOffset: -2,
                }}>
                  {d != null && <>
                    <div style={{ fontSize: 14, fontWeight: isToday || isSelected ? 800 : 600, fontVariantNumeric: 'tabular-nums' }}>{d}</div>
                    {isBusy ? <div style={{ fontSize: 10.5, fontWeight: 700 }}>Busy</div>
                      : h > 0 ? <div style={{ fontSize: 11, fontWeight: 700 }}>{h}h</div> : null}
                  </>}
                </button>
              );
            })}
          </div>
        </DCard>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <DCard style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: D.blue, letterSpacing: -0.6, lineHeight: 1 }}>{totalHours}</div>
              <div style={{ fontSize: 11, color: D.textMute, fontWeight: 600, marginTop: 4 }}>hours</div>
            </DCard>
            <DCard style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: D.green, letterSpacing: -0.6, lineHeight: 1 }}>{availDays}</div>
              <div style={{ fontSize: 11, color: D.textMute, fontWeight: 600, marginTop: 4 }}>open days</div>
            </DCard>
            <DCard style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: D.red, letterSpacing: -0.6, lineHeight: 1 }}>{busyDays}</div>
              <div style={{ fontSize: 11, color: D.textMute, fontWeight: 600, marginTop: 4 }}>busy</div>
            </DCard>
          </div>

          <DCard>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4, marginBottom: 12, textTransform: 'uppercase' }}>
              {name} {selectedDay}
            </div>
            <div style={{ fontSize: 13.5, color: D.text, marginBottom: 14 }}>
              {busy[selectedDay] ? 'Marked busy. Tap an hour to make available.'
                : hours[selectedDay] ? `${hours[selectedDay]} hours available.` : 'No hours set. Pick a time window:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[15, 16, 17, 18, 19, 20].map(h => {
                const on = (hours[selectedDay] || 0) > 0;
                return (
                  <button key={h} onClick={() => setHours(prev => ({ ...prev, [selectedDay]: Math.min((prev[selectedDay] || 0) + 1, 6) }))} style={{
                    padding: '7px 12px', borderRadius: 8, border: 0,
                    background: on ? D.blue : D.panelSoft,
                    color: on ? '#fff' : D.text,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{h > 12 ? `${h - 12}p` : `${h}a`}</button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <DBtn variant="ghost" small onClick={() => setHours(p => { const n = { ...p }; delete n[selectedDay]; return n; })}>Clear</DBtn>
              <DBtn variant="danger" small onClick={() => setBusy(p => ({ ...p, [selectedDay]: !p[selectedDay] }))}>{busy[selectedDay] ? 'Unmark busy' : 'Mark busy'}</DBtn>
            </div>
          </DCard>

          <DCard style={{ padding: '14px 16px', background: D.blueWash, color: D.blueDeep }}>
            <div style={{ display: 'flex', gap: 10, fontSize: 12.5, lineHeight: 1.5 }}>
              <Icon.sparkle width={16} height={16} style={{ flexShrink: 0, marginTop: 2 }}/>
              <div>Jordan auto-fills student schedules from the hours you set here. The more specific, the better.</div>
            </div>
          </DCard>
        </div>
      </div>
    </div>
  );
}

// ── Tutor: Inbox (reuses DirectorMessages) ────────────────────────────────

export function TutorInboxD({ go }: { go: GoFn }) {
  return <DirectorMessages go={go}/>;
}

// ── Tutor: Compose ────────────────────────────────────────────────────────

export function TutorComposeD({ go }: { go: GoFn }) {
  const [selectedKnack, setSelectedKnack] = useState<string | null>(null);

  return (
    <div>
      <DPageHeader
        title="New session report"
        subtitle="Walk through the session — Jordan will review before it reaches the parent."
        right={<>
          <DBtn variant="soft">Save draft</DBtn>
          <DBtn icon={<Icon.send width={14} height={14}/>} onClick={() => go('tutor-reports')}>Submit for review</DBtn>
        </>}
      />
      <div style={{ padding: '0 36px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, alignItems: 'start' }}>
        <DCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <FormField label="Student"><FormSelect options={MOCK.students.map(s => s.name)}/></FormField>
            <FormField label="Session date"><FormInput defaultValue="May 20, 2026"/></FormField>
            <FormField label="Subject"><FormSelect options={['Algebra I', 'Geometry', 'Pre-Algebra', 'Physics']}/></FormField>
            <FormField label="Duration"><FormSelect options={['30 min', '45 min', '60 min', '90 min']}/></FormField>
          </div>
          {[
            { label: 'Summary',      placeholder: 'What did you cover today? What did the student take away?' },
            { label: 'Strengths',    placeholder: 'What went well?' },
            { label: 'Growth areas', placeholder: 'Where are they stuck?' },
            { label: 'Homework',     placeholder: 'What did you assign?' },
            { label: 'Next session', placeholder: "What's the plan?" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <FormField label={f.label}>
                <textarea placeholder={f.placeholder} style={{
                  width: '100%', minHeight: 80, padding: 12,
                  border: `1px solid ${D.borderSoft}`, borderRadius: 10,
                  fontFamily: 'inherit', fontSize: 13.5, color: D.text, lineHeight: 1.5,
                  background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}/>
              </FormField>
            </div>
          ))}
        </DCard>

        {/* Knack sidebar */}
        <DCard>
          <div style={{ fontSize: 14, fontWeight: 800, color: D.text, marginBottom: 4 }}>Attach a knack</div>
          <div style={{ fontSize: 12.5, color: D.textMute, marginBottom: 14 }}>Did the student show a particular strength today? Pick one.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {MOCK.knacks.slice(0, 12).map(k => {
              const on = selectedKnack === k.id;
              return (
                <button key={k.id} onClick={() => setSelectedKnack(on ? null : k.id)} style={{
                  background: on ? D.blueWash : D.panelSoft,
                  border: on ? `1.5px solid ${D.blue}` : '1.5px solid transparent',
                  padding: '7px 12px 7px 7px',
                  borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 11,
                    background: on ? `linear-gradient(135deg, ${D.blue}, #4d8eff)` : D.borderSoft,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                  }}>{k.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: on ? D.blueDeep : D.text }}>{k.label}</span>
                </button>
              );
            })}
          </div>
          {selectedKnack && (() => {
            const k = MOCK.knacks.find(x => x.id === selectedKnack)!;
            return (
              <div style={{ marginTop: 14, padding: '12px 14px', background: D.blueWash, borderRadius: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22 }}>{k.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: D.text }}>{k.label}</div>
                    <div style={{ fontSize: 12, color: D.textMute, marginTop: 2 }}>{k.desc}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {k.careers.map(c => (
                        <span key={c} style={{ background: D.blueSoft, color: D.blueDeep, fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          <div style={{ marginTop: 12 }}>
            <button style={{ background: 'transparent', border: 0, color: D.blue, fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer', padding: 0 }}>
              See all {MOCK.knacks.length} knacks →
            </button>
          </div>
        </DCard>
      </div>
    </div>
  );
}
