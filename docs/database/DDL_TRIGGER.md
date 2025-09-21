-- =====================================
-- BAGIAN 6: TRIGGER FUNCTION AUTO CREATE PARTISI (RANGE 100 EXAM)
-- =====================================
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
        EXECUTE 'CREATE TABLE ' || part_name || ' PARTITION OF exam_attempts
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_exam_attempts_partition
BEFORE INSERT ON exam_attempts
FOR EACH ROW EXECUTE FUNCTION create_exam_attempts_partition();

-- Note: bisa bikin function/trigger serupa untuk answers & exam_results jika perlu

-- =====================================
-- TRIGGER FUNCTION UNTUK ANSWERS
-- =====================================
CREATE OR REPLACE FUNCTION create_answers_partition()
RETURNS TRIGGER AS $$
DECLARE
    part_start BIGINT;
    part_end BIGINT;
    part_name TEXT;
BEGIN
    -- Asumsi exam_question_id sejalan dengan exam_id range (bisa disesuaikan jika berbeda)
    part_start := (NEW.exam_question_id / 100) * 100 + 1;
    part_end := part_start + 99;
    part_name := 'answers_' || part_start || '_' || part_end;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = part_name) THEN
        EXECUTE 'CREATE TABLE ' || part_name || ' PARTITION OF answers
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_answers_partition
BEFORE INSERT ON answers
FOR EACH ROW EXECUTE FUNCTION create_answers_partition();


-- =====================================
-- TRIGGER FUNCTION UNTUK EXAM_RESULTS
-- =====================================
CREATE OR REPLACE FUNCTION create_exam_results_partition()
RETURNS TRIGGER AS $$
DECLARE
    part_start BIGINT;
    part_end BIGINT;
    part_name TEXT;
BEGIN
    -- Asumsi attempt_id mengikuti exam_id range (harus mapping jika berbeda)
    part_start := (NEW.attempt_id / 100) * 100 + 1;
    part_end := part_start + 99;
    part_name := 'exam_results_' || part_start || '_' || part_end;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = part_name) THEN
        EXECUTE 'CREATE TABLE ' || part_name || ' PARTITION OF exam_results
                 FOR VALUES FROM (' || part_start || ') TO (' || (part_end+1) || ')';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_exam_results_partition
BEFORE INSERT ON exam_results
FOR EACH ROW EXECUTE FUNCTION create_exam_results_partition();
