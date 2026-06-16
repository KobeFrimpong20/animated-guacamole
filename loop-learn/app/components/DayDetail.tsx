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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">
        {displayDate}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{statusText}</p>

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
                  ? 'bg-blue-500 text-white'
                  : 'border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
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
          className="px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onMarkBusy}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            isBusy
              ? 'bg-red-500 text-white border-red-500'
              : 'text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-950'
          }`}
        >
          Mark busy
        </button>
      </div>
    </div>
  );
}
