-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.subjects (
  id integer NOT NULL DEFAULT nextval('subjects_id_seq'::regclass),
  name character varying NOT NULL,
  parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  center_id integer,
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.subjects(id),
  CONSTRAINT subjects_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.centers(id)
);
CREATE TABLE public.sessions (
  id integer NOT NULL DEFAULT nextval('sessions_id_seq'::regclass),
  scheduled_start timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  center_id integer,
  tutor_id uuid,
  student_name character varying,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.centers(id),
  CONSTRAINT sessions_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.session_reports (
  id integer NOT NULL DEFAULT nextval('session_reports_id_seq'::regclass),
  session_id integer NOT NULL,
  attendance_status USER-DEFINED NOT NULL DEFAULT 'present'::attendance_state,
  subject_id integer,
  engagement_q1 integer CHECK (engagement_q1 >= 1 AND engagement_q1 <= 5),
  engagement_q2 integer CHECK (engagement_q2 >= 1 AND engagement_q2 <= 5),
  engagement_q3 integer CHECK (engagement_q3 >= 1 AND engagement_q3 <= 5),
  session_summary text NOT NULL,
  what_went_well text NOT NULL,
  areas_for_growth text NOT NULL,
  next_session_plan text NOT NULL,
  in_app_status USER-DEFINED DEFAULT 'hidden'::in_app_state,
  delivery_status USER-DEFINED NOT NULL DEFAULT 'draft'::delivery_state,
  send_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  center_id integer,
  student_id uuid,
  CONSTRAINT session_reports_pkey PRIMARY KEY (id),
  CONSTRAINT session_reports_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id),
  CONSTRAINT session_reports_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT session_reports_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.centers(id),
  CONSTRAINT session_reports_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.centers (
  id integer NOT NULL DEFAULT nextval('centers_id_seq'::regclass),
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT centers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  role USER-DEFINED NOT NULL DEFAULT 'tutor'::user_role,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tutor_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  date date NOT NULL,
  is_busy boolean DEFAULT false,
  available_hours ARRAY DEFAULT '{}'::integer[],
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tutor_availability_pkey PRIMARY KEY (id),
  CONSTRAINT tutor_availability_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid,
  center_id integer,
  grade_level text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.profiles(id),
  CONSTRAINT students_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.centers(id)
);
CREATE TABLE public.student_subjects (
  student_id uuid NOT NULL,
  subject_id integer NOT NULL,
  CONSTRAINT student_subjects_pkey PRIMARY KEY (student_id, subject_id),
  CONSTRAINT student_subjects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);