import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";
import { Progress } from "../ui/progress";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="relative z-50 flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#070B1D] px-5 py-6 lg:px-6 lg:py-8">
      <div className="mb-10">
        <Logo />
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h3 className="font-semibold">{user?.name}</h3>

        <p className="mt-1 text-sm text-slate-400">
          Level {user?.level}
        </p>

        <Progress value={65} className="mt-4" />

        <div className="mt-3 flex justify-between text-sm text-slate-400">
          <span>{user?.xp} XP</span>
          <span>🔥 {user?.streak}</span>
        </div>
      </div>
    </aside>
  );
}