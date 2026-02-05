interface EspaceCaracteristiquesProps {
  caracteristiques: string[];
}

export default function EspaceCaracteristiques({
  caracteristiques,
}: EspaceCaracteristiquesProps) {
  return (
    <div className="bg-zinc-50 border-t border-b border-zinc-200 py-8 sm:py-10">
      <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mb-8 text-center">
        Utilisation de l&apos;espace
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {caracteristiques.map((carac, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-4 justify-start bg-white border border-zinc-200 p-4 hover:border-black transition-colors duration-300"
          >
            <div className="w-2 h-2 bg-black flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
            <span className="text-sm font-bold uppercase tracking-wide text-black">
              {carac}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
