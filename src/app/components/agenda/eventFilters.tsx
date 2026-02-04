"use client";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { FilterState } from "../../../hooks/useEventFilters";
import { filterOptions } from "../../../data/events";
import { FaXmark } from "react-icons/fa6";

interface EventFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  eventCount?: number;
}

// Fonction utilitaire définie en dehors du composant pour éviter les recréations
const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function EventFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  eventCount,
}: EventFiltersProps) {
  // Vérification de sécurité pour filterOptions
  if (
    !filterOptions ||
    !filterOptions.months ||
    !filterOptions.disciplines ||
    !filterOptions.publics
  ) {
    console.error("filterOptions est invalide");
    return null;
  }

  return (
    <section className="py-12 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="mb-8 lg:mb-0 max-w-sm">
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">
              Filtrer
            </h2>
            <div className="w-12 h-1 bg-accent mb-4" />

            {/* Results Count */}
            {eventCount !== undefined && (
              <div className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                <span className="text-black text-lg mr-2">{eventCount}</span>
                {eventCount === 1 ? "résultat" : "résultats"}
              </div>
            )}
          </div>

          <div className="flex-1 w-full lg:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Month */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Mois
                </label>
                <Select
                  value={filters.month}
                  onValueChange={(value) => onFilterChange("month", value)}
                >
                  <SelectTrigger
                    id="filter-month"
                    className="w-full bg-white border-b-2 border-zinc-200 rounded-none px-0 py-2 focus:ring-0 focus:border-black transition-colors font-bold text-sm"
                  >
                    <SelectValue placeholder="TOUS" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-black">
                    {filterOptions.months.map((month) => (
                      <SelectItem
                        key={month}
                        value={month}
                        className="rounded-none hover:bg-zinc-100 uppercase text-xs font-bold"
                      >
                        {capitalizeFirst(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Discipline */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Discipline
                </label>
                <Select
                  value={filters.discipline}
                  onValueChange={(value) => onFilterChange("discipline", value)}
                >
                  <SelectTrigger
                    id="filter-discipline"
                    className="w-full bg-white border-b-2 border-zinc-200 rounded-none px-0 py-2 focus:ring-0 focus:border-black transition-colors font-bold text-sm"
                  >
                    <SelectValue placeholder="TOUTES" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-black">
                    {filterOptions.disciplines.map((discipline) => (
                      <SelectItem
                        key={discipline}
                        value={discipline}
                        className="rounded-none hover:bg-zinc-100 uppercase text-xs font-bold"
                      >
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Public */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Public
                </label>
                <Select
                  value={filters.publicTarget}
                  onValueChange={(value) =>
                    onFilterChange("publicTarget", value)
                  }
                >
                  <SelectTrigger
                    id="filter-public"
                    className="w-full bg-white border-b-2 border-zinc-200 rounded-none px-0 py-2 focus:ring-0 focus:border-black transition-colors font-bold text-sm"
                  >
                    <SelectValue placeholder="TOUS" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-black">
                    {filterOptions.publics.map((publicType) => (
                      <SelectItem
                        key={publicType}
                        value={publicType}
                        className="rounded-none hover:bg-zinc-100 uppercase text-xs font-bold"
                      >
                        {publicType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Clear Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={onClearFilters}
                  className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-white hover:bg-red-600 rounded-none h-auto py-2 px-4 transition-colors"
                >
                  <FaXmark className="mr-2" />
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
