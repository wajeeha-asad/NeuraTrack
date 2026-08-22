import logo from "../../assets/logo/neuratrack-logo.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="NeuraTrack Logo"
        className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
      />

      <div className="leading-tight">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
          <span className="text-white">Neura</span>
          <span className="bg-gradient-to-r from-[#72DDF7] via-[#8093F1] to-[#B388EB] bg-clip-text text-transparent">
            Track
          </span>
        </h1>

        <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-[#9CA3AF]">
          Track • Learn • Grow
        </p>
      </div>
    </div>
  );
}