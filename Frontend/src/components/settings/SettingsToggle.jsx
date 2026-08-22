export default function SettingsToggle({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() =>
        onChange(!checked)
      }
      className={`relative h-7 w-12 rounded-full transition ${
        checked
          ? "bg-gradient-to-r from-[#8093F1] to-[#B388EB]"
          : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}