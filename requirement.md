# Sistem CBT / Ujian Online
Dokumentasi requirement untuk sistem CBT berbasis Go dengan target concurrency **5000 peserta**.

## 1. Tujuan
Membangun sistem ujian online (CBT) yang:
- Dapat digunakan siswa, pengajar, dan admin.
- Skalabel hingga **5000 user bersamaan**.
- Terintegrasi dengan sistem eksternal (SIAKAD).
- Optimal dijalankan di server **8 core, 8 GB RAM**.

---

## 2. Role & Fitur Utama

### 2.1 Admin
- **Manajemen User**
  - Tambah user manual.
  - Sinkronisasi user dari **API SIAKAD**.
  - Import user via CSV.
  - Mode sync → disable tambah manual.

- **Manajemen Pengajar & Siswa**
  - Assign pengajar ke kelas.
  - Assign siswa ke kelas.

- **Manajemen Materi & Pelatihan**
  - Membuat materi.
  - Membuat pelatihan (kumpulan materi).

- **Manajemen Ujian**
  - Membuat ujian.
  - Menentukan bobot penilaian (PG %, Essay %).
  - Menerbitkan ujian.

---

### 2.2 Pengajar
- Melihat daftar kelas yang diampu.
- Menerbitkan ujian untuk kelas.
- Melihat daftar siswa.
- Melihat nilai hasil ujian.

---

### 2.3 Siswa
- Melihat daftar pelatihan & ujian.
- Mengikuti ujian.
  - Ujian hanya **single attempt**.
- Melihat hasil ujian.

---

## 3. Penilaian
- **PG (Pilihan Ganda)** → otomatis dihitung.
- **Essay** → manual oleh pengajar.
- Nilai akhir = kombinasi bobot sesuai konfigurasi ujian.

---

## 4. Integrasi
- **API SIAKAD** → sync user.
- **CSV Import** → tambah user massal.

---

## 5. Teknologi Backend
- Bahasa: **Go (Golang)**.
- Database: **PostgreSQL**.
- Cache: **Redis** (untuk session & concurrency handling).
- API: **REST (OAS 3.0, YAML)**.
- Deployment: VPS (8 core, 8 GB RAM).

---

## 6. High-Level Flow
1. **Admin** setup user & kelas (manual / sync / CSV).
2. **Admin** buat materi & pelatihan.
3. **Admin/Pengajar** buat ujian + konfigurasi bobot nilai.
4. **Pengajar** terbitkan ujian.
5. **Siswa** login → ikut ujian (single attempt).
6. **Sistem** hitung nilai otomatis (PG) + manual (essay).
7. **Pengajar** review nilai akhir.
8. **Siswa** bisa melihat hasil ujian.

---

## 7. Catatan Tambahan
- Setiap ujian harus memiliki **durasi**.
- Perlu proteksi agar siswa tidak bisa ikut lebih dari sekali.
- Harus ada tracking **jawaban per siswa** + **waktu submit**.
- Potensi integrasi ke **mobile app** di masa depan.
