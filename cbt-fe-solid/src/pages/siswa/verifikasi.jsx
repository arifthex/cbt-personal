import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Icon } from "solid-heroicons";
import { check, informationCircle, exclamationTriangle, questionMarkCircle } from "solid-heroicons/solid";


export default function Verifikasi() {
  const [nama, setNama] = createSignal("");
  const [nomor, setNomor] = createSignal("");
  const [token, setToken] = createSignal("");
  const [status, setStatus] = createSignal("");
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  

  onMount(() => {
    const storedNama = localStorage.getItem("siswa_nama") || "";
    const storedNomor = localStorage.getItem("siswa_nomor") || "";
    const storedToken = localStorage.getItem("siswa_token") || "CBT2025";

    setNama(storedNama);
    setNomor(storedNomor);
    setToken(storedToken);

    // Cek validitas token (contoh: hardcode CBT2025)
    if (storedToken === "CBT2025") {
      setStatus("Token Valid");
    } else {
      setStatus("Token Tidak Valid");
    }
  });

  const handleStart = () => {
    setOpen(true);
  };

   const confirmStart = () => {
    setOpen(false);
     navigate("/Ujian"); 
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <main class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-3xl mx-auto">
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">
            Verifikasi Peserta & Tata Cara Ujian
            </h1>
            <p class="text-gray-500 mt-2">
            Silakan periksa kembali data Anda sebelum memulai ujian.
            </p>
        </header>

        {/* Data Peserta */}
        <section class="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <div class="grid md:grid-cols-2 gap-x-8 gap-y-5">
            <div>
                <label class="text-sm text-gray-500">Nama Peserta</label>
                <p class="text-lg font-semibold text-gray-900">{nama()}</p>
            </div>
            <div>
                <label class="text-sm text-gray-500">Nomor Peserta / NIS</label>
                <p class="text-lg font-semibold text-gray-900">{nomor()}</p>
            </div>
            <div>
                <label class="text-sm text-gray-500">Token Ujian</label>
                <p class="text-lg font-semibold text-gray-900">{token()}</p>
            </div>
            <div>
                <label class="text-sm text-gray-500">Status Token</label>
                <div class="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill={status() === "Token Valid" ? "green" : "red"}
                >
                    <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                    />
                </svg>
                <p
                    class={`text-lg font-semibold ${
                    status() === "Token Valid"
                        ? "text-emerald-500"
                        : "text-red-600"
                    }`}
                >
                    {status()}
                </p>
                </div>
            </div>
            </div>
        </section>

        {/* Tata Cara */}
        <section>
            <h2 class="text-xl font-bold text-gray-800 mb-4">Tata Cara Ujian</h2>
            <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
                <Icon path={informationCircle} class="w-6 h-6 text-blue-800 mr-3 flex-shrink-0" />
                <span>Bacalah setiap soal dengan seksama sebelum memilih jawaban.</span>
            </li>
            <li class="flex items-start">
                <Icon path={questionMarkCircle} class="w-6 h-6 text-blue-800 mr-3 flex-shrink-0" />
                <span>
                Waktu ujian akan berjalan otomatis setelah tombol "Mulai Ujian"
                ditekan.
                </span>
            </li>
            <li class="flex items-start">
                <Icon path={informationCircle} class="w-6 h-6 text-blue-800 mr-3 flex-shrink-0" />
                <span>
                Klik tombol "Ragu-ragu" jika Anda belum yakin pada jawaban yang
                dipilih.
                </span>
            </li>
            <li class="flex items-start">
                <Icon path={check} class="w-6 h-6 text-blue-800 mr-3 flex-shrink-0" />
                <span>
                Jawaban akan tersimpan secara otomatis saat Anda berpindah ke soal
                lain.
                </span>
            </li>
            <li class="flex items-start">
                <Icon path={exclamationTriangle} class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                <span>
                <strong>PENTING:</strong> Jangan keluar atau me-refresh halaman
                selama ujian berlangsung.
                </span>
            </li>
            </ul>
        </section>

        {/* Tombol */}
        <footer class="text-center mt-10">
            <button
            onClick={handleStart}
            class="bg-blue-800 text-white font-bold text-xl px-12 py-4 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400"
            >
            Mulai Ujian
            </button>
        </footer>

        {/* Modal Konfirmasi */}
        <Show when={open()}>
            <div class="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                    class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                ></div>

                {/* Modal Box */}
                <div class="relative bg-white rounded-xl shadow-xl p-6 w-80 animate-fade-in">
                    <h2 class="text-lg font-semibold mb-3 flex justify-center">Konfirmasi</h2>
                    <p class="text-sm text-gray-600 mb-5 text-center">
                    Anda yakin ingin memulai ujian? <br />
                    Waktu akan berjalan setelah Anda melanjutkan.
                    </p>

                    <div class="flex justify-center gap-3">
                        <button
                            onClick={() => setOpen(false)}
                            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmStart}
                            class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Ya, Mulai
                        </button>
                    </div>
                </div>
            </div>
        </Show>


        </main>
    </div>
  );
}
