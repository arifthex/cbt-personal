import { Route } from "@solidjs/router";
import Login from "./pages/siswa/login";
import Verifikasi from "./pages/siswa/verifikasi";
import Ujian from "./pages/siswa/ujian";
import Selesai from "./pages/siswa/selesai";

export default function App() {
  return (
    <>
        <Route path="/" component={Login} />
        <Route path="/verifikasi" component={Verifikasi} />
        <Route path="/ujian" component={Ujian} />
        <Route path="/selesai" component={Selesai} />
    </>
  );
}
