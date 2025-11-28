"use client";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import type { FilterState } from "../../../hooks/useEventFilters";
import { filterOptions, DEFAULT_FILTER_VALUE } from "../../../data/events";
import { FaCalendar, FaPalette, FaUsers, FaXmark } from "react-icons/fa6";

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
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/5 via-background to-muted/10 border-b border-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Filtrer les événements
          </h2>

          {/* Results Count */}
          {eventCount !== undefined && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl border border-primary/20 shadow-lg">
              <span className="text-sm sm:text-base text-foreground">
                <span className="font-bold text-primary text-lg sm:text-xl">
                  {eventCount}
                </span>{" "}
                {eventCount === 1 ? "événement trouvé" : "événements trouvés"}
              </span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-muted/10 rounded-2xl border border-muted/20 p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters */}
            <div className="flex rounded-xl flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
              <div className="space-y-3 flex-1 min-w-0">
                <label
                  htmlFor="filter-month"
                  className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaCalendar className="w-4 h-4 text-primary" />
                  </div>
                  Mois
                </label>
                <Select
                  value={filters.month}
                  onValueChange={(value) => onFilterChange("month", value)}
                >
                  <SelectTrigger
                    id="filter-month"
                    className="w-full bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-11 sm:h-12 transition-all duration-300"
                  >
                    <SelectValue placeholder="Sélectionner un mois" />
                  </SelectTrigger>
                  <SelectContent className="border-muted/30 rounded-xl">
                    {filterOptions.months.map((month) => (
                      <SelectItem
                        key={month}
                        value={month}
                        className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg"
                      >
                        {capitalizeFirst(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 flex-1 min-w-0">
                <label
                  htmlFor="filter-discipline"
                  className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaPalette className="w-4 h-4 text-primary" />
                  </div>
                  Discipline
                </label>
                <Select
                  value={filters.discipline}
                  onValueChange={(value) => onFilterChange("discipline", value)}
                >
                  <SelectTrigger
                    id="filter-discipline"
                    className="w-full bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-11 sm:h-12 transition-all duration-300"
                  >
                    <SelectValue placeholder="Sélectionner une discipline" />
                  </SelectTrigger>
                  <SelectContent className="border-muted/30 rounded-xl">
                    {filterOptions.disciplines.map((discipline) => (
                      <SelectItem
                        key={discipline}
                        value={discipline}
                        className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg"
                      >
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 flex-1 min-w-0">
                <label
                  htmlFor="filter-public"
                  className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaUsers className="w-4 h-4 text-primary" />
                  </div>
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
                    className="w-full bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-11 sm:h-12 transition-all duration-300"
                  >
                    <SelectValue placeholder="Sélectionner un public" />
                  </SelectTrigger>
                  <SelectContent className="border-muted/30 rounded-xl">
                    {filterOptions.publics.map((publicType) => (
                      <SelectItem
                        key={publicType}
                        value={publicType}
                        className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg"
                      >
                        {publicType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:min-w-fit">
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {filters.month !== DEFAULT_FILTER_VALUE && (
                  <Badge className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/30 px-3 py-1 rounded-full">
                    <FaCalendar className="w-3 h-3 mr-1" />
                    {capitalizeFirst(filters.month)}
                  </Badge>
                )}
                {filters.discipline !== DEFAULT_FILTER_VALUE && (
                  <Badge className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/30 px-3 py-1 rounded-full">
                    <FaPalette className="w-3 h-3 mr-1" />
                    {filters.discipline}
                  </Badge>
                )}
                {filters.publicTarget !== DEFAULT_FILTER_VALUE && (
                  <Badge className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/30 px-3 py-1 rounded-full">
                    <FaUsers className="w-3 h-3 mr-1" />
                    {filters.publicTarget}
                  </Badge>
                )}
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="border-2 border-destructive/30 text-destructive rounded-xl cursor-pointer hover:bg-destructive hover:text-white bg-transparent transition-all duration-300 hover:scale-105 px-4 py-2"
                >
                  <FaXmark className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
