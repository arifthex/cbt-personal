import { createSignal, onMount, For, Show } from "solid-js";

export default function Ujian() {
  // --- DATA SOAL (SAMPLE) ---
  const initialQuestions = [
    {
      id: 1,
      stimulus: `<p class="font-semibold">Dialog for question 1 & 2.</p>
        <p>Mita: Excuse me, could you tell me where the nearest post office is?</p>
        <p>John: Sure. It's just around the corner, next to the bank.</p>
        <p>Mita: Thank you so much!</p>`,
      question: "What is the best expression used to answer Mita’s question?",
      options: [
        "Excuse me",
        "Thank you so much!",
        "Sure. It's just around the corner.",
        "Could you tell me...",
        "The nearest post office",
      ],
      answer: null,
      state: "unanswered",
    },
    {
      id: 2,
      stimulus: `<p class="font-semibold">Dialog for question 1 & 2.</p>
        <p>Mita: Excuse me, could you tell me where the nearest post office is?</p>
        <p>John: Sure. It's just around the corner, next to the bank.</p>
        <p>Mita: Thank you so much!</p>`,
      question: "What does Mita express her gratitude with?",
      options: [
        "Excuse me",
        "Thank you so much!",
        "Just around the corner",
        "Next to the bank",
        "I don't know",
      ],
      answer: null,
      state: "unanswered",
    },
    {
      id: 3,
      stimulus: null,
      question: "Which of the following sentences is grammatically correct?",
      options: [
        "She go to school every day.",
        "They is playing football now.",
        "He have a new car.",
        "I am a student.",
        "We does not like homework.",
      ],
      answer: null,
      state: "unanswered",
    },
  ];

  // Tambah dummy 36 soal
  for (let i = 4; i <= 36; i++) {
    initialQuestions.push({
      id: i,
      stimulus: null,
      question: `Ini adalah contoh pertanyaan untuk soal nomor ${i}.`,
      options: [
        `Pilihan A untuk soal ${i}`,
        `Pilihan B untuk soal ${i}`,
        `Pilihan C untuk soal ${i}`,
        `Pilihan D untuk soal ${i}`,
        `Pilihan E untuk soal ${i}`,
      ],
      answer: null,
      state: "unanswered",
    });
  }

  // --- STATE ---
  const [questions, setQuestions] = createSignal(initialQuestions);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [timeLeft, setTimeLeft] = createSignal(3600); // 1 jam
  const [nama, setNama] = createSignal(""); //Local storage
  const [nomor, setNomor] = createSignal("");

//   Get Name local
  onMount(() => {
    // Ambil nama dari localStorage
    const storedNama = localStorage.getItem("siswa_nama") || "";
    const storedNomor = localStorage.getItem("siswa_nomor") || "";

    if (storedNama) {
        setNama(storedNama);
        setNomor(storedNomor);
    }
  });

  // --- TIMER ---
  onMount(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          alert("Waktu habis!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  });

  const formatTime = () => {
    const minutes = Math.floor(timeLeft() / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft() % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // --- HANDLER ---
  const selectAnswer = (optionIndex) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex()] = {
        ...copy[currentIndex()],
        answer: optionIndex,
        state:
          copy[currentIndex()].state === "doubtful"
            ? "doubtful"
            : "answered",
      };
      return copy;
    });
  };

  const toggleDoubt = () => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = copy[currentIndex()];
      copy[currentIndex()] = {
        ...q,
        state: q.state === "doubtful"
          ? (q.answer !== null ? "answered" : "unanswered")
          : "doubtful",
      };
      return copy;
    });
  };

  const optionChars = ["A", "B", "C", "D", "E"];

  // --- RENDER ---
  return (
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <header class="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
             {nama().charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 class="font-semibold text-gray-800">{nama()}</h1>
            <p class="text-sm text-gray-500"> {nomor() ? `${nomor()}` : "Tidak Ada NIS Siswa"}</p>
          </div>
        </div>
        <button class="bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-4 py-2 rounded-lg transition-colors">
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOAL */}
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col">
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-xl font-bold text-gray-800">
                Soal No. {questions()[currentIndex()].id}
              </h2>
              <div class="text-lg font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                {formatTime()}
              </div>
            </div>

            <div class="space-y-5">
              <Show when={questions()[currentIndex()].stimulus}>
                <div
                  class="prose max-w-none p-4 bg-gray-50 rounded-lg border"
                  innerHTML={questions()[currentIndex()].stimulus}
                />
              </Show>

              <p class="text-gray-800 font-medium text-lg"
                 innerHTML={questions()[currentIndex()].question} />

              <div class="space-y-3">
                <For each={questions()[currentIndex()].options}>
                  {(opt, i) => (
                    <label
                      class={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        questions()[currentIndex()].answer === i()
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="option"
                        checked={questions()[currentIndex()].answer === i()}
                        onChange={() => selectAnswer(i())}
                        class="sr-only"
                      />
                      <span class="font-bold mr-4">{optionChars[i()]}</span>
                      <span class="flex-1">{opt}</span>
                    </label>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* NAV BUTTONS */}
          <div class="border-t mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              disabled={currentIndex() === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              class="bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              &larr; Soal Sebelumnya
            </button>
            <button
              onClick={toggleDoubt}
              class={`font-semibold px-6 py-3 rounded-lg transition-colors ${
                questions()[currentIndex()].state === "doubtful"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
              }`}
            >
              {questions()[currentIndex()].state === "doubtful"
                ? "Hilangkan Tanda Ragu"
                : "Tandai Ragu-Ragu"}
            </button>
            <button
              disabled={currentIndex() === questions().length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              class="bg-blue-500 text-white hover:bg-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Soal Selanjutnya &rarr;
            </button>
            <button class="w-full bg-green-600 text-white hover:bg-cyan-600 font-bold px-6 py-3 rounded-lg transition-colors">
              Selesaikan Ujian
            </button>
          </div>
        </div>

        {/* NAVIGASI SOAL */}
        <aside class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="font-bold text-lg text-gray-800 mb-4 border-b pb-3">
            Navigasi Soal
          </h3>
          <div class="grid grid-cols-5 sm:grid-cols-6 gap-2">
            <For each={questions()}>
              {(q, i) => (
                <button
                  onClick={() => setCurrentIndex(i())}
                  class={`w-10 h-10 flex items-center justify-center font-semibold rounded-md transition-colors ${
                    q.state === "answered"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : q.state === "doubtful"
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  } ${i() === currentIndex() ? "ring-2 ring-blue-500" : ""}`}
                >
                  {q.id}
                </button>
              )}
            </For>
          </div>

          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 bg-green-500 rounded" />
              <span>Sudah Dijawab</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 bg-yellow-400 rounded" />
              <span>Ragu-ragu</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 bg-gray-200 rounded" />
              <span>Belum Dijawab</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 bg-blue-500 ring-2 ring-blue-300 rounded" />
              <span>Posisi Saat Ini</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
