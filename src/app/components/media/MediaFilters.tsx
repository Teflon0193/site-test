import { Search } from "lucide-react";
import {
  MEDIA_CATEGORIES,
  EVENT_TYPES,
  MONTHS,
  generateYears,
} from "@/lib/mediaUtils";
import { cn } from "@/lib/utils";

interface MediaFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  selectedEventTypes: string[];
  selectedYear: number | null;
  selectedMonth: number | null;
  toggleCategory: (category: string) => void;
  toggleEventType: (eventType: string) => void;
  setSelectedYear: (year: number | null) => void;
  setSelectedMonth: (month: number | null) => void;
  resultsCount: number;
}

export default function MediaFilters({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  selectedEventTypes,
  selectedYear,
  selectedMonth,
  toggleCategory,
  toggleEventType,
  setSelectedYear,
  setSelectedMonth,
  resultsCount,
}: MediaFiltersProps) {
  const years = generateYears(5);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-24 xl:top-32 space-y-6 sm:space-y-7 md:space-y-8">
        {/* Search Bar */}
        <div>
          <div className="relative group">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-border py-1.5 sm:py-2 pl-5 sm:pl-6 pr-0 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-xs sm:text-sm md:text-base"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
            Catégories
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            {MEDIA_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-0.5 sm:py-1"
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 border border-muted-foreground/40 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    selectedCategories.includes(category)
                      ? "bg-primary border-primary"
                      : "group-hover:border-primary"
                  )}
                >
                  {selectedCategories.includes(category) && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-foreground rounded-sm" />
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="hidden"
                />
                <span
                  className={cn(
                    "text-xs sm:text-sm transition-colors",
                    selectedCategories.includes(category)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Event Type Filters */}
        <div>
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
            Type d&apos;événement
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            {EVENT_TYPES.map((eventType) => (
              <label
                key={eventType}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-0.5 sm:py-1"
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 border border-muted-foreground/40 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    selectedEventTypes.includes(eventType)
                      ? "bg-primary border-primary"
                      : "group-hover:border-primary"
                  )}
                >
                  {selectedEventTypes.includes(eventType) && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-foreground rounded-sm" />
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes(eventType)}
                  onChange={() => toggleEventType(eventType)}
                  className="hidden"
                />
                <span
                  className={cn(
                    "text-xs sm:text-sm transition-colors",
                    selectedEventTypes.includes(eventType)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {eventType}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2">
              Année
            </h3>
            <select
              value={selectedYear || ""}
              onChange={(e) => {
                setSelectedYear(
                  e.target.value ? parseInt(e.target.value) : null
                );
              }}
              className="w-full bg-transparent border-b border-border py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Toutes</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2">
              Mois
            </h3>
            <select
              value={selectedMonth || ""}
              onChange={(e) => {
                setSelectedMonth(
                  e.target.value ? parseInt(e.target.value) : null
                );
              }}
              className="w-full bg-transparent border-b border-border py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Tous</option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-4 sm:pt-5 md:pt-6 border-t border-border">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            {resultsCount} {resultsCount === 1 ? "résultat" : "résultats"}
          </p>
        </div>
      </div>
    </aside>
  );
}
