-- =========================================================
-- 📘 CBT SYSTEM v1.1 — Database Schema + Auto Partitioning
-- Author: Bro Cak
-- Last Updated: 2025-10-08
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- BAGIAN 1: MASTER TABLES
-- =========================================================

CREATE TABLE schools (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id               BIGSERIAL PRIMARY KEY,
    school_id        BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    full_name        VARCHAR(255) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    identity_number  VARCHAR(100),
    identity_type    VARCHAR(50),
    password_hash    TEXT NOT NULL,
    role             VARCHAR(20) CHECK (role IN ('admin','teacher','student')) NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE modules (
    id              BIGSERIAL PRIMARY KEY,
    school_id       BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT
);

CREATE TABLE classes (
    id              BIGSERIAL PRIMARY KEY,
    school_id       BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    academic_year   VARCHAR(20) NOT NULL
);

CREATE TABLE class_students (
    class_id        BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    student_id      BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE teaching_assignments (
    id              BIGSERIAL PRIMARY KEY,
    teacher_id      BIGINT REFERENCES users(id) ON DELETE CASCADE,
    class_id        BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    module_id       BIGINT REFERENCES modules(id) ON DELETE CASCADE
);

-- =========================================================
-- BAGIAN 2: BANK SOAL DAN UJIAN
-- =========================================================

CREATE TABLE questions (
    id              BIGSERIAL PRIMARY KEY,
    school_id       BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    module_id       BIGINT REFERENCES modules(id) ON DELETE CASCADE,
    creator_id      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    question_type   VARCHAR(50) NOT NULL,
    body            JSONB NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exams (
    id                BIGSERIAL PRIMARY KEY,
    school_id         BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    module_id         BIGINT REFERENCES modules(id) ON DELETE CASCADE,
    creator_id        BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title             VARCHAR(255) NOT NULL,
    status            VARCHAR(20) CHECK (status IN ('draft','published','closed')) DEFAULT 'draft',
    start_time        TIMESTAMPTZ NOT NULL,
    duration_minutes  INT NOT NULL DEFAULT 60,
    access_token      VARCHAR(50),
    is_cached         BOOLEAN DEFAULT FALSE,
    cache_expire_at   TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_questions (
    id                 BIGSERIAL PRIMARY KEY,
    exam_id            BIGINT REFERENCES exams(id) ON DELETE CASCADE,
    source_question_id BIGINT REFERENCES questions(id) ON DELETE SET NULL,
    question_type      VARCHAR(50),
    body               JSONB NOT NULL,
    weight             NUMERIC(5,2) DEFAULT 1.00
);

-- =========================================================
-- BAGIAN 3: PARTITIONED TABLES
-- =========================================================

-- MASTER TABLE FOR PARTITIONING
CREATE TABLE exam_attempts (
    id                BIGSERIAL NOT NULL,
    exam_id           BIGINT NOT NULL,
    student_id        BIGINT NOT NULL,
    status            VARCHAR(20) CHECK (status IN ('created','in_progress','submitted','force_submitted','graded')) DEFAULT 'created',
    anti_cheat_events JSONB DEFAULT '[]'::jsonb,
    started_at        TIMESTAMPTZ DEFAULT NOW(),
    ended_at          TIMESTAMPTZ,
    PRIMARY KEY (id, exam_id)
) PARTITION BY RANGE (exam_id);

-- MASTER TABLE FOR ANSWERS
CREATE TABLE answers (
    id                BIGSERIAL NOT NULL,
    attempt_id        BIGINT NOT NULL,
    exam_question_id  BIGINT NOT NULL,
    answer            JSONB,
    score             NUMERIC(5,2),
    submitted_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, exam_question_id)
) PARTITION BY RANGE (exam_question_id);

-- MASTER TABLE FOR RESULTS
CREATE TABLE exam_results (
    id             BIGSERIAL NOT NULL,
    attempt_id     BIGINT NOT NULL,
    total_score    NUMERIC(6,2) DEFAULT 0.00,
    is_passed      BOOLEAN DEFAULT FALSE,
    graded_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, attempt_id)
) PARTITION BY RANGE (attempt_id);

-- =========================================================
-- BAGIAN 4: CACHE & AUDIT TABLES
-- =========================================================

CREATE TABLE cache_stats (
    id               BIGSERIAL PRIMARY KEY,
    exam_id          BIGINT REFERENCES exams(id) ON DELETE CASCADE,
    memory_used_mb   NUMERIC(6,2) DEFAULT 0.0,
    cached_at        TIMESTAMPTZ DEFAULT NOW(),
    expire_at        TIMESTAMPTZ
);

CREATE TABLE audit_logs (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action            VARCHAR(100) NOT NULL,
    target_resource   VARCHAR(100),
    target_id         BIGINT,
    details           JSONB,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- BAGIAN 5: INDEXES TAMBAHAN
-- =========================================================
CREATE INDEX idx_exam_attempts_exam_id ON exam_attempts(exam_id);
CREATE INDEX idx_answers_exam_question_id ON answers(exam_question_id);
CREATE INDEX idx_exam_results_attempt_id ON exam_results(attempt_id);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- =========================================================
-- BAGIAN 6: TRIGGER FUNCTION AUTO CREATE PARTISI (RANGE 100 EXAM)
-- =========================================================

-- 🔹 TRIGGER FUNCTION: AUTO PARTITION FOR exam_attempts
CREATE OR REPLACE FUNCTION create_exam_attempts_partition()
RETURNS TRIGGER AS $$
DECLARE
    part_start BIGINT;
    part_end BIGINT;
    part_name TEXT;
BEGIN
    part_start := (NEW.exam_id / 100) * 100 + 1;
    part_end := part_start + 99;
    part_name := 'exam_attempts_' || part_start || '_' || part_end;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = part_name) THEN
        EXECUTE 'CREATE TABLE IF NOT EXISTS ' || part_name || ' PARTITION OF exam_attempts
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_exam_attempts_partition
BEFORE INSERT ON exam_attempts
FOR EACH ROW EXECUTE FUNCTION create_exam_attempts_partition();


-- 🔹 TRIGGER FUNCTION: AUTO PARTITION FOR answers
CREATE OR REPLACE FUNCTION create_answers_partition()
RETURNS TRIGGER AS $$
DECLARE
    part_start BIGINT;
    part_end BIGINT;
    part_name TEXT;
BEGIN
    part_start := (NEW.exam_question_id / 100) * 100 + 1;
    part_end := part_start + 99;
    part_name := 'answers_' || part_start || '_' || part_end;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = part_name) THEN
        EXECUTE 'CREATE TABLE IF NOT EXISTS ' || part_name || ' PARTITION OF answers
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_answers_partition
BEFORE INSERT ON answers
FOR EACH ROW EXECUTE FUNCTION create_answers_partition();


-- 🔹 TRIGGER FUNCTION: AUTO PARTITION FOR exam_results
CREATE OR REPLACE FUNCTION create_exam_results_partition()
RETURNS TRIGGER AS $$
DECLARE
    part_start BIGINT;
    part_end BIGINT;
    part_name TEXT;
BEGIN
    part_start := (NEW.attempt_id / 100) * 100 + 1;
    part_end := part_start + 99;
    part_name := 'exam_results_' || part_start || '_' || part_end;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = part_name) THEN
        EXECUTE 'CREATE TABLE IF NOT EXISTS ' || part_name || ' PARTITION OF exam_results
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_exam_results_partition
BEFORE INSERT ON exam_results
FOR EACH ROW EXECUTE FUNCTION create_exam_results_partition();

-- =========================================================
-- CATATAN:
-- 1️⃣ Range partisi = 100 exam_id (bisa disesuaikan)
-- 2️⃣ Jika exam_id melewati 100 batch berikutnya, table otomatis dibuat
-- 3️⃣ Backend bisa tetap query exam_attempts tanpa modifikasi query
-- 4️⃣ Untuk sistem besar, bisa pakai background scheduler untuk pre-create partisi
-- =========================================================

-- ✅ DONE
