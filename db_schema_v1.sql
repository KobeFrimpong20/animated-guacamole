-- 1. SUBJECTS HIERARCHY TABLE (Self-referencing for General -> Specific)
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_subject_per_parent UNIQUE (name, parent_id)
);

-- 2. SESSIONS TABLE (The "Event" - Populated by Director's CSV)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    tutor_name VARCHAR(100) NOT NULL,  -- Simplified for MVP, can link to a users table later
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SESSION REPORTS TABLE (The "Outcome", State Machine, and Contact Info)
CREATE TYPE attendance_state AS ENUM ('present', 'no_show');
CREATE TYPE delivery_state AS ENUM ('draft', 'pending', 'in_progress', 'queued', 'sent', 'failed');
CREATE TYPE in_app_state AS ENUM ('hidden', 'visible', 'editable', 'locked');

CREATE TABLE session_reports (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    parent_email VARCHAR(255) NOT NULL, -- Added directly for lean, fast worker queries
    
    -- Attendance & Subjects
    attendance_status attendance_state NOT NULL DEFAULT 'present',
    subject_id INT REFERENCES subjects(id), 
    
    -- Metrics (5-Point Scale)
    engagement_q1 INT CHECK (engagement_q1 BETWEEN 1 AND 5),
    engagement_q2 INT CHECK (engagement_q2 BETWEEN 1 AND 5),
    engagement_q3 INT CHECK (engagement_q3 BETWEEN 1 AND 5),
    
    -- Narrative Content
    session_summary TEXT NOT NULL,
    what_went_well TEXT NOT NULL,
    areas_for_growth TEXT NOT NULL,
    next_session_plan TEXT NOT NULL,
    
    -- State Machine & Buffer Timing
    in_app_status in_app_state DEFAULT 'hidden', 
    delivery_status delivery_state NOT NULL DEFAULT 'draft',
    send_at TIMESTAMP WITH TIME ZONE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & dashboard queries
CREATE INDEX idx_sessions_tutor ON sessions(tutor_name, scheduled_start);
CREATE INDEX idx_reports_delivery ON session_reports(delivery_status, send_at) 
    WHERE delivery_status = 'pending';
