'use client';
import React, { useState, useEffect } from 'react';
import { D, MOCK, MONTH_SESSIONS, MONTH_META, GoFn, Session } from './data';
import { Icon } from './icons';
import { DAvatar, DPill, DCard, DBtn, DPageHeader, DSectionLabel, DEmpty } from './ui';

// ── Director: Schedule ────────────────────────────────────────────────────

export function DirectorSchedule({ go }: { go: GoFn }) {
  const [view, setView] = useState<'week' | 'month'>('week');
  return (
    <div>
      <DPageHeader
        title="Schedule"
        subtitle={view === 'week' ? 'Week of May 19, 2026' : 'May 2026'}
        right={<>
          <div style={{ background: D.panel, borderRadius: 10, padding: 3, display: 'flex', gap: 2, boxShadow: '0 1px 0 rgba(10,30,63,0.04)' }}>
            {(['week', 'month'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? D.blue : 'transparent',
                color: view === v ? '#fff' : D.textMute,
                border: 0, padding: '7px 18px', borderRadius: 8,
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
                textTransform: 'capitalize', cursor: 'pointer',
              }}>{v}</button>
            ))}
          </div>
          <DBtn variant="soft" icon={<Icon.sparkle width={14} height={14}/>}>Auto-fill</DBtn>
          <DBtn icon={<Icon.plus width={16} height={16}/>}>New session</DBtn>
        </>}
      />
      <div style={{ padding: '0 36px 40px' }}>
        {view === 'week' ? <ScheduleWeek/> : <ScheduleMonth/>}
      </div>
    </div>
  );
}

function ScheduleWeek() {
  const hours = [14, 15, 16, 17, 18, 19, 20];
  const days = MOCK.schedule;
  const ROW_H = 64;

  const parseTime = (t: string) => {
    const m = t.match(/(\d+):?(\d+)?([ap])/);
    if (!m) return null;
    let h = +m[1]; const min = +(m[2] || 0); const pm = m[3] === 'p';
    if (pm && h !== 12) h += 12;
    return h + min / 60;
  };

  const sessionsByDay = days.map(d => d.sessions.map(s => ({ ...s, _h: parseTime(s.time) })));

  return (
    <DCard padded={false}>
      {/* Day header */}
      <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', borderBottom: `1px solid ${D.borderSoft}` }}>
        <div/>
        {days.map(d => {
          const isToday = d.date === 19;
          return (
            <div key={d.day} style={{ padding: '16px 12px', textAlign: 'center', borderLeft: `1px solid ${D.borderSoft}` }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: isToday ? D.blue : D.textMute, letterSpacing: 0.6 }}>{d.day.toUpperCase()}</div>
              <div style={{
                marginTop: 4, fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
                color: isToday ? D.blue : D.text, fontVariantNumeric: 'tabular-nums',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 18,
                background: isToday ? D.blueWash : 'transparent',
              }}>{d.date}</div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)' }}>
        {hours.map((h, i) => (
          <React.Fragment key={h}>
            <div style={{ height: ROW_H, fontSize: 11, color: D.textFaint, fontWeight: 600, padding: '4px 8px 0', textAlign: 'right', borderTop: i ? `1px solid ${D.borderSoft}` : 0 }}>
              {h > 12 ? `${h - 12}p` : `${h}a`}
            </div>
            {days.map((_, di) => (
              <div key={di} style={{ height: ROW_H, borderLeft: `1px solid ${D.borderSoft}`, borderTop: i ? `1px solid ${D.borderSoft}` : 0, position: 'relative' }}/>
            ))}
          </React.Fragment>
        ))}

        {sessionsByDay.map((sessions, di) =>
          sessions.map((s, si) => {
            if (s._h == null) return null;
            const rowIdx = hours.findIndex(h => h === Math.floor(s._h!));
            if (rowIdx < 0) return null;
            const fractional = s._h - Math.floor(s._h);
            const top = rowIdx * ROW_H + fractional * ROW_H;
            const colWidth = `calc((100% - 64px) / 5)`;
            return (
              <div key={`${di}-${si}`} style={{
                position: 'absolute', top, height: ROW_H - 4,
                left: `calc(64px + ${di} * ${colWidth} + 4px)`,
                width: `calc(${colWidth} - 8px)`,
                background: D.blueWash, borderLeft: `3px solid ${D.blue}`,
                borderRadius: 8, padding: '6px 10px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: D.blueDeep, fontVariantNumeric: 'tabular-nums' }}>{s.time}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: D.text }}>{s.student}</div>
                <div style={{ fontSize: 11, color: D.textMute }}>{s.tutor}</div>
              </div>
            );
          })
        )}
      </div>
    </DCard>
  );
}

function ScheduleMonth() {
  const [selected, setSelected] = useState(MONTH_META.today);
  const { name, daysInMonth, firstDow, today } = MONTH_META;
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedSessions: Session[] = (selected != null && MONTH_SESSIONS[selected]) || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18, alignItems: 'start' }}>
      <DCard padded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${D.borderSoft}` }}>
          {dows.map(d => <div key={d} style={{ padding: '14px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: D.textMute, letterSpacing: 0.5 }}>{d.toUpperCase()}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((d, i) => {
            const row = Math.floor(i / 7), col = i % 7;
            const sessions: Session[] = d ? (MONTH_SESSIONS[d] || []) : [];
            const isToday = d === today, isSelected = d === selected;
            const n = sessions.length;
            const tier = n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : 3;
            const pillW = [0, 12, 22, 32][tier];
            const pillBg = isSelected ? 'rgba(255,255,255,0.95)' : tier === 1 ? '#bcd2ff' : tier === 2 ? D.blue : tier === 3 ? D.blueDeep : 'transparent';
            return (
              <button key={i} disabled={d == null} onClick={() => d && setSelected(d)} style={{
                minHeight: 100, padding: 10, border: 0,
                borderTop: row ? `1px solid ${D.borderSoft}` : 0,
                borderLeft: col ? `1px solid ${D.borderSoft}` : 0,
                background: isSelected ? D.blue : isToday ? D.blueWash : '#fff',
                color: isSelected ? '#fff' : isToday ? D.blueDeep : D.text,
                cursor: d ? 'pointer' : 'default',
                fontFamily: 'inherit', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 8,
                opacity: d ? 1 : 0.4,
              }}>
                {d != null && <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 14, fontWeight: isToday || isSelected ? 800 : 600, fontVariantNumeric: 'tabular-nums' }}>{d}</div>
                    {n > 0 && <div style={{ fontSize: 10.5, fontWeight: 700, color: isSelected ? 'rgba(255,255,255,0.85)' : D.textMute }}>{n}</div>}
                  </div>
                  {tier > 0 && <div style={{ width: pillW, height: 4, borderRadius: 2, background: pillBg }}/>}
                </>}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', borderTop: `1px solid ${D.borderSoft}` }}>
          {[
            { w: 12, c: '#bcd2ff', label: 'Light · 1 session' },
            { w: 22, c: D.blue,    label: 'Medium · 2–3' },
            { w: 32, c: D.blueDeep,label: 'Heavy · 4+' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: t.w, height: 4, borderRadius: 2, background: t.c }}/>
              <div style={{ fontSize: 11.5, color: D.textMute, fontWeight: 600 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </DCard>

      {/* Day detail panel */}
      <DCard padded={false}>
        <div style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${D.borderSoft}` }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: D.textMute, letterSpacing: 0.4 }}>{selected === today ? 'TODAY' : 'SELECTED DAY'}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: D.text, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: 4 }}>{name} {selected}</div>
          <div style={{ fontSize: 12.5, color: D.textMute, marginTop: 6 }}>
            {selectedSessions.length === 0 ? 'No sessions' : `${selectedSessions.length} ${selectedSessions.length === 1 ? 'session' : 'sessions'} scheduled`}
          </div>
        </div>
        <div>
          {selectedSessions.length === 0 ? (
            <div style={{ padding: 22 }}><DEmpty>Nothing scheduled this day</DEmpty></div>
          ) : selectedSessions.map((s, i) => (
            <div key={i} style={{ padding: '14px 22px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: `1px solid ${D.borderSoft}` }}>
              <div style={{ width: 56, fontSize: 13, fontWeight: 800, color: D.blueDeep, fontVariantNumeric: 'tabular-nums' }}>{s.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{s.student}</div>
                <div style={{ fontSize: 12, color: D.textMute }}>with {s.tutor}</div>
              </div>
            </div>
          ))}
        </div>
      </DCard>
    </div>
  );
}

// ── Director: Students (master-detail) ────────────────────────────────────

export function DirectorStudents({ go, params }: { go: GoFn; params?: { studentId?: string } }) {
  const [selectedId, setSelectedId] = useState(params?.studentId || MOCK.students[0].id);
  useEffect(() => { if (params?.studentId) setSelectedId(params.studentId); }, [params?.studentId]);
  const selected = MOCK.students.find(s => s.id === selectedId) || MOCK.students[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Students" subtitle={`${MOCK.students.length} active`}
        right={<DBtn icon={<Icon.plus width={16} height={16}/>}>Add student</DBtn>}/>
      <div style={{ display: 'flex', padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        {/* List */}
        <div style={{
          width: 340, flexShrink: 0,
          background: D.panel, borderRadius: '14px 0 0 14px',
          borderRight: `1px solid ${D.borderSoft}`, overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {MOCK.students.map(s => {
            const active = s.id === selectedId;
            return (
              <button key={s.id} onClick={() => setSelectedId(s.id)} style={{
                display: 'flex', width: '100%', textAlign: 'left',
                alignItems: 'center', gap: 12, padding: '14px 18px',
                borderLeft: active ? `3px solid ${D.blue}` : '3px solid transparent',
                background: active ? D.blueWash : 'transparent',
                borderBottom: `1px solid ${D.borderSoft}`,
                border: 0, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <DAvatar initials={s.name.split(' ').map(w => w[0]).join('')} color={s.avatar} size={40}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: D.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                    {s.grade} · {s.subjects.join(', ')}
                  </div>
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
          <StudentDetail student={selected} go={go}/>
        </div>
      </div>
    </div>
  );
}

export function StudentDetail({ student, go }: { student: typeof MOCK.students[0]; go: GoFn }) {
  const initials = student.name.split(' ').map(w => w[0]).join('');
  const firstName = student.name.split(' ')[0];
  const upcoming = MOCK.schedule.flatMap(d =>
    d.sessions
      .filter(s => s.student.startsWith(firstName))
      .map(s => ({ ...s, day: d.day, date: d.date }))
  );
  const reports = MOCK.approvedReports.filter(r => r.student === student.name);

  return (
    <div style={{ padding: '28px 36px 40px' }}>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <DAvatar initials={initials} color={student.avatar} size={72}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: D.text, letterSpacing: -0.6 }}>{student.name}</div>
          <div style={{ fontSize: 13.5, color: D.textMute, marginTop: 4 }}>{student.grade}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {student.subjects.map(s => <DPill key={s} tone="blue">{s}</DPill>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <DBtn variant="soft" small icon={<Icon.chat width={14} height={14}/>} onClick={() => go('director-messages')}>Message parent</DBtn>
          <DBtn variant="soft" small icon={<Icon.edit width={14} height={14}/>}>Edit</DBtn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { n: upcoming.length, label: 'upcoming sessions' },
          { n: reports.length, label: 'reports sent' },
          { n: student.subjects.length, label: 'subjects' },
        ].map((t, i) => (
          <div key={i} style={{ background: D.panelSoft, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: D.text, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{t.n}</div>
            <div style={{ fontSize: 12, color: D.textMute, fontWeight: 600, marginTop: 4 }}>{t.label}</div>
          </div>
        ))}
      </div>

      <DSectionLabel>Goal</DSectionLabel>
      <div style={{ background: D.panelSoft, borderRadius: 12, padding: 16, fontSize: 13.5, color: D.text, lineHeight: 1.55, marginBottom: 24 }}>{student.goal}</div>

      <DSectionLabel>Family</DSectionLabel>
      <div style={{ background: D.panelSoft, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <DAvatar initials={student.parent.split(' ').map(w => w[0]).join('')} color="#94a3c1" size={36}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{student.parent}</div>
          <div style={{ fontSize: 12, color: D.textMute }}>Parent</div>
        </div>
        <DBtn variant="soft" small icon={<Icon.chat width={14} height={14}/>} onClick={() => go('director-messages')}>Message</DBtn>
      </div>

      <DSectionLabel>Upcoming sessions</DSectionLabel>
      {upcoming.length === 0 ? <DEmpty>No sessions this week</DEmpty> : (
        <div style={{ background: D.panelSoft, borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          {upcoming.map((u, i) => (
            <div key={i} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, borderTop: i ? `1px solid ${D.borderSoft}` : 0 }}>
              <div style={{ width: 56, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: D.textMute, letterSpacing: 0.5 }}>{u.day.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: D.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{u.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: D.text }}>{u.time}</div>
                <div style={{ fontSize: 12, color: D.textMute }}>with {u.tutor}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DSectionLabel>Recent reports</DSectionLabel>
      {reports.length === 0 ? <DEmpty>No reports yet</DEmpty> : (
        <div style={{ background: D.panelSoft, borderRadius: 12, overflow: 'hidden' }}>
          {reports.map((r, i) => (
            <button key={r.id} onClick={() => go('director-reports', { reportId: r.id })} style={{
              display: 'flex', width: '100%', textAlign: 'left',
              alignItems: 'center', gap: 12, padding: '14px 16px',
              borderTop: i ? `1px solid ${D.borderSoft}` : 0,
              background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <DAvatar initials={r.tutorInitials || 'MC'} size={32}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text }}>{r.subject}</div>
                <div style={{ fontSize: 12, color: D.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.highlight}</div>
              </div>
              <div style={{ fontSize: 11.5, color: D.textFaint, fontWeight: 600 }}>{r.sentAt}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Director: Messages ────────────────────────────────────────────────────

const THREADS = [
  { id: 't1', name: 'Elena Ruiz',   sub: 'Parent · Sofia',  last: 'Thanks! Also — Sofia mentioned…',          when: 'Tue', initials: 'ER', unread: 0, color: '#7c3aed' },
  { id: 't2', name: 'Maya Chen',    sub: 'Tutor',           last: "Submitted Sofia's report for review",       when: '2h',  initials: 'MC', unread: 1, color: D.blue },
  { id: 't3', name: 'Diana Lee',    sub: 'Parent · Marcus', last: 'Can we move Thursday earlier?',            when: 'Mon', initials: 'DL', unread: 0, color: '#f59e0b' },
  { id: 't4', name: 'Tariq Banner', sub: 'Tutor',           last: 'Availability set for next week',           when: 'Mon', initials: 'TB', unread: 0, color: '#10b981' },
];

export function DirectorMessages({ go: _go }: { go: GoFn }) {
  const [selectedId, setSelectedId] = useState('t1');
  const selected = THREADS.find(t => t.id === selectedId)!;
  const messages = MOCK.threads.parentDirector;
  const [draft, setDraft] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DPageHeader title="Messages" subtitle="Conversations with parents and tutors"/>
      <div style={{ display: 'flex', padding: '0 36px 36px', flex: 1, minHeight: 0 }}>
        {/* Thread list */}
        <div style={{
          width: 320, flexShrink: 0,
          background: D.panel, borderRadius: '14px 0 0 14px',
          borderRight: `1px solid ${D.borderSoft}`, overflow: 'auto',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          {THREADS.map(t => {
            const active = t.id === selectedId;
            return (
              <button key={t.id} onClick={() => setSelectedId(t.id)} style={{
                display: 'flex', width: '100%', textAlign: 'left',
                alignItems: 'center', gap: 12, padding: '14px 18px',
                borderLeft: active ? `3px solid ${D.blue}` : '3px solid transparent',
                background: active ? D.blueWash : 'transparent',
                borderBottom: `1px solid ${D.borderSoft}`,
                border: 0, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <DAvatar initials={t.initials} color={t.color} size={40}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: D.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: D.textFaint, fontWeight: 600, flexShrink: 0 }}>{t.when}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: D.textMute, marginTop: 1 }}>{t.sub}</div>
                  <div style={{ fontSize: 12, color: D.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>{t.last}</div>
                </div>
                {t.unread > 0 && <div style={{ width: 8, height: 8, borderRadius: 4, background: D.blue, flexShrink: 0 }}/>}
              </button>
            );
          })}
        </div>

        {/* Chat panel */}
        <div style={{
          flex: 1, minWidth: 0,
          background: D.panel, borderRadius: '0 14px 14px 0',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 1px 0 rgba(10,30,63,0.03), 0 8px 24px rgba(10,30,63,0.04)',
        }}>
          <div style={{ padding: '20px 28px', borderBottom: `1px solid ${D.borderSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <DAvatar initials={selected.initials} color={selected.color} size={40}/>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: D.text }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: D.textMute }}>{selected.sub}</div>
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
            <textarea
              value={draft} onChange={e => setDraft(e.target.value)}
              placeholder={`Message ${selected.name.split(' ')[0]}…`}
              style={{
                flex: 1, minHeight: 40, maxHeight: 120,
                padding: '10px 14px', borderRadius: 12, border: 0,
                background: D.panelSoft, fontFamily: 'inherit', fontSize: 13.5,
                color: D.text, outline: 'none', resize: 'none', lineHeight: 1.4,
                boxSizing: 'border-box',
              }}/>
            <DBtn icon={<Icon.send width={14} height={14}/>}>Send</DBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
