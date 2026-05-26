// Design tokens — mirrors the "Sky" palette from the prototype.
export const D = {
  bg: '#f2f5fb',
  bgSoft: '#eef3fb',
  panel: '#ffffff',
  panelSoft: '#f5f8ff',
  text: '#0a1e3f',
  textMute: '#5b6b87',
  textFaint: '#94a3c1',
  blue: '#0066ff',
  blueDeep: '#0047b8',
  blueSoft: '#dbe7ff',
  blueWash: '#eaf1ff',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  border: '#e5edff',
  borderSoft: '#eef2fa',
  font: 'var(--font-plus-jakarta), -apple-system, system-ui, sans-serif',
  sidebarW: 232,
};

// ── Types ──────────────────────────────────────────────────────────────────

export type Role = 'tutor' | 'director' | 'parent';

export type Screen =
  | 'director-home' | 'director-reports' | 'director-schedule'
  | 'director-students' | 'director-messages'
  | 'tutor-home' | 'tutor-reports' | 'tutor-calendar'
  | 'tutor-inbox' | 'tutor-compose'
  | 'parent-home' | 'parent-reports' | 'parent-student'
  | 'parent-messages' | 'parent-request';

export interface NavParams {
  reportId?: string;
  studentId?: string;
}

export type GoFn = (screen: Screen, params?: NavParams) => void;

export interface Student {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  parent: string;
  goal: string;
  avatar: string;
}

export interface Report {
  id: string;
  tutor?: string;
  tutorInitials?: string;
  student: string;
  subject: string;
  submittedAt?: string;
  sentAt?: string;
  duration?: string;
  sessionDate?: string;
  summary?: string;
  strengths?: string;
  growth?: string;
  homework?: string;
  next?: string;
  highlight?: string;
  knack?: string;
  _status?: 'sent' | 'pending' | 'approved';
}

export interface Session {
  time: string;
  student: string;
  tutor: string;
}

export interface ScheduleDay {
  day: string;
  date: number;
  sessions: Session[];
}

export interface Knack {
  id: string;
  cat: string;
  label: string;
  emoji: string;
  tag: string;
  desc: string;
  careers: string[];
}

export interface KnackCategory {
  id: string;
  label: string;
  sub: string;
}

export interface Message {
  from: 'me' | 'them';
  name?: string;
  when: string;
  text: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const MOCK = {
  tutor: { name: 'Maya Chen', initials: 'MC', subject: 'Math & Physics' },
  director: { name: 'Jordan Park', initials: 'JP', center: 'Northbridge Learning' },
  parent: { name: 'Elena Ruiz', initials: 'ER', studentName: 'Sofia Ruiz' },

  students: [
    { id: 's1', name: 'Sofia Ruiz',   grade: '8th Grade',  subjects: ['Algebra I', 'Physics'],  parent: 'Elena Ruiz', goal: 'Build confidence with word problems; prep for spring placement test.', avatar: '#0066ff' },
    { id: 's2', name: 'Marcus Lee',   grade: '10th Grade', subjects: ['Geometry'],              parent: 'Diana Lee',  goal: 'Improve proof-writing fluency.', avatar: '#ff6b35' },
    { id: 's3', name: 'Amelia Park',  grade: '6th Grade',  subjects: ['Pre-Algebra'],           parent: 'Sam Park',   goal: 'Master fractions and ratios before next semester.', avatar: '#22c55e' },
  ] as Student[],

  pendingReports: [
    {
      id: 'r1',
      tutor: 'Maya Chen', student: 'Sofia Ruiz', subject: 'Algebra I',
      submittedAt: '2h ago', duration: '60 min', sessionDate: 'May 18, 2026',
      summary: 'Worked through linear systems by substitution. Sofia caught the trick on problem 4 unprompted — big confidence win.',
      strengths: 'Strong intuition for isolating variables. Asked clarifying questions when stuck instead of guessing.',
      growth: 'Word problems still slow her down. Translating from English to equations needs more reps.',
      homework: 'Khan Academy systems set 3–4. One word problem per night.',
      next: 'Start with mixture problems; introduce elimination if substitution feels solid.',
      knack: 'debugger',
    },
    {
      id: 'r2',
      tutor: 'Maya Chen', student: 'Marcus Lee', subject: 'Geometry',
      submittedAt: 'Yesterday', duration: '45 min', sessionDate: 'May 17, 2026',
      summary: 'Two-column proofs. Marcus is starting to enjoy this — asked for harder problems.',
      strengths: 'Clean reasoning. Spots congruences quickly.',
      growth: 'Tends to skip justification steps. Slow him down.',
      homework: 'Practice set p.214 #1–8.',
      next: 'CPCTC and indirect proofs.',
      knack: 'pattern',
    },
  ] as Report[],

  approvedReports: [
    {
      id: 'a1', tutor: 'Maya Chen', tutorInitials: 'MC',
      student: 'Sofia Ruiz', subject: 'Algebra I', sentAt: 'May 11',
      summary: 'Reviewed last quiz. Sofia is gaining confidence on multi-step equations.',
      highlight: 'Self-corrected 3 mistakes without help.',
      knack: 'persistent',
    },
    {
      id: 'a2', tutor: 'Maya Chen', tutorInitials: 'MC',
      student: 'Sofia Ruiz', subject: 'Algebra I', sentAt: 'May 4',
      summary: 'Intro to linear systems. Substitution method went smoothly.',
      highlight: 'Stayed focused the full hour.',
    },
  ] as Report[],

  knackCategories: [
    { id: 'mind',    label: 'Mind',             sub: 'How they think & work' },
    { id: 'numbers', label: 'Numbers & Money',  sub: 'Math, data, finance' },
    { id: 'science', label: 'Science',          sub: 'Discovery & the natural world' },
    { id: 'lang',    label: 'Language & Law',   sub: 'Words, history, ideas' },
    { id: 'arts',    label: 'Arts',             sub: 'Visual, music, story' },
    { id: 'tech',    label: 'Making & Tech',    sub: 'Code, build, design systems' },
    { id: 'people',  label: 'People & Society', sub: 'Care, civics, connection' },
    { id: 'lead',    label: 'Leadership',       sub: 'Strategy, ventures, influence' },
  ] as KnackCategory[],

  knacks: [
    // MIND
    { id: 'debugger',    cat: 'mind',    label: 'Debugger',            emoji: '🔍', tag: 'Catches their own mistakes',     desc: 'Spots errors, isolates variables, asks clarifying questions when stuck.',         careers: ['Software engineer', 'Research scientist', 'Forensic analyst'] },
    { id: 'quick-study', cat: 'mind',    label: 'Quick Study',         emoji: '⚡', tag: 'Picks up new ideas fast',         desc: 'Grasps new concepts after one or two passes — minimal scaffolding needed.',       careers: ['Journalist', 'ER doctor', 'Diplomat'] },
    { id: 'persistent',  cat: 'mind',    label: 'Persistent',          emoji: '🌱', tag: 'Pushes through tough problems',   desc: "Stays with hard problems past the frustration point. Doesn't bail.",             careers: ['Research scientist', 'Filmmaker', 'Surgeon'] },
    { id: 'pattern',     cat: 'mind',    label: 'Pattern Spotter',     emoji: '🧩', tag: 'Sees connections others miss',    desc: 'Notices structure and recurring shapes across different problems.',                careers: ['Data scientist', 'Composer', 'Epidemiologist'] },
    { id: 'focus',       cat: 'mind',    label: 'Focused',             emoji: '🎯', tag: 'Deep work, no drift',            desc: 'Stays in flow through long stretches without losing the thread.',                  careers: ['Software engineer', 'Novelist', 'Surgeon'] },
    { id: 'voice',       cat: 'mind',    label: 'Communicator',        emoji: '🗣️', tag: 'Explains thinking clearly',      desc: 'Walks through their reasoning out loud — a strong sign of real understanding.',   careers: ['Trial lawyer', 'Teacher', 'Podcast host'] },
    { id: 'big-picture', cat: 'mind',    label: 'Big-picture Thinker', emoji: '🌌', tag: 'Sees the whole, not just parts', desc: "Connects today's problem to the larger concept or to other subjects.",            careers: ['Architect', 'Game designer', 'Strategy consultant'] },
    { id: 'curious',     cat: 'mind',    label: 'Curious',             emoji: '❓', tag: 'Asks "why" instinctively',        desc: 'Pushes past "what" into "why" — the curiosity that drives long-term learning.',   careers: ['Research scientist', 'Documentary filmmaker', 'Anthropologist'] },
    // NUMBERS & MONEY
    { id: 'financier',   cat: 'numbers', label: 'Financier',           emoji: '💰', tag: 'Reads money & markets',          desc: 'Drawn to economic puzzles — how value moves, why prices change, where risk hides.', careers: ['Investment analyst', 'Economist', 'Actuary'] },
    { id: 'statistician',cat: 'numbers', label: 'Statistician',        emoji: '📊', tag: 'Thinks in probabilities',         desc: 'Comfortable with uncertainty. Asks "out of how many?" instinctively.',             careers: ['Data scientist', 'Epidemiologist', 'Sports analyst'] },
    { id: 'geometer',    cat: 'numbers', label: 'Geometer',            emoji: '📐', tag: 'Strong spatial reasoning',        desc: 'Sees shapes, distances, and 3D structure in their head.',                          careers: ['Architect', 'Mechanical engineer', '3D animator'] },
    { id: 'theorist',    cat: 'numbers', label: 'Theorist',            emoji: '♾️', tag: 'Loves the abstract',             desc: 'Drawn to pure math — proofs, structures, things that are true in every case.',    careers: ['Mathematician', 'Cryptographer', 'Theoretical physicist'] },
    // SCIENCE
    { id: 'experimenter',cat: 'science', label: 'Experimenter',        emoji: '🧪', tag: 'Designs and runs tests',          desc: "Forms hypotheses, isolates variables, learns from what didn't work.",             careers: ['Chemist', 'Pharmacologist', 'Materials scientist'] },
    { id: 'lab-mind',    cat: 'science', label: 'Lab Mind',            emoji: '🔬', tag: 'Precision & fine detail',         desc: 'Calm and careful with small things — measurements, slides, procedures.',            careers: ['Microbiologist', 'Surgeon', 'Diagnostician'] },
    { id: 'naturalist',  cat: 'science', label: 'Naturalist',          emoji: '🌿', tag: 'Reads living systems',            desc: 'Notices ecosystems, animals, plants — how living things behave and depend on each other.', careers: ['Ecologist', 'Veterinarian', 'Wildlife biologist'] },
    { id: 'physicist',   cat: 'science', label: 'Physicist',           emoji: '⚛️', tag: 'How the universe works',         desc: 'Asks "why does it move that way?" Drawn to forces, energy, and the very small or very large.', careers: ['Physicist', 'Astronomer', 'Aerospace engineer'] },
    // LANGUAGE & LAW
    { id: 'counsel',     cat: 'lang',    label: 'Counsel',             emoji: '⚖️', tag: 'Legal logic & advocacy',         desc: 'Builds arguments, weighs evidence, speaks up for others. The instinct to represent.', careers: ['Lawyer', 'School counselor', 'Mediator'] },
    { id: 'wordsmith',   cat: 'lang',    label: 'Wordsmith',           emoji: '✍️', tag: 'Writes with clarity',            desc: 'Finds the right word. Shapes a sentence until it reads exactly right.',             careers: ['Novelist', 'Journalist', 'Speechwriter'] },
    { id: 'linguist',    cat: 'lang',    label: 'Linguist',            emoji: '🌐', tag: 'Picks up languages',             desc: 'Hears patterns in language structure. Picks up new ones unusually fast.',           careers: ['Translator', 'Diplomat', 'Speech pathologist'] },
    { id: 'historian',   cat: 'lang',    label: 'Historian',           emoji: '🏛️', tag: 'Connects past to now',           desc: "Reads context — sees how today's events echo decades or centuries back.",          careers: ['Historian', 'Museum curator', 'Policy analyst'] },
    { id: 'philosopher', cat: 'lang',    label: 'Philosopher',         emoji: '🤔', tag: 'Wrestles with big questions',    desc: 'Comfortable sitting with ambiguity. Asks what we mean before answering.',           careers: ['Ethicist', 'Professor', 'Theologian'] },
    // ARTS
    { id: 'visual-eye',  cat: 'arts',    label: 'Visual Eye',          emoji: '🎨', tag: 'Composition & color',            desc: 'Notices what looks right, why a layout works, when something feels off.',           careers: ['Graphic designer', 'Art director', 'Illustrator'] },
    { id: 'performer',   cat: 'arts',    label: 'Performer',           emoji: '🎭', tag: 'Comfortable on stage',           desc: 'Lights up in front of an audience. Reads a room and adjusts in real time.',          careers: ['Actor', 'Public speaker', 'Broadcaster'] },
    { id: 'composer',    cat: 'arts',    label: 'Composer',            emoji: '🎼', tag: 'Musical patterns',               desc: 'Hears structure in music — counterpoint, rhythm, harmony.',                       careers: ['Composer', 'Sound designer', 'Music producer'] },
    { id: 'storyteller', cat: 'arts',    label: 'Storyteller',         emoji: '📽️', tag: 'Knows what comes next',          desc: 'Instinct for narrative — how a story builds, where the turn comes, why it lands.',  careers: ['Filmmaker', 'Game designer', 'Screenwriter'] },
    // MAKING & TECH
    { id: 'programmer',  cat: 'tech',    label: 'Programmer',          emoji: '💻', tag: 'Comfort with code',              desc: 'Thinks in steps and conditions. Enjoys getting a machine to do what they want.',     careers: ['Software engineer', 'Game developer', 'Cybersecurity analyst'] },
    { id: 'engineer',    cat: 'tech',    label: 'Engineer',            emoji: '🔩', tag: 'Makes things work',              desc: 'Asks how a physical system is built — gears, circuits, structures.',               careers: ['Mechanical engineer', 'Roboticist', 'Aerospace engineer'] },
    { id: 'maker',       cat: 'tech',    label: 'Maker',               emoji: '🏗️', tag: 'Hands-on builder',               desc: 'Learns by doing — wood, fabric, electronics, prototypes that actually work.',      careers: ['Industrial designer', 'Carpenter', 'Architect'] },
    { id: 'systems',     cat: 'tech',    label: 'Systems Thinker',     emoji: '🛰️', tag: 'Sees how parts fit',             desc: 'Zooms out to the structure — the supply chain, the city, the protocol — and finds the lever.', careers: ['Systems engineer', 'Operations researcher', 'Urban planner'] },
    // PEOPLE & SOCIETY
    { id: 'empath',      cat: 'people',  label: 'Empath',              emoji: '❤️', tag: 'Reads how others feel',          desc: 'Tunes in to emotion under the words. Adjusts to make people comfortable.',           careers: ['Therapist', 'Social worker', 'Pediatrician'] },
    { id: 'healer',      cat: 'people',  label: 'Healer',              emoji: '🩺', tag: 'Drawn to care',                  desc: 'Wants to help people feel better. Comfortable around bodies, illness, and recovery.', careers: ['Doctor', 'Nurse', 'Physical therapist'] },
    { id: 'connector',   cat: 'people',  label: 'Connector',           emoji: '🤝', tag: 'Brings people together',         desc: 'Natural networker — remembers names, makes introductions, builds bridges.',           careers: ['Diplomat', 'Recruiter', 'Event producer'] },
    { id: 'mentor',      cat: 'people',  label: 'Mentor',              emoji: '🏫', tag: 'Teaches & supports',             desc: 'Patient with people learning. Breaks ideas down without ever talking down.',         careers: ['Teacher', 'Coach', 'Tutor'] },
    { id: 'civic',       cat: 'people',  label: 'Civic Mind',          emoji: '🗳️', tag: 'Cares how society works',        desc: 'Interested in policy, fairness, and how decisions get made for a group.',           careers: ['Public policy analyst', 'Politician', 'Investigative journalist'] },
    // LEADERSHIP
    { id: 'strategist',  cat: 'lead',    label: 'Strategist',          emoji: '💼', tag: 'Plans several moves ahead',      desc: 'Thinks in turns. Anticipates how a choice plays out two and three steps later.',     careers: ['Strategy consultant', 'Product manager', 'Military officer'] },
    { id: 'founder',     cat: 'lead',    label: 'Entrepreneur',        emoji: '🚀', tag: 'Sees opportunities',             desc: 'Notices gaps and acts. Comfortable starting something before anyone asks.',          careers: ['Startup founder', 'Investor', 'Business owner'] },
    { id: 'marketer',    cat: 'lead',    label: 'Marketer',            emoji: '📣', tag: 'Frames ideas for audiences',     desc: "Knows who they're talking to and what they'll respond to. Tells the story crisply.", careers: ['Marketing director', 'PR strategist', 'Brand designer'] },
  ] as Knack[],

  threads: {
    parentDirector: [
      { from: 'them', name: 'Jordan (Director)', when: 'Mon', text: "Hi Elena — Sofia's spring placement test is in 3 weeks. Want me to add a second weekly session?" },
      { from: 'me',   when: 'Mon', text: 'Yes please. Tues or Thurs work.' },
      { from: 'them', name: 'Jordan (Director)', when: 'Mon', text: "Booking Thursdays 4pm with Maya starting this week. You'll get a confirmation." },
      { from: 'me',   when: 'Tue', text: "Thanks! Also — Sofia mentioned she's a bit stuck on word problems. Worth flagging to Maya?" },
      { from: 'them', name: 'Jordan (Director)', when: 'Tue', text: "Already on her radar — see today's report when it comes through." },
    ] as Message[],
  },

  schedule: [
    { day: 'Mon', date: 19, sessions: [{ time: '4:00p', student: 'Sofia R.',  tutor: 'Maya C.' }] },
    { day: 'Tue', date: 20, sessions: [{ time: '3:30p', student: 'Amelia P.', tutor: 'Tariq B.' }, { time: '5:00p', student: 'Marcus L.', tutor: 'Maya C.' }] },
    { day: 'Wed', date: 21, sessions: [] },
    { day: 'Thu', date: 22, sessions: [{ time: '4:00p', student: 'Sofia R.',  tutor: 'Maya C.' }] },
    { day: 'Fri', date: 23, sessions: [{ time: '4:30p', student: 'Amelia P.', tutor: 'Tariq B.' }] },
  ] as ScheduleDay[],
};

// Month sessions for schedule views (director + tutor)
export const MONTH_SESSIONS: Record<number, Session[]> = (() => {
  const m: Record<number, Session[]> = {};
  for (const d of MOCK.schedule) m[d.date] = d.sessions;
  m[4]  = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[5]  = [{ time: '3:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }, { time: '5:00p', student: 'Marcus L.', tutor: 'Maya C.' }];
  m[7]  = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[8]  = [{ time: '4:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }];
  m[11] = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[12] = [{ time: '3:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }, { time: '5:00p', student: 'Marcus L.', tutor: 'Maya C.' }, { time: '6:30p', student: 'Jamie K.', tutor: 'Priya S.' }];
  m[13] = [{ time: '5:00p', student: 'Marcus L.',  tutor: 'Maya C.' }];
  m[14] = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[15] = [{ time: '4:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }];
  m[26] = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[27] = [{ time: '3:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }, { time: '5:00p', student: 'Marcus L.', tutor: 'Maya C.' }];
  m[28] = [{ time: '4:00p', student: 'Sofia R.',   tutor: 'Maya C.' }];
  m[29] = [{ time: '4:30p', student: 'Amelia P.',  tutor: 'Tariq B.' }];
  return m;
})();

export const MONTH_META = { name: 'May', year: 2026, daysInMonth: 31, firstDow: 5, today: 19 };
