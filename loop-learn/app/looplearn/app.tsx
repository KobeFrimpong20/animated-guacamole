'use client';
import React, { useState } from 'react';
import { D, Role, Screen, NavParams } from './data';
import { NAV_BY_ROLE, Sidebar } from './sidebar';
import { DesktopLogin } from './login';
import { DirectorHome, DirectorReports } from './director';
import { DirectorSchedule, DirectorStudents, DirectorMessages } from './director-more';
import { TutorHomeD, TutorReportsD, TutorCalendarD, TutorInboxD, TutorComposeD } from './tutor';
import { ParentHomeD, ParentReportsD, ParentStudentD, ParentMessagesD, ParentRequestD } from './parent';

export function LoopLearnApp() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<Role>('director');
  const [screen, setScreen] = useState<Screen>('director-home');
  const [params, setParams] = useState<NavParams>({});

  const go = (s: Screen, p: NavParams = {}) => { setScreen(s); setParams(p); };

  if (!authed) {
    return (
      <DesktopLogin onEnter={r => {
        setRole(r);
        setScreen(NAV_BY_ROLE[r][0].id);
        setAuthed(true);
      }}/>
    );
  }

  let body: React.ReactNode;
  switch (screen) {
    case 'director-home':     body = <DirectorHome go={go}/>; break;
    case 'director-reports':  body = <DirectorReports go={go} params={params}/>; break;
    case 'director-schedule': body = <DirectorSchedule go={go}/>; break;
    case 'director-students': body = <DirectorStudents go={go} params={params}/>; break;
    case 'director-messages': body = <DirectorMessages go={go}/>; break;
    case 'tutor-home':        body = <TutorHomeD go={go}/>; break;
    case 'tutor-reports':     body = <TutorReportsD go={go}/>; break;
    case 'tutor-calendar':    body = <TutorCalendarD go={go}/>; break;
    case 'tutor-inbox':       body = <TutorInboxD go={go}/>; break;
    case 'tutor-compose':     body = <TutorComposeD go={go}/>; break;
    case 'parent-home':       body = <ParentHomeD go={go}/>; break;
    case 'parent-reports':    body = <ParentReportsD go={go} params={params}/>; break;
    case 'parent-student':    body = <ParentStudentD go={go}/>; break;
    case 'parent-messages':   body = <ParentMessagesD go={go}/>; break;
    case 'parent-request':    body = <ParentRequestD go={go}/>; break;
    default:                  body = <div style={{ padding: 40, color: D.textMute }}>Screen not found.</div>;
  }

  return (
    <div style={{
      height: '100%', display: 'flex',
      background: D.bg, fontFamily: D.font, color: D.text,
      overflow: 'hidden',
    }}>
      <Sidebar
        role={role}
        screen={screen}
        go={go}
        onSignOut={() => setAuthed(false)}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{body}</div>
    </div>
  );
}
