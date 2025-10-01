// src/pages/siswa/Selesai.jsx
import { onMount } from "solid-js";

const Selesai = () => {
  let hasilUjian = {
    nama: "",
    nomor: "",
    jumlahSoal: "",
    soalDijawab: "",
    waktuSelesai: "",
    status: "",
  };

  onMount(() => {
    // 👉 nanti bisa ganti dari localStorage atau API
    hasilUjian = {
      nama: localStorage.getItem("siswa_nama") || "Rahmanda Safitri",
      nomor: localStorage.getItem("siswa_nomor") || "20250101",
      jumlahSoal: "36 Soal",
      soalDijawab: "36 Soal",
      waktuSelesai: new Date().toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      status: "Berhasil Terkirim",
    };

    document.getElementById("display_nama").textContent = hasilUjian.nama;
    document.getElementById("display_nomor").textContent = hasilUjian.nomor;
    document.getElementById("display_jumlah_soal").textContent =
      hasilUjian.jumlahSoal;
    document.getElementById("display_soal_dijawab").textContent =
      hasilUjian.soalDijawab;
    document.getElementById("display_waktu").textContent =
      hasilUjian.waktuSelesai;
    document.getElementById("display_status").textContent = hasilUjian.status;
  });

  return (
    <main class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-2xl text-center mx-auto my-10">
      {/* Ikon sukses */}
      <div class="mx-auto mb-4">
        <svg
          class="success-checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          width="80"
          height="80"
          style="margin: 0 auto;"
        >
          <circle
            class="success-checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="success-checkmark__check"
            fill="none"
            stroke="#10B981"
            stroke-width="3"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>

      <header>
        <h1 class="text-3xl font-bold text-gray-800">Ujian Telah Diselesaikan</h1>
        <p class="text-gray-500 mt-2">
          Jawaban Anda berhasil dikirim ke sistem!
        </p>
      </header>

      {/* Ringkasan */}
      <section class="bg-gray-50 border border-gray-200 rounded-xl p-6 my-8 text-left">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">
          Ringkasan Ujian
        </h2>
        <div class="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm sm:text-base">
          <div>
            <label class="text-gray-500">Nama Peserta</label>
            <p id="display_nama" class="font-semibold text-gray-900"></p>
          </div>
          <div>
            <label class="text-gray-500">Nomor Peserta</label>
            <p id="display_nomor" class="font-semibold text-gray-900"></p>
          </div>
          <div>
            <label class="text-gray-500">Jumlah Soal</label>
            <p id="display_jumlah_soal" class="font-semibold text-gray-900"></p>
          </div>
          <div>
            <label class="text-gray-500">Soal Dijawab</label>
            <p id="display_soal_dijawab" class="font-semibold text-gray-900"></p>
          </div>
          <div>
            <label class="text-gray-500">Waktu Selesai</label>
            <p id="display_waktu" class="font-semibold text-gray-900"></p>
          </div>
          <div>
            <label class="text-gray-500">Status Pengiriman</label>
            <div class="flex items-center gap-1">
              <p
                id="display_status"
                class="font-semibold text-emerald-500"
              ></p>
            </div>
          </div>
        </div>
      </section>

      <section class="text-gray-600 space-y-2">
        <p>Terima kasih telah berpartisipasi dalam ujian ini.</p>
        <p class="font-medium">
          Hasil akhir akan diumumkan oleh panitia sesuai jadwal.
        </p>
        <p>Silakan logout dari sistem untuk mengakhiri sesi Anda.</p>
      </section>

      {/* Footer */}
      <footer class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="/"
          class="inline-flex items-center justify-center bg-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Kembali ke Beranda
        </a>
        <a
          href="/"
          class="inline-flex items-center justify-center bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10a1 1 0 100-2H3zm12.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 13H9a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Logout
        </a>
      </footer>
    </main>
  );
};

export default Selesai;
