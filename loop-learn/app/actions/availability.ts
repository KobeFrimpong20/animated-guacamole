'use server';

import { createClient } from '@/lib/supabase/server';

export type DayData = {
  date: string;
  isBusy: boolean;
  hours: number[];
};

export async function getAvailability(year: number, month: number): Promise<DayData[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('tutor_availability')
    .select('date, is_busy, available_hours')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('getAvailability error:', error);
    return [];
  }

  return (data ?? []).map(row => ({
    date: row.date as string,
    isBusy: row.is_busy as boolean,
    hours: (row.available_hours as number[]) ?? [],
  }));
}

export async function saveAvailability(days: DayData[]): Promise<{ error?: string }> {
  if (days.length === 0) return {};

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const rows = days.map(d => ({
    user_id: user.id,
    date: d.date,
    is_busy: d.isBusy,
    available_hours: d.hours,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('tutor_availability')
    .upsert(rows, { onConflict: 'user_id,date' });

  if (error) {
    console.error('saveAvailability error:', error);
    return { error: error.message };
  }

  return {};
}
