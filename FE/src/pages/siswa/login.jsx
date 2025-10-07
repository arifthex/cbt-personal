import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function Login() {
  const [namaLengkap, setNamaLengkap] = createSignal("");
  const [nomorPeserta, setNomorPeserta] = createSignal("");
  const [tokenUjian, setTokenUjian] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!namaLengkap() || !nomorPeserta() || !tokenUjian()) {
      setError("Semua field wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (tokenUjian() === "CBT2025") {
        localStorage.setItem("siswa_nama", namaLengkap());
        localStorage.setItem("siswa_nomor", nomorPeserta());
        navigate("/verifikasi");
      } else {
        setError("Token ujian yang Anda masukkan salah.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-slate-100">
      <div class="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Selamat Datang di Ujian CBT</h1>
          <p class="text-gray-500 mt-2">
            Silakan masukkan data diri dan token ujian Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={namaLengkap()}
              onInput={(e) => setNamaLengkap(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nomor Peserta / NIS
            </label>
            <input
              type="text"
              value={nomorPeserta()}
              onInput={(e) => setNomorPeserta(e.target.value)}
              placeholder="Contoh: 2025001"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Token Ujian
            </label>
            <input
              type="text"
              value={tokenUjian()}
              onInput={(e) => setTokenUjian(e.target.value)}
              placeholder="Masukkan token"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition"
            />
          </div>

          {error() && (
            <div class="text-red-600 bg-red-100 p-3 rounded-lg text-sm font-medium">
              {error()}
            </div>
          )}

          <button
            type="submit"
            disabled={loading()}
            class="w-full flex justify-center items-center bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-blue-400"
          >
            {loading() ? (
              <>
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifikasi...
              </>
            ) : (
              "Verifikasi Token"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
