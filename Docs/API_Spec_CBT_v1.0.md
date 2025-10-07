⚙️ API SPEC — CBT SYSTEM v1.0

Base URL: /api/v1
Auth: JWT (Bearer Token)
Response format: JSON
Version: 1.0
Updated: 2025-10-07

🔐 AUTH SERVICE
POST /auth/login

Role: Public
Description: Login dengan email dan password.

Request

{
  "email": "teacher@cbt.local",
  "password": "123456"
}


Response 200

{
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 5,
    "full_name": "Budi Santoso",
    "role": "teacher"
  }
}


Error 401

{"error": "invalid_credentials"}

POST /auth/refresh

Role: Authenticated
Description: Memperbarui access token.

Request

{"refresh_token": "eyJhbGciOiJIUzI1..."}


Response

{"access_token": "new_access_token"}

👥 USER SERVICE
GET /users

Role: Admin
Description: Daftar semua user.
Query params: ?role=teacher&school_id=1

Response

[
  {"id":1,"full_name":"Admin Sekolah","role":"admin"},
  {"id":2,"full_name":"Ibu Sinta","role":"teacher"}
]

POST /users

Role: Admin
Description: Membuat user baru (guru/siswa/admin)

Request

{
  "full_name": "Andi",
  "email": "andi@student.id",
  "password": "secret123",
  "role": "student",
  "school_id": 1
}


Response

{"id": 23, "full_name": "Andi", "role": "student"}

PATCH /users/:id

Role: Admin
Description: Update data user

Request

{
  "full_name": "Andi Rahman",
  "email": "andi@cbt.id"
}

GET /admin/partitions

Role: Admin
Description: Menampilkan daftar partisi aktif di tabel exam_attempts, answers, dan exam_results.

{
  "exam_attempts": [
    {"partition": "exam_attempts_1_100", "rows": 4532, "created_at": "2025-10-07T00:00:00Z"},
    {"partition": "exam_attempts_101_200", "rows": 2789, "created_at": "2025-10-08T00:00:00Z"}
  ],
  "answers": [
    {"partition": "answers_1_100", "rows": 10432},
    {"partition": "answers_101_200", "rows": 5600}
  ],
  "exam_results": [
    {"partition": "exam_results_1_100", "rows": 4250}
  ],
  "summary": {
    "total_partitions": 6,
    "total_rows_estimated": 23000
  }
}


POST /admin/partitions/precreate

Role: Admin
Description: Memicu pre-creation partisi berikutnya (misal untuk 1000 ujian ke depan).
Body (optional):
{"batch_size": 10, "range_size": 100}


Response:
{"created": ["exam_attempts_301_400", "answers_301_400", "exam_results_301_400"]}




📘 QUESTION SERVICE
GET /questions


Role: Teacher
Description: Ambil daftar soal
Query: ?module_id=3

Response

[
  {
    "id": 14,
    "module_id": 3,
    "question_type": "mcq",
    "body": {
      "question": "Apa ibu kota Indonesia?",
      "choices": ["Bandung", "Jakarta", "Surabaya"],
      "answer_key": 1
    }
  }
]

POST /questions

Role: Teacher
Description: Tambah soal baru

Request

{
  "module_id": 3,
  "question_type": "mcq",
  "body": {
    "question": "Siapa presiden pertama Indonesia?",
    "choices": ["Soekarno","Soeharto","Habibie"],
    "answer_key": 0
  }
}


Response

{"id": 51, "status": "created"}

PUT /questions/:id

Role: Teacher
Description: Edit soal

🧾 EXAM SERVICE
GET /exams

Role: Teacher/Admin
Description: Daftar ujian
Query: ?status=published

Response

[
  {
    "id": 101,
    "title": "UTS Matematika X",
    "status": "published",
    "start_time": "2025-10-07T09:00:00Z",
    "duration_minutes": 90
  }
]

POST /exams

Role: Teacher
Description: Membuat ujian baru

Request

{
  "module_id": 3,
  "title": "Ulangan Harian 2",
  "duration_minutes": 60,
  "start_time": "2025-10-09T08:00:00Z"
}


Response

{"id": 110, "status": "draft"}

POST /exams/:id/publish

Role: Teacher
Description: Publish ujian → caching soal ke RAM server.

Response

{"message": "exam_cached", "expire_at": "2025-10-10T08:00:00Z"}

DELETE /exams/:id/cache

Role: Admin
Description: Hapus cache ujian manual dari memori.

Response

{"message": "cache_removed", "exam_id": 101}

🧑‍🎓 STUDENT EXAM SERVICE
GET /exams/active

Role: Student
Description: Lihat daftar ujian aktif berdasarkan kelas atau token.
Query: ?class_id=2 atau ?token=ABC123

Response

[
  {
    "id": 201,
    "title": "UAS Bahasa Inggris",
    "start_time": "2025-10-07T09:00:00Z",
    "duration_minutes": 90,
    "status": "active"
  }
]

POST /exams/:id/start

Role: Student
Description: Mulai ujian, membuat record ExamAttempt.

Response

{
  "attempt_id": 501,
  "exam_id": 201,
  "questions_count": 20,
  "start_time": "2025-10-07T09:05:00Z"
}


PATCH /attempts/:id/answer

Role: Student
Description: Autosave jawaban.

Request

{
  "question_id": 44,
  "answer": {"choice_index": 2},
  "client_ts": "2025-10-07T09:15:21Z"
}


Response

{"status": "saved", "server_ts": "2025-10-07T09:15:22Z"}

POST /attempts/:id/submit

Role: Student
Description: Submit ujian manual.

Response

{"status": "submitted", "score_auto": 85}

POST /attempts/:id/auto-submit

Role: Student (trigger anti-cheat)
Description: Auto-submit saat keluar fullscreen/tab/window.

Response

{"status": "force_submitted", "reason": "anti_cheat_trigger"}

🧮 GRADING SERVICE
GET /grading/pending

Role: Teacher
Description: Lihat daftar ujian essay yang perlu penilaian manual.

Response

[
  {"attempt_id":501,"student":"Andi","exam_title":"UAS Bahasa Inggris"}
]

POST /grading/:attempt_id

Role: Teacher
Description: Nilai manual ujian essay.

Request

{
  "answers": [
    {"question_id":44,"score":10},
    {"question_id":45,"score":8}
  ]
}


Response

{"status":"graded","total_score":90}

📊 REPORTING SERVICE
GET /reports/exam/:id/summary

Role: Teacher/Admin
Description: Statistik hasil ujian.

Response

{
  "exam_id": 201,
  "average": 78.3,
  "highest": 98,
  "lowest": 54,
  "participants": 42
}

GET /reports/exam/:id/results

Role: Teacher/Admin
Description: Daftar nilai per siswa.

Response

[
  {"student":"Andi","score":85,"status":"passed"},
  {"student":"Budi","score":65,"status":"failed"}
]

🧠 CACHE MONITORING (ADMIN)
GET /admin/cache/stats

Role: Admin
Description: Lihat cache usage di RAM.

Response
{
  "total_exams_cached": 5,
  "estimated_memory_mb": 35.2,
  "cache_expire_at": "2025-10-08T09:00:00Z",
  "active_partitions": {
    "exam_attempts": 5,
    "answers": 5,
    "exam_results": 5
  }
}


DELETE /admin/cache/:exam_id

Role: Admin
Description: Hapus cache ujian dari memory server.

Response

{"message":"cache_removed","exam_id":201}

🧾 AUDIT LOG SERVICE
GET /audit

Role: Admin
Description: Ambil semua aktivitas penting (login, ujian, pelanggaran).

Query: ?user_id=5&action=anti_cheat_event

Response

[
  {
    "id": 88,
    "user_id": 502,
    "action": "anti_cheat_event",
    "target_resource": "exam_attempt",
    "target_id": 201,
    "details": {
      "event":"fullscreen_exit",
      "timestamp":"2025-10-07T09:23:12Z"
    },
    "created_at": "2025-10-07T09:23:12Z"
  }
]

🩵 HEALTHCHECK & METRICS
GET /health

Role: Public
Response

{"status":"ok","uptime":"12h 43m"}

GET /metrics

Role: Admin
Prometheus format metrics for monitoring.

✅ Summary of Endpoints by Role
Role	Endpoint Group
Admin	/users, /exams, /admin/cache, /audit
Teacher	/questions, /exams, /grading, /reports
Student	/exams/active, /attempts, /answers
Public	/auth/login, /health

End of API_Spec_CBT_v1.0.md
📁 File path recommendation: /Docs/API_Spec_CBT_v1.0.md
🧩 AI-agent optimized for auto router generation and OpenAPI build