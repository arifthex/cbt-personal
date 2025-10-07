-- =====================================
-- CBT SYSTEM - FINAL DDL (PostgreSQL)
-- WITH RANGE PARTITIONING (100 EXAM PER PARTISI)
-- =====================================

-- =====================================
-- BAGIAN 1: SEKOLAH & PENGGUNA
-- =====================================
CREATE TABLE schools (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    identity_type VARCHAR(50), -- 'NISN', 'NIS', 'NIP'
    identity_number VARCHAR(100) UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'school_admin', 'teacher', 'student'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role ON users(role);


-- =====================================
-- BAGIAN 2: STRUKTUR AKADEMIK
-- =====================================
CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE academic_years (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(20) NOT NULL,        -- Contoh: '2025/2026'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    academic_year_id BIGINT REFERENCES academic_years(id) ON DELETE SET NULL;
);

CREATE TABLE class_students (
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE teaching_assignments (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE (teacher_id, class_id, module_id)
);

CREATE INDEX idx_class_students_class_id ON class_students(class_id);
CREATE INDEX idx_class_students_student_id ON class_students(student_id);
CREATE INDEX idx_teaching_assignments_teacher ON teaching_assignments(teacher_id);


-- =====================================
-- BAGIAN 3: BANK SOAL & UJIAN
-- =====================================
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    module_id BIGINT REFERENCES modules(id) ON DELETE SET NULL,
    creator_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    question_type VARCHAR(50) NOT NULL,
    body JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, closed, deleted
    start_time TIMESTAMPTZ,
    duration_minutes INT, //Jika sudah lewat dari durasi maka tampilkan expired
    created_at TIMESTAMPTZ DEFAULT NOW()
    deleted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_questions (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    source_question_id BIGINT REFERENCES questions(id) ON DELETE SET NULL,
    question_type VARCHAR(50) NOT NULL,
    body JSONB NOT NULL,
    weight NUMERIC(5,2) DEFAULT 1.00
) PARTITION BY RANGE (exam_id); -- PARTITIONING LEBIH EFISIEN

CREATE INDEX idx_questions_school_id ON questions(school_id);
CREATE INDEX idx_exams_school_id ON exams(school_id);

-- =====================================
-- BAGIAN 4: PARTISI UNTUK exam_attempts, answers, exam_results
-- =====================================

-- Tabel induk
CREATE TABLE exam_attempts (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    UNIQUE (exam_id, student_id)
) PARTITION BY RANGE (exam_id);

CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    exam_question_id BIGINT NOT NULL,
    answer JSONB,
    score NUMERIC(5,2),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (exam_question_id);

CREATE TABLE exam_results (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT UNIQUE NOT NULL,
    total_score NUMERIC(5,2),
    is_passed BOOLEAN,
    graded_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (attempt_id);

-- =====================================
-- BAGIAN 5: AUDIT LOGS
-- =====================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_resource VARCHAR(100),
    target_id BIGINT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);