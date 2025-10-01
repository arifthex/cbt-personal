import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

// 1. Buat context
const ExamContext = createContext();

// 2. Provider
export function ExamProvider(props) {
  const [state, setState] = createStore({
    siswa: {
      nama: localStorage.getItem("siswa_nama") || "",
      nomor: localStorage.getItem("siswa_nomor") || "",
    },
    ujian: {
      questions: [],
      currentIndex: 0,
      timer: 3600, // detik
      status: "idle", // idle | running | finished
    },
  });

  // 3. Helper untuk update state
  const actions = {
    setNama: (nama) => {
      setState("siswa", "nama", nama);
      localStorage.setItem("siswa_nama", nama);
    },
    setNomor: (nomor) => {
      setState("siswa", "nomor", nomor);
      localStorage.setItem("siswa_nomor", nomor);
    },
    loadQuestions: (qs) => setState("ujian", "questions", qs),
    answerQuestion: (index, answer) =>
      setState("ujian", "questions", index, "answer", answer),
    nextQuestion: () =>
      setState("ujian", "currentIndex", state.ujian.currentIndex + 1),
    prevQuestion: () =>
      setState("ujian", "currentIndex", state.ujian.currentIndex - 1),
    startExam: () => setState("ujian", "status", "running"),
    finishExam: () => setState("ujian", "status", "finished"),
  };

  return (
    <ExamContext.Provider value={[state, actions]}>
      {props.children}
    </ExamContext.Provider>
  );
}

// 4. Hook custom supaya gampang dipanggil
export function useExam() {
  return useContext(ExamContext);
}
