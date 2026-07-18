'use client';

import { useState, useTransition } from 'react';
import type { DayData } from '@/app/actions/availability';
import { saveAvailability, getAvailability } from '@/app/actions/availability';
import DayDetail from './DayDetail';

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getCalendarWeeks(year: number, month: number): (string | null)[][] {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = firstDay.getDay();

  const days: (string | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(toDateString(year, month, d));
  }
  while (days.length % 7 !== 0) days.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function getWeekContaining(dateStr: string): (string | null)[] {
  const d = new Date(dateStr + 'T00:00:00');
  const dow = d.getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() - dow + i);
    return day.toISOString().split('T')[0];
  });
}

interface Props {
  initialData: DayData[];
  initialYear: number;
  initialMonth: number;
}

function getWeekRangeLabel(weekDays: (string | null)[]): string {
  const valid = weekDays.filter(Boolean) as string[];
  if (valid.length === 0) return '';
  const first = new Date(valid[0] + 'T00:00:00');
  const last = new Date(valid[valid.length - 1] + 'T00:00:00');
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(first)} – ${fmt(last)}, ${last.getFullYear()}`;
}

export default function AvailabilityCalendar({ initialData, initialYear, initialMonth }: Props) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekAnchorDate, setWeekAnchorDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [availability, setAvailability] = useState<Record<string, DayData>>(() => {
    const map: Record<string, DayData> = {};
    for (const d of initialData) map[d.date] = d;
    return map;
  });
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];

  const totalHours = Object.values(availability).reduce((sum, d) => sum + d.hours.length, 0);
  const openDays = Object.values(availability).filter(d => !d.isBusy && d.hours.length > 0).length;
  const busyCount = Object.values(availability).filter(d => d.isBusy).length;

  const weeks = getCalendarWeeks(year, month);
  const weekDays = getWeekContaining(weekAnchorDate);
  const displayRows: (string | null)[][] = viewMode === 'month' ? weeks : [weekDays];
  const headerLabel = viewMode === 'week'
    ? getWeekRangeLabel(weekDays)
    : `${MONTH_NAMES[month - 1]} ${year}`;

  function fetchMonth(newYear: number, newMonth: number) {
    startTransition(async () => {
      const data = await getAvailability(newYear, newMonth);
      setAvailability(prev => {
        const next = { ...prev };
        for (const row of data) next[row.date] = row;
        return next;
      });
    });
  }

  function navigateMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    const newYear = d.getFullYear();
    const newMonth = d.getMonth() + 1;
    setYear(newYear);
    setMonth(newMonth);
    fetchMonth(newYear, newMonth);
  }

  function navigateWeek(delta: number) {
    const d = new Date(weekAnchorDate + 'T00:00:00');
    d.setDate(d.getDate() + delta * 7);
    const newAnchor = d.toISOString().split('T')[0];
    setWeekAnchorDate(newAnchor);

    const newYear = d.getFullYear();
    const newMonth = d.getMonth() + 1;
    if (newYear !== year || newMonth !== month) {
      setYear(newYear);
      setMonth(newMonth);
      fetchMonth(newYear, newMonth);
    }
  }

  function updateDay(date: string, updates: Partial<DayData>) {
    setAvailability(prev => {
      const existing = prev[date] ?? { date, isBusy: false, hours: [] as number[] };
      return { ...prev, [date]: { ...existing, ...updates } };
    });
    setDirty(prev => new Set(prev).add(date));
  }

  function handleToggleHour(date: string, hour: number) {
    const day = availability[date] ?? { date, isBusy: false, hours: [] };
    const hours = day.hours.includes(hour)
      ? day.hours.filter(h => h !== hour)
      : [...day.hours, hour].sort((a, b) => a - b);
    updateDay(date, { hours, isBusy: false });
  }

  function handleClear(date: string) {
    updateDay(date, { hours: [], isBusy: false });
  }

  function handleMarkBusy(date: string) {
    updateDay(date, { hours: [], isBusy: true });
  }

  function handleCopyFromLastWeek() {
    if (!selectedDate) return;
    const prev = new Date(selectedDate + 'T00:00:00');
    prev.setDate(prev.getDate() - 7);
    const prevStr = prev.toISOString().split('T')[0];
    const prevDay = availability[prevStr];
    if (prevDay) {
      updateDay(selectedDate, { hours: [...prevDay.hours], isBusy: prevDay.isBusy });
    }
  }

  function handleSave() {
    const toSave = [...dirty].map(
      date => availability[date] ?? { date, isBusy: false, hours: [] }
    );
    startTransition(async () => {
      await saveAvailability(toSave);
      setDirty(new Set());
    });
  }

  const selectedDay = selectedDate
    ? (availability[selectedDate] ?? { date: selectedDate, isBusy: false, hours: [] })
    : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Your availability</h1>
          <p className="text-sm text-brand-muted mt-1">Tap a day to set or clear your hours</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyFromLastWeek}
            disabled={!selectedDate || isPending}
            className="px-4 py-2 text-sm font-medium text-brand-muted border border-brand-border rounded-lg hover:bg-brand-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Copy from last week
          </button>
          <button
            onClick={handleSave}
            disabled={dirty.size === 0 || isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Calendar */}
        <div className="flex-1 bg-white border border-brand-border rounded-xl overflow-hidden">
          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
                disabled={isPending}
                className="p-1 rounded hover:bg-brand-card transition-colors disabled:opacity-40"
                aria-label={viewMode === 'week' ? 'Previous week' : 'Previous month'}
              >
                <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-semibold text-brand-text min-w-48 text-center">
                {headerLabel}
              </span>
              <button
                onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
                disabled={isPending}
                className="p-1 rounded hover:bg-brand-card transition-colors disabled:opacity-40"
                aria-label={viewMode === 'week' ? 'Next week' : 'Next month'}
              >
                <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex rounded-lg border border-brand-border overflow-hidden text-sm">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-muted hover:bg-brand-card'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-muted hover:bg-brand-card'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Day name headers */}
          <div className="grid grid-cols-7 border-b border-brand-border">
            {DAY_NAMES.map(name => (
              <div key={name} className="py-2 text-center text-xs font-semibold text-brand-muted uppercase tracking-wide">
                {name}
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          {displayRows.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-brand-border last:border-b-0">
              {week.map((date, di) => {
                if (!date) {
                  return (
                    <div
                      key={di}
                      className={`h-20 border-r border-brand-border last:border-r-0 ${
                        viewMode === 'week' ? 'h-28' : 'h-20'
                      }`}
                    />
                  );
                }

                const day = availability[date];
                const isSelected = date === selectedDate;
                const isBusy = day?.isBusy ?? false;
                const hours = day?.hours ?? [];
                const isToday = date === today;
                const dayNum = parseInt(date.split('-')[2], 10);

                let cellBg = '';
                let numColor = 'text-brand-text';
                if (isSelected) {
                  cellBg = 'bg-brand-primary';
                  numColor = 'text-white';
                } else if (isBusy) {
                  cellBg = 'bg-rose-50';
                } else if (hours.length > 0) {
                  cellBg = 'bg-brand-card';
                }

                return (
                  <button
                    key={di}
                    onClick={() => {
                      setSelectedDate(date);
                      if (viewMode === 'week') setWeekAnchorDate(date);
                    }}
                    className={`${viewMode === 'week' ? 'h-28' : 'h-20'} p-2 border-r border-brand-border last:border-r-0 text-left relative hover:brightness-95 transition-all ${cellBg}`}
                  >
                    <span className={`text-sm font-medium ${numColor} ${isToday && !isSelected ? 'font-bold underline' : ''}`}>
                      {dayNum}
                    </span>
                    {isBusy && (
                      <span className="absolute bottom-2 left-2 text-xs font-medium text-rose-500">Busy</span>
                    )}
                    {!isBusy && hours.length > 0 && (
                      <span className={`absolute bottom-2 left-2 text-xs font-semibold ${isSelected ? 'text-white' : 'text-brand-primary'}`}>
                        {hours.length}h
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          {/* Stats */}
          <div className="bg-white border border-brand-border rounded-xl p-4 flex gap-2">
            <div className="flex-1 text-center">
              <p className="text-3xl font-bold text-brand-text">{totalHours}</p>
              <p className="text-xs text-brand-muted mt-1">hours</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-3xl font-bold text-emerald-500">{openDays}</p>
              <p className="text-xs text-brand-muted mt-1">open days</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-3xl font-bold text-rose-400">{busyCount}</p>
              <p className="text-xs text-brand-muted mt-1">busy</p>
            </div>
          </div>

          {/* Day detail */}
          {selectedDay && (
            <DayDetail
              dayData={selectedDay}
              onToggleHour={(hour) => handleToggleHour(selectedDay.date, hour)}
              onClear={() => handleClear(selectedDay.date)}
              onMarkBusy={() => handleMarkBusy(selectedDay.date)}
            />
          )}

          {/* Info blurb */}
          <div className="bg-brand-card rounded-xl p-4">
            <p className="text-xs text-brand-muted leading-relaxed">
              ✦ Jordan auto-fills student schedules from the hours you set here. The more specific, the better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
