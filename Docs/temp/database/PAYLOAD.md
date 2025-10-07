1️⃣ Pengajar membuat soal

Tabel terkait: questions
Input: question_type (mcq, essay, true_false), body (JSONB), creator_id, optional image_url
Contoh insert:
INSERT INTO questions (school_id, module_id, creator_id, question_type, body)
VALUES 
(1, 101, 201, 'mcq', '{"question":"Siapa presiden pertama Indonesia?","options":{"A":"Sukarno","B":"Suharto"},"correct_answer":"A","image_url":"https://cdn.school.com/images/q1.png"}');

2️⃣ Pengajar membuat draft ujian

Tabel terkait: exams, exam_questions, teaching_assignments (untuk mapping kelas)
Langkah:
1. Insert draft ujian:
INSERT INTO exams (school_id, module_id, creator_id, title, status, start_time, duration_minutes)
VALUES (1, 101, 201, 'Ujian Sejarah Kelas X', 'draft', '2025-09-22 08:00', 90)
RETURNING id;
2. Pilih soal dari bank soal → insert ke exam_questions:
INSERT INTO exam_questions (exam_id, source_question_id, question_type, body, weight)
SELECT 301, id, question_type, body,
  CASE question_type
    WHEN 'mcq' THEN 60.0 / 2
    WHEN 'essay' THEN 10.0
    WHEN 'true_false' THEN 30.0
  END AS weight
FROM questions
WHERE module_id = 101;
3. Mapping ke kelas (multiple kelas):
Gunakan class_students + exam_attempts nanti otomatis generate untuk setiap siswa di kelas yang dituju.
DB bekerja:
exams menyimpan info ujian, exam_questions menyimpan soal & bobot
Banyak kelas bisa dihubungkan via generate exam_attempts untuk tiap siswa

3️⃣ Pengajar review ujian dan peserta
Query: ambil exam_questions + peserta di kelas:
SELECT e.title, eq.id AS exam_question_id, cs.student_id, u.full_name
FROM exams e
JOIN exam_questions eq ON eq.exam_id = e.id
JOIN class_students cs ON cs.class_id IN (1,2)  -- kelas yang dituju
JOIN users u ON u.id = cs.student_id
WHERE e.id = 301;

4️⃣ Pengajar menerbitkan ujian
1. Update status:
UPDATE exams
SET status = 'published'
WHERE id = 301;

2. Soft delete hanya bisa dilakukan oleh admin jika dibutuhkan:
UPDATE exams
SET deleted_at = NOW()
WHERE id = 301;  -- contoh soft delete

5️⃣ Peserta melakukan ujian

Tabel: exam_attempts
Generate attempt untuk semua siswa yang sudah terdaftar di kelas ujian:
INSERT INTO exam_attempts (exam_id, student_id, status)
SELECT 301, student_id, 'not_started'
FROM class_students
WHERE class_id IN (1,2);  -- kelas yang dituju

DB bekerja:

Tiap siswa punya record unik di exam_attempts
Jika DB partitioning aktif, insert otomatis masuk ke partisi sesuai exam_id

6️⃣ Siswa menjawab ujian

Tabel: answers
Contoh jawaban MCQ + Essay + True/False:
-- Jawaban MCQ
INSERT INTO answers (attempt_id, exam_question_id, answer, score)
VALUES (401, 1001, '{"selected_option":"A"}', 1.5);

-- Jawaban Essay
INSERT INTO answers (attempt_id, exam_question_id, answer)
VALUES (401, 1002, '{"answer_text":"Pemisahan kekuasaan artinya..."}');

-- Jawaban True/False
INSERT INTO answers (attempt_id, exam_question_id, answer, score)
VALUES (401, 1003, '{"selected_value":true}', 2);

DB bekerja:
Jawaban siswa tersimpan di JSONB → fleksibel untuk tipe soal apapun
Score otomatis bisa dihitung backend untuk tipe objektif, sementara essay menunggu penilaian guru
Jika DB partisi aktif → jawaban otomatis masuk ke partisi sesuai range exam_id

