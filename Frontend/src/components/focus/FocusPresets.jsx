import { focusPresets } from "../../data/focusData";

export default function FocusPresets({
  selectedMinutes,
  setSelectedMinutes,
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">

      {focusPresets.map((preset) => {
        const isActive =
          selectedMinutes === preset.minutes;

        return (
          <button
            key={preset.minutes}
            onClick={() =>
              setSelectedMinutes(preset.minutes)
            }
            className={`rounded-xl px-4 py-3 transition sm:px-5 ${
              isActive
                ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {preset.label}
          </button>
        );
      })}

    </div>
  );
}