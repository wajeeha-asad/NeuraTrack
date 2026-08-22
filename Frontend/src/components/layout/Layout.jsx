import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-[#070B1D] via-[#0D1432] to-[#11193F] text-white">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-[#7C5CFC]/10 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#5AD8FF]/10 blur-[180px]" />

      {/* Sidebar */}
      <div className="relative z-50 hidden lg:block">
        <Sidebar />
      </div>

      {/* Main application */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}