1. Buat Instalasi Solid JD
npm create solid@latest

2. Struktur Folder 
/src
  /pages       → setiap halaman (Verifikasi, Ujian, Selesai, dsb.)
  /components  → komponen kecil (Modal, Button, Card, dsb.)
  /utils       → helper (format waktu, storage wrapper, dsb.)
  /stores      → state management (jika perlu pakai solid-store/context)

3. Install Library 
npm install @tailwindcss/forms

4. Flow Navigasi
a. Import Library
b. Definisikan Constanta fungsi
c. Daftarkan di App.jsx

