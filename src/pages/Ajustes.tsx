import { Link } from "react-router-dom";
import { ChevronRight, Download, Trash2 } from "lucide-react";
import { Header, Secao } from "@/components/ui";
import { useStore } from "@/lib/store";

function Alternar({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between p-4">
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-accent" : "bg-surface-2"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export default function Ajustes() {
  const s = useStore();

  const exportar = () => {
    const raw = localStorage.getItem("dominio:v1") ?? "{}";
    const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "dominio-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const apagar = () => {
    if (confirm("Apagar todos os seus dados deste aparelho? Isso não pode ser desfeito.")) s.resetar();
  };

  return (
    <div className="animate-fade-up">
      <Header titulo="Ajustes" />
      <div className="card p-4">
        <label className="label">Seu nome</label>
        <input value={s.nome} onChange={(e) => s.set({ nome: e.target.value })} className="mt-2 w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 outline-none focus:border-accent" />
      </div>

      <Secao titulo="Treino">
        <div className="card divide-y divide-line">
          <Alternar label="Sons do cronômetro" on={s.som} onChange={(v) => s.set({ som: v })} />
          <Alternar label="Vibração" on={s.vibrar} onChange={(v) => s.set({ vibrar: v })} />
        </div>
      </Secao>

      <Secao titulo="Conteúdo">
        <div className="card divide-y divide-line">
          <Link to="/aprender" className="flex items-center justify-between p-4">Artigos <ChevronRight size={18} className="text-muted" /></Link>
          <Link to="/avaliacao" className="flex items-center justify-between p-4">Refazer autoavaliação <ChevronRight size={18} className="text-muted" /></Link>
          <Link to="/aprender/quando-medico" className="flex items-center justify-between p-4">Quando procurar um médico <ChevronRight size={18} className="text-muted" /></Link>
        </div>
      </Secao>

      <Secao titulo="Seus dados">
        <div className="card divide-y divide-line">
          <button onClick={exportar} className="flex w-full items-center gap-3 p-4"><Download size={18} className="text-accent" /> Exportar backup</button>
          <button onClick={apagar} className="flex w-full items-center gap-3 p-4 text-danger"><Trash2 size={18} /> Apagar todos os dados</button>
        </div>
        <p className="mt-2 text-xs text-muted">Tudo fica salvo apenas neste aparelho.</p>
      </Secao>

      <Secao titulo="Sobre">
        <div className="card space-y-3 p-4 text-xs leading-relaxed text-muted">
          <p>O Domínio é um app educativo de bem-estar. Ele não faz diagnóstico nem substitui o acompanhamento de um urologista, fisioterapeuta pélvico ou terapeuta sexual.</p>
          <p>Imagens dos exercícios de corpo e alongamento: free-exercise-db (github.com/yuhonas/free-exercise-db), domínio público.</p>
          <p>Versão 0.1.0</p>
        </div>
      </Secao>
    </div>
  );
}
