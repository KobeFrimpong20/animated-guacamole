import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAvailability } from '@/app/actions/availability';
import AvailabilityCalendar from '@/app/components/AvailabilityCalendar';

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const initialData = await getAvailability(year, month);

  return (
    <div className="p-8">
      <AvailabilityCalendar
        initialData={initialData}
        initialYear={year}
        initialMonth={month}
      />
    </div>
  );
}
