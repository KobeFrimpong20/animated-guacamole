import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

// Set to true to bypass auth for local testing
const DEV_BYPASS = true; 
const MOCK_CENTER_ID = 1; 

interface ScheduleRow {
  date: string;
  time: string;
  tutor_email: string;
  parent_email: string;
  student_name: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  let center_id: number;

  if (DEV_BYPASS) {
    center_id = MOCK_CENTER_ID;
  } else {
    // 1. Get user metadata for center_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const center_id_raw = user.app_metadata?.center_id || user.user_metadata?.center_id;
    if (!center_id_raw) {
      return NextResponse.json({ error: 'No center associated with your account' }, { status: 400 });
    }

    center_id = parseInt(center_id_raw);
    if (isNaN(center_id)) {
      return NextResponse.json({ error: 'Invalid center configuration' }, { status: 400 });
    }
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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

    // 2. Process rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      try {
        // Look up tutor_id
        const { data: tutor, error: tutorError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', row.tutor_email)
          .single();
          
        console.log(`The tutor_email that was retrieved from the db was ${await supabase
          .from('profiles')
          .select('email')
        }.`)
        console.log(`The value od the email parsed was ${row.tutor_email}`)
        if (tutorError || !tutor) {
          if (tutorError){
            console.error("This is the tutorError: ", tutorError);
          }
          else {
            console.log("There is no tutor: ", tutor);
          }
          results.errors.push({ row: rowNum, error: `Tutor with email ${row.tutor_email} not found` });
          continue;
        }

        // Parse Date/Time (MM/DD/YYYY and 02:00PM)
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

        // 3. Handle Sessions (Group Session Logic)
        let session_id: number;
        
        const { data: existingSession, error: sessionFetchError } = await supabase
          .from('sessions')
          .select('id')
          .eq('tutor_id', tutor.id)
          .eq('scheduled_start', scheduled_start)
          .eq('center_id', center_id)
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
            .insert({
              tutor_id: tutor.id,
              center_id,
              scheduled_start,
            })
            .select('id')
            .single();

          if (sessionCreateError) {
            results.errors.push({ row: rowNum, error: `Session creation failed: ${sessionCreateError.message}` });
            continue;
          }
          session_id = newSession.id;
        }

        // 4. Create Session Report
        const { error: reportError } = await supabase
          .from('session_reports')
          .insert({
            session_id,
            center_id,
            student_name: row.student_name,
            parent_email: row.parent_email,
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
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
