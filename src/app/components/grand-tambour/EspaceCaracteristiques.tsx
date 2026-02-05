interface EspaceCaracteristiquesProps {
  caracteristiques: string[];
}

export default function EspaceCaracteristiques({
  caracteristiques,
}: EspaceCaracteristiquesProps) {
  return (
    <div className="bg-gradient-to-br from-white to-muted/20 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-muted/20">
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">
        Utilisation de l&apos;espace
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {caracteristiques.map((carac, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-3 justify-center sm:justify-start lg:justify-center bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 rounded-xl p-4 sm:p-3 lg:p-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/80 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></div>
            <span className="text-sm sm:text-base text-foreground text-center sm:text-left lg:text-center font-medium">
              {carac}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
