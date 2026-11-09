import { NavLink } from "react-router-dom";
import { Home, Dumbbell, Salad, ListChecks, LineChart, MessageCircle } from "lucide-react";

const itens = [
  { to: "/", label: "Início", icon: Home },
  { to: "/treinar", label: "Treinar", icon: Dumbbell },
  { to: "/coach", label: "Especialista", icon: MessageCircle, destaque: true },
  { to: "/nutricao", label: "Nutrição", icon: Salad },
  { to: "/habitos", label: "Hábitos", icon: ListChecks },
  { to: "/progresso", label: "Progresso", icon: LineChart },
];

export function BottomNav() {
  return (
    <nav className="menu-inferior fixed inset-x-0 bottom-0 z-30 px-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}>
      <div className="mx-auto flex max-w-md rounded-2xl border border-white/[0.07] bg-surface/85 p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl">
        {itens.map(({ to, label, icon: Icon, destaque }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition ${
                isActive ? "bg-accent/15 text-accent" : destaque ? "text-accent" : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {destaque && !isActive ? (
                  <span className="grid h-[21px] w-[21px] place-items-center">
                    <Icon size={21} strokeWidth={2.2} className="drop-shadow-[0_0_6px_rgb(45_212_191/0.7)]" />
                  </span>
                ) : (
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
                )}
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
