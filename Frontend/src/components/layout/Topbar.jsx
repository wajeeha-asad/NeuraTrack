import { Bell, Menu, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import Logo from "../common/Logo";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#090B1F]/90 px-4 backdrop-blur-md sm:px-6">

      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[280px] border-r border-white/10 bg-[#070B1D] p-0 text-white"
        >
          <SheetHeader className="border-b border-white/10 px-5 py-6">
            <SheetTitle className="text-white">
              <Logo />
            </SheetTitle>
          </SheetHeader>

          <nav className="space-y-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] text-white"
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
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:max-w-md lg:max-w-xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <Input
          placeholder="Search..."
          className="h-10 w-full pl-10"
        />
      </div>

      {/* Notifications */}
      <button
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5"
        aria-label="Notifications"
      >
        <Bell size={19} />
      </button>
    </header>
  );
}