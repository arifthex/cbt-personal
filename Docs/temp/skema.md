## Ringkasan Skema Alur Ujian
1. Sebelum Ujian: Server Go memuat semua soal ujian ke dalam Redis/Cache Memori.
2. Login Massal:
    - Siswa login, Nginx mengatur antrian.
    - Go melakukan otentikasi (query cepat ke DB), membuat JWT.
    - Go mengambil soal dari Cache Memori (super cepat) dan mengirimkannya ke SolidJS.
3. Pengerjaan:
    - SolidJS menjalankan timer dan logika UI.
    - Setiap 1 menit, SolidJS mengirimkan batch jawaban terbaru.
    - Go API menerima jawaban, memasukkannya ke antrian (Go channels/NATS), dan langsung balas OK.
    - Worker goroutine di belakang layar menyimpan jawaban dari antrian ke database secara perlahan dan stabil.
4. Submit Akhir:
    - Siswa menekan "Selesai", request terakhir dikirim ke antrian.
    - Aplikasi memberikan konfirmasi.

NOTE : Jangan Insert ke DB setiap kali siswa ganti pilihan jawaban, cukup saat ganti soal aja baru update jawaban