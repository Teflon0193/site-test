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
      className="group bg-white p-6 sm:p-8 border border-zinc-200 cursor-pointer hover:border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-black transition-colors duration-300">
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black mb-3 group-hover:underline decoration-4 underline-offset-4 decoration-accent transition-all">
          {espace.nom}
        </h3>
        <p className="text-sm sm:text-base text-zinc-600 mb-0 font-medium">
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
