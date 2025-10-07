# 🧠 CBT SYSTEM v1.0 — Monorepo Edition

> Sistem Ujian Berbasis Komputer (CBT) dengan performa tinggi, anti-cheat otomatis, dan caching soal di RAM untuk ribuan siswa.

---

## 🚀 Tentang Proyek Ini

CBT System v1.0 adalah sistem ujian digital skala besar yang dikembangkan untuk mendukung kegiatan ujian sekolah secara efisien, cepat, dan aman.

**Fitur Utama**
- ⚡ **High Performance** – hingga 5000 siswa aktif pada server 4 core / 4 GB RAM.
- 🔒 **Anti-Cheat System** – auto-submit jika keluar fullscreen/tab.
- 🧠 **RAM Caching** – soal disimpan di memory server (tanpa Redis).
- 👥 **3 Role Terintegrasi** – admin, guru, dan siswa.
- 🧾 **Audit Log & Monitoring** – semua aktivitas tercatat dan bisa dipantau oleh admin.
- 🐳 **Dockerized** – mudah dijalankan di server atau lokal.

---

## 🧱 Stack Teknologi

| Layer | Teknologi | Keterangan |
|--------|------------|-------------|
| Frontend | [Solid.js](https://www.solidjs.com) + [shadcn/ui](https://ui.shadcn.com) | SPA modern untuk siswa & guru |
| Backend | [Golang](https://go.dev) + `chi` + `sqlc` + `pgx` | API performa tinggi, in-memory caching |
| Database | [PostgreSQL](https://www.postgresql.org) | Menyimpan data soal, ujian, hasil, audit |
| Deployment | Docker Compose | Menjalankan semua service dalam satu stack |
| Auth | JWT (Access + Refresh Token) | Terintegrasi antar sistem |
| Monitoring | Prometheus (opsional) | Statistik & health metrics |

---

## 📁 Struktur Folder

/
├── FE/ # Frontend Solid.js + shadcn UI
│ ├── src/
│ ├── package.json
│ └── vite.config.ts
│
├── BE/ # Backend Golang API
│ ├── cmd/api/main.go
│ ├── internal/
│ ├── pkg/
│ ├── go.mod
│ └── go.sum
│
├── Docs/ # Dokumentasi Proyek
│ ├── PRD_CBT_v1.0.md
│ ├── ERD_CBT_v1.0.md
│ ├── API_Spec_CBT_v1.0.md
│ ├── openapi_cbt_v1.0.yaml
│ └── catatan.md
│
├── Deploy/ # Environment & Docker
│ ├── docker-compose.yml
│ ├── Dockerfile.api
│ ├── Dockerfile.fe
│ └── .env.example
│
└── README.md # Dokumentasi utama proyek

yaml
Salin kode

---

## 🧰 Prasyarat Pengembangan

| Komponen | Versi Minimum |
|-----------|----------------|
| Go | 1.22+ |
| Node.js | 20+ |
| PostgreSQL | 14+ |
| Docker | 24+ |
| Docker Compose | v2 |
| Git | v2.40+ |

---

## ⚙️ Cara Menjalankan di Lokal

### 1️⃣ Clone Repo
```bash
git clone https://github.com/<organization>/cbt-system.git
cd cbt-system
2️⃣ Copy file environment
bash
Salin kode
cp Deploy/.env.example .env
3️⃣ Jalankan Docker
bash
Salin kode
docker compose up -d
4️⃣ Jalankan Backend (opsional)
bash
Salin kode
cd BE
go run cmd/api/main.go
5️⃣ Jalankan Frontend (opsional)
bash
Salin kode
cd FE
npm install
npm run dev
Frontend dapat diakses di http://localhost:5173
Backend API di http://localhost:8080/api/v1

🧠 Role & Fungsional
Role	Akses Utama
Admin	Monitoring cache RAM, audit log, hapus cache
Guru	Membuat soal, publish ujian, melihat hasil
Siswa	Melihat ujian aktif, mengerjakan, anti-cheat aktif

🧩 Alur Sistem Singkat
pgsql
Salin kode
Guru → Membuat Soal → Membuat Ujian → Publish (soal tersimpan di RAM)
Siswa → Login → Mulai Ujian → Soal diambil dari cache → Submit
Sistem → Auto-submit jika keluar fullscreen/tab
Admin → Monitoring cache RAM & audit log
🔐 Keamanan
Aspek	Implementasi
Autentikasi	JWT access + refresh token
Password	bcrypt hash
Anti-cheat	Fullscreen lock, tab switch detection, auto-submit
Audit Log	Semua event penting disimpan ke DB
CORS	Dibatasi domain resmi sekolah

🧾 Dokumentasi
File	Deskripsi
Docs/PRD_CBT_v1.0.md	Product Requirement Document lengkap
Docs/ERD_CBT_v1.0.md	Entity Relationship Diagram (Mermaid)
Docs/API_Spec_CBT_v1.0.md	Spesifikasi REST API
Docs/openapi_cbt_v1.0.yaml	OpenAPI 3.0 untuk Swagger
Docs/catatan.md	Catatan teknis dan insight pengembangan

📊 Monitoring & Observability
Endpoint	Deskripsi
/health	Healthcheck service
/metrics	Prometheus metrics
/admin/cache/stats	Statistik cache in-memory
/audit	Daftar aktivitas penting

🧪 Pengujian
Jenis	Tools	Keterangan
Unit Test	Go testing	Pengujian logic internal
Integration Test	Docker Compose + Postgres	Uji antar service
Load Test	k6	Uji performa hingga 5000 user
E2E	Playwright / Cypress	Simulasi real student exam

🔁 CI/CD (Contoh GitHub Actions)
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
      - uses: actions/setup-go@v3
        with:
          go-version: 1.22
      - name: Build Backend
        run: cd BE && go build ./cmd/api
      - name: Build Frontend
        run: cd FE && npm ci && npm run build
      - name: Docker Build
        run: docker compose build
🧠 Integrasi AI Agent (DevOps Enhancement)
Semua dokumentasi di folder /Docs/ telah disusun dengan format Markdown terstruktur, sehingga:

AI Agent dapat membaca konteks proyek,

menghasilkan kode otomatis (schema, router, SDK),

serta membantu DevOps dalam deployment otomatis.

🧮 Lisensi & Hak Cipta
Hak cipta dimiliki oleh Bro Cak.
Proyek ini bersifat internal, tidak untuk publikasi tanpa izin tertulis.
Semua sumber daya dan kode bersifat confidential.

🧭 Kontak & Dukungan
Owner / Lead Developer: Bro Cak
📧 Email: dev@cbt.local
💬 Chat: Internal Dev Group / Telegram