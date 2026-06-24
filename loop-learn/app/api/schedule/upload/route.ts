import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

interface ScheduleRow {
  date: string;
  time: string;
  tutor_email: string;
  parent_email: string;
  student_name: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const orgId = formData.get('orgId') as string | null;

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  if (!orgId) return NextResponse.json({ error: 'No organization specified' }, { status: 400 });

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('org_id', orgId)
    .single();

  if (!membership || membership.role !== 'director') {
    return NextResponse.json({ error: 'Only directors can import schedules' }, { status: 403 });
  }

  const csvText = await file.text();
  const { data: rows, errors: parseErrors } = Papa.parse<ScheduleRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parseErrors.length > 0) {
    return NextResponse.json({ error: 'CSV Parsing Error', details: parseErrors }, { status: 400 });
  }

  const results = {
    success: 0,
    skipped: 0,
    errors: [] as { row: number; error: string }[],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    try {
      const { data: tutor, error: tutorError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', row.tutor_email)
        .single();

      if (tutorError || !tutor) {
        results.errors.push({ row: rowNum, error: `Tutor with email ${row.tutor_email} not found` });
        continue;
      }

      const [month, day, year] = row.date.split('/');
      const timeStr = row.time.toUpperCase().trim();
      const isPM = timeStr.endsWith('PM');
      const [hoursPart, minutesPart] = timeStr.replace('AM', '').replace('PM', '').split(':').map(Number);

      let hours = hoursPart;
      const minutes = minutesPart;
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      const scheduled_start = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        minutes
      ).toISOString();

      let session_id: number;

      const { data: existingSession, error: sessionFetchError } = await supabase
        .from('sessions')
        .select('id')
        .eq('tutor_id', tutor.id)
        .eq('scheduled_start', scheduled_start)
        .eq('center_id', orgId)
        .maybeSingle();

      if (sessionFetchError) {
        results.errors.push({ row: rowNum, error: `Session lookup error: ${sessionFetchError.message}` });
        continue;
      }

      if (existingSession) {
        session_id = existingSession.id;
      } else {
        const { data: newSession, error: sessionCreateError } = await supabase
          .from('sessions')
          .insert({ tutor_id: tutor.id, center_id: orgId, scheduled_start })
          .select('id')
          .single();

        if (sessionCreateError) {
          results.errors.push({ row: rowNum, error: `Session creation failed: ${sessionCreateError.message}` });
          continue;
        }
        session_id = newSession.id;
      }

      const { data: parentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', row.parent_email)
        .maybeSingle();

      const baseStudentQuery = supabase
        .from('students')
        .select('id')
        .eq('name', row.student_name)
        .eq('center_id', orgId);

      const { data: existingStudent } = await (parentProfile?.id
        ? baseStudentQuery.eq('parent_id', parentProfile.id)
        : baseStudentQuery.is('parent_id', null)
      ).maybeSingle();

      let student_id: string;

      if (existingStudent) {
        student_id = existingStudent.id as string;
      } else {
        const { data: newStudent, error: studentCreateError } = await supabase
          .from('students')
          .insert({ name: row.student_name, parent_id: parentProfile?.id ?? null, center_id: orgId })
          .select('id')
          .single();

        if (studentCreateError || !newStudent) {
          results.errors.push({ row: rowNum, error: `Student creation failed: ${studentCreateError?.message}` });
          continue;
        }
        student_id = newStudent.id as string;
      }

      const { error: reportError } = await supabase
        .from('session_reports')
        .insert({
          session_id,
          center_id: orgId,
          student_id,
          session_summary: '',
          what_went_well: '',
          areas_for_growth: '',
          next_session_plan: '',
        });

      if (reportError) {
        if (reportError.code === '23505') {
          results.skipped++;
        } else {
          results.errors.push({ row: rowNum, error: `Report creation failed: ${reportError.message}` });
        }
      } else {
        results.success++;
      }
    } catch (e) {
      results.errors.push({ row: rowNum, error: e instanceof Error ? e.message : 'Unknown error' });
    }
  }

  return NextResponse.json(results);
}
