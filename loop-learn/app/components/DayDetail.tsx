'use client';

import type { DayData } from '@/app/actions/availability';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am–8pm

function formatHour(h: number): string {
  if (h === 12) return '12p';
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

interface Props {
  dayData: DayData;
  onToggleHour: (hour: number) => void;
  onClear: () => void;
  onMarkBusy: () => void;
}

export default function DayDetail({ dayData, onToggleHour, onClear, onMarkBusy }: Props) {
  const { date, isBusy, hours } = dayData;

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  const statusText = isBusy
    ? 'Marked as busy'
    : hours.length > 0
    ? `${hours.length} hour${hours.length !== 1 ? 's' : ''} available`
    : 'No hours set';

  return (
    <div className="bg-white border border-brand-border rounded-xl p-4">
      <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-0.5">
        {displayDate}
      </p>
      <p className="text-sm text-brand-muted mb-4">{statusText}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {HOURS.map(hour => {
          const selected = hours.includes(hour);
          return (
            <button
              key={hour}
              onClick={() => onToggleHour(hour)}
              disabled={isBusy}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                selected
                  ? 'bg-brand-primary text-white'
                  : 'border border-brand-border text-brand-muted hover:bg-brand-card'
              }`}
            >
              {formatHour(hour)}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="px-4 py-1.5 text-sm font-medium text-brand-muted border border-brand-border rounded-lg hover:bg-brand-card transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onMarkBusy}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            isBusy
              ? 'bg-rose-500 text-white border-rose-500'
              : 'text-rose-500 border-rose-300 hover:bg-rose-50'
          }`}
        >
          Mark busy
        </button>
      </div>
    </div>
  );
}
