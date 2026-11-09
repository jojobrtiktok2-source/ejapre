import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BottomNav } from "./components/BottomNav";
import { useStore } from "./lib/store";
import Onboarding from "./pages/Onboarding";
import Inicio from "./pages/Inicio";
import Programa from "./pages/Programa";
import DiaPage from "./pages/Dia";
import Treinar from "./pages/Treinar";
import ExercicioPage from "./pages/Exercicio";
import Nutricao from "./pages/Nutricao";
import Receita from "./pages/Receita";
import Habitos from "./pages/Habitos";
import Aprender from "./pages/Aprender";
import Artigo from "./pages/Artigo";
import Progresso from "./pages/Progresso";
import Quiz from "./pages/Quiz";
import Ajustes from "./pages/Ajustes";
import Coach from "./pages/Coach";

export default function App() {
  const { onboarded } = useStore();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!onboarded && pathname !== "/boas-vindas" && pathname !== "/avaliacao") return <Navigate to="/boas-vindas" replace />;
  const semNav = ["/boas-vindas", "/avaliacao"].includes(pathname);

  return (
    <div className="mx-auto min-h-screen max-w-md px-4">
      <main className={semNav ? "" : "pb-safe"}>
        <Routes>
          <Route path="/boas-vindas" element={<Onboarding />} />
          <Route path="/avaliacao" element={<Quiz />} />
          <Route path="/" element={<Inicio />} />
          <Route path="/programa" element={<Programa />} />
          <Route path="/programa/:dia" element={<DiaPage />} />
          <Route path="/treinar" element={<Treinar />} />
          <Route path="/exercicio/:id" element={<ExercicioPage />} />
          <Route path="/nutricao" element={<Nutricao />} />
          <Route path="/receita/:id" element={<Receita />} />
          <Route path="/habitos" element={<Habitos />} />
          <Route path="/aprender" element={<Aprender />} />
          <Route path="/aprender/:id" element={<Artigo />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!semNav && <BottomNav />}
    </div>
  );
}
