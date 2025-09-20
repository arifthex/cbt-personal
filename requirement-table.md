# Sistem CBT / Ujian Online – Detail Role & Fitur

| Role       | Fitur / Modul           | Detail                                                                 | Endpoint / Catatan |
|-----------|------------------------|-----------------------------------------------------------------------|------------------|
| Admin     | Manajemen User          | Tambah user manual (jika mode sync OFF)                               | POST /admin/users |
|           |                        | Sinkronisasi user via API SIAKAD                                       | POST /admin/users/sync/api |
|           |                        | Import user massal via CSV                                             | POST /admin/users/sync/csv |
|           |                        | Toggle mode sinkronisasi (manual / api / csv)                          | GET/POST /admin/users/sync/mode |
|           | Manajemen Pengajar/Siswa| Assign pengajar ke kelas                                               | POST /admin/kelas/assign-teacher |
|           |                        | Assign siswa ke kelas                                                 | POST /admin/kelas/assign-student |
|           | Manajemen Materi        | Buat materi baru                                                       | POST /admin/materi |
|           | Manajemen Pelatihan     | Buat pelatihan (kumpulan materi)                                       | POST /admin/pelatihan |
|           | Manajemen Ujian         | Buat ujian baru                                                        | POST /admin/ujian |
|           |                        | Konfigurasi bobot penilaian (PG %, Essay %)                            | bagian dari POST /admin/ujian |
|           |                        | Publish / terbitkan ujian                                              | POST /admin/ujian/publish |
| Pengajar  | Daftar Kelas            | Melihat kelas yang diampu                                              | GET /pengajar/kelas |
|           | Terbitkan Ujian         | Membuat & publish ujian untuk kelas                                     | POST /pengajar/ujian |
|           | Lihat Siswa             | Lihat daftar siswa kelas                                               | GET /pengajar/kelas/{kelasId}/siswa |
|           | Lihat Nilai             | Melihat hasil ujian siswa                                              | GET /pengajar/nilai/{examId} |
| Siswa     | Lihat Pelatihan/Ujian   | Akses daftar materi/pelatihan                                          | GET /siswa/pelatihan |
|           | Ikut Ujian              | Mulai ujian (single attempt)                                           | POST /siswa/ujian/{examId}/start |
|           | Submit Jawaban          | Submit jawaban PG/Essay                                                | POST /siswa/ujian/{examId}/submit |
|           | Lihat Hasil             | Cek hasil nilai ujian (PG auto, Essay manual)                         | GET /siswa/hasil/{examId} |

# Catatan Teknis
1. **Mode Sync User:** jika API/CSV aktif → manual add dinonaktifkan.
2. **Concurrency:** sistem harus scalable untuk 5000 peserta sekaligus.
3. **Penilaian:** PG otomatis, Essay dinilai pengajar.
4. **Proteksi:** siswa hanya bisa ikut ujian 1 kali.
5. **Tracking:** jawaban + waktu submit harus tercatat.
6. **Integrasi:** API SIAKAD + CSV import.
7. **Teknologi Backend:** Go, PostgreSQL, Redis (session & concurrency), REST API (OAS 3.0).
