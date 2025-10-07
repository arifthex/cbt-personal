# 🗒️ CATATAN TEKNIS & ARSITEKTUR — CBT SYSTEM v1.0
**Author:** Bro Cak  
**Version:** 1.0  
**Last Updated:** 2025-10-07  
**Scope:** Internal Development Notes  

---

## 📘 1️⃣ Tujuan File Ini
File ini berisi catatan tambahan yang tidak dimasukkan ke PRD resmi,
berfungsi untuk:
- dokumentasi cepat bagi developer,
- pengingat konfigurasi environment,
- insight performa & pengembangan,
- serta tracking ide improvement.

---

## 🧩 2️⃣ Struktur dan Orientasi Proyek

**Project type:** Monorepo  
**Main folders:**
/FE/ → Frontend (Solid.js + shadcn UI)
/BE/ → Backend (Golang)
/Docs/ → Dokumentasi
/Deploy/ → Docker, Env, Makefile

markdown
Salin kode

**Build style:**  
- `FE`: build pakai `vite` → hasil ke `/dist`
- `BE`: pakai `go run cmd/api/main.go`
- `Deploy/docker-compose.yml` menggabungkan semua komponen

---

## ⚙️ 3️⃣ Catatan Backend (Golang)

**Framework:** `chi` (lightweight router)  
**ORM/DB Layer:** `sqlc` + `pgx`  
**Migration:** `golang-migrate`  
**Cache:** In-memory `map[int64]*ExamCache`  
**Logging:** `zerolog` atau `zap` (JSON structured)

### 🔹 Folder Backend
/cmd/api/main.go → entrypoint
/internal/auth/ → JWT, bcrypt
/internal/exam/ → logic ujian, publish cache
/internal/cache/ → in-memory caching & monitor
/internal/student/ → attempt, autosave, submit
/internal/grading/ → auto/manual grading
/internal/admin/ → dashboard cache, audit
/pkg/db/ → sqlc generated
/pkg/middleware/ → auth, rbac
/pkg/utils/ → helpers

shell
Salin kode

### 🔹 Golang Environment Variable
APP_PORT=8080
DATABASE_URL=postgres://cbt_user:cbt_pass@postgres:5432/cbt
JWT_SECRET=supersecretkey
CACHE_CLEAN_INTERVAL=10m

markdown
Salin kode

### 🔹 In-Memory Cache Lifecycle
- Saat guru **publish exam**, backend:
  1. Load semua `ExamQuestion` dari DB
  2. Serialize ke struct → simpan ke `CachedExams[examID]`
  3. Simpan metadata di `CacheStat`
- Cache dihapus otomatis setelah `exam.cache_expire_at`
- Admin dapat hapus manual via `/admin/cache/:exam_id`

---

## 🧠 4️⃣ Catatan Frontend (Solid.js)

**Framework:** Solid.js  
**UI Library:** shadcn/ui  
**Styling:** Tailwind CSS (CDN + config)  
**Build:** Vite  
**Target:** Single Page App (SPA)

### 🔹 Rekomendasi Struktur FE
/src/pages/

login.tsx

dashboard.tsx

exams/

list.tsx

attempt.tsx

review.tsx
/src/components/

navbar.tsx

timer.tsx

question-card.tsx
/src/store/

auth.ts

exam.ts

cache.ts

markdown
Salin kode

### 🔹 Catatan UX Anti-Cheat
- Browser **harus** masuk fullscreen (`requestFullscreen()`).
- Jika siswa:
  - keluar fullscreen → auto-submit
  - ganti tab → auto-submit
  - minimize → auto-submit
- Gunakan event listener:
  ```ts
  document.addEventListener('fullscreenchange', handler);
  document.addEventListener('visibilitychange', handler);
  window.addEventListener('blur', handler);
Event akan kirim POST ke /attempts/:id/auto-submit.

🔒 5️⃣ Catatan Keamanan
Aspek	Implementasi
Auth	JWT access + refresh
Password	bcrypt hash (cost 10–12)
CORS	Allow origin dari domain sekolah
Rate Limit	60 req/min/user (optional)
Audit	Semua aksi penting log ke DB
TLS	Dijalankan di layer Nginx/Traefik

🔹 JWT Token Structure
json
Salin kode
{
  "sub": "user_id",
  "role": "teacher",
  "exp": 1733668800
}
📊 6️⃣ Catatan Monitoring & Observability
🔹 Prometheus Metrics
Expose via /metrics:

yaml
Salin kode
http_requests_total{route="/exams"} 1234
cache_entries_total 5
cache_memory_mb 42.7
exam_attempts_active 2300
🔹 Grafana Dashboard (Opsional)
Panel rekomendasi:

Active Students

Cache Memory Usage

DB Query Time

API Latency (p95)

Anti-cheat Auto-Submit Count

🧮 7️⃣ Estimasi Performa
Komponen	Target	Catatan
Server Spec	4 vCPU, 4GB RAM	Minimum
Concurrency	5000 siswa aktif	Tes dengan k6
Cache Memory	<100MB typical	10–20 soal per mapel
DB Queries	Low	Cache-first strategy
API Response	<200ms p95	Validasi di test k6
Autosave	60 detik	Buffered goroutine writer

🧱 8️⃣ Catatan Database
DB Engine: PostgreSQL 14+
Extensions: uuid-ossp, pgcrypto (opsional)
Connection Pool: 50 max connections

🔹 Index Penting
sql
Salin kode
CREATE INDEX idx_exam_module_id ON exams(module_id);
CREATE INDEX idx_exam_attempt_exam_id ON exam_attempts(exam_id);
CREATE INDEX idx_answer_attempt_id ON answers(attempt_id);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
🔹 Partial Index Cache
sql
Salin kode
CREATE INDEX idx_exam_active
ON exams(start_time)
WHERE status = 'published';
🧰 9️⃣ Testing & Quality Assurance
Testing stack:

Unit Test → Go testing + testify

Integration Test → Docker Compose ephemeral DB

E2E → Playwright / Cypress

Load Test → k6 run loadtest.js

E2E Case:

Login (teacher/student)

Publish exam

Siswa mulai ujian

Anti-cheat trigger auto-submit

Hasil grading muncul

Admin hapus cache

🔁 🔟 CI/CD Pipeline
GitHub Actions Sample
yaml
Salin kode
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Go
        uses: actions/setup-go@v3
        with: { go-version: 1.22 }
      - name: Build backend
        run: cd BE && go build ./cmd/api
      - name: Build frontend
        run: cd FE && npm ci && npm run build
      - name: Docker build
        run: docker-compose build
🧠 11️⃣ Ide Pengembangan Lanjutan
Area	Ide	Catatan
Offline Mode	PWA dengan IndexedDB local sync	Untuk lokasi tanpa koneksi stabil
Proctoring AI	Tab switch + webcam snapshot	Integrasi eksternal
Realtime Dashboard	WebSocket untuk pengawas ujian	Bisa lihat progress live
Distributed Cache	Tambah opsi Redis cluster	Untuk multi-instance deployment
Webhook Integrasi	Callback ke SIAKAD setelah grading	Bisa sync nilai otomatis

📎 12️⃣ Shortcut Developer
Task	Command
Run backend	go run cmd/api/main.go
Run frontend	npm run dev
Run Docker stack	docker-compose up
Run DB migration	migrate -path db/migrations -database $DATABASE_URL up
Test backend	go test ./... -v

✅ 13️⃣ Summary Checklist
 Monorepo setup complete

 PRD, ERD, API Spec, OpenAPI

 Cache system in-memory working

 Anti-cheat auto-submit active

 Docker compose tested

 Add background cache cleaner job

 Add Grafana dashboard (opsional)