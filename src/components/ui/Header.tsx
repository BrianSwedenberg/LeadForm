export default function Header() {
  return (
    <header className="shrink-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_4px_12px_rgba(26,28,28,0.05)]">
      <div className="flex items-center justify-between px-6 h-14 w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface text-xl">water_drop</span>
          <span className="font-headline font-extrabold uppercase tracking-widest text-xs text-on-surface">
            Willow Water
          </span>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="text-on-surface hover:bg-surface-container p-1.5 rounded-full transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      <div className="bg-surface-container-high h-px w-full" />
    </header>
  )
}
