"use client";

import type { Espace } from "@/data/espaces";
import { getEspaceIcon } from "@/lib/iconUtils";

interface EspaceCardProps {
  espace: Espace;
  index: number;
  onSelect: (index: number) => void;
}

export default function EspaceCard({
  espace,
  index,
  onSelect,
}: EspaceCardProps) {
  const IconComponent = getEspaceIcon(espace.iconName);

  return (
    <div
      className="group bg-gradient-to-br from-white to-muted/10 p-6 sm:p-8 rounded-2xl shadow-xl border border-muted/20 cursor-pointer hover:shadow-2xl transition-all duration-300"
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(index);
        }
      }}
      aria-label={`Voir les détails de ${espace.nom}`}
    >
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {espace.nom}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          {espace.caracteristiques.map((carac, idx) => (
            <span key={idx}>
              {carac}
              {idx < espace.caracteristiques.length - 1 && ","}{" "}
            </span>
          ))}
          .
        </p>
      </div>
    </div>
  );
}
