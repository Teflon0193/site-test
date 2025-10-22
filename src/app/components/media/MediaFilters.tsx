import { Search } from "lucide-react";
import {
  MEDIA_CATEGORIES,
  EVENT_TYPES,
  MONTHS,
  generateYears,
} from "@/lib/mediaUtils";

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
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Search Bar */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-foreground">
            Rechercher
          </h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-3 bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-foreground">
            Catégories
          </h3>
          <div className="space-y-2">
            {MEDIA_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 border-border text-primary focus:ring-primary/50 cursor-pointer rounded"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Event Type Filters */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-foreground">
            Type d&apos;événement
          </h3>
          <div className="space-y-2">
            {EVENT_TYPES.map((eventType) => (
              <label
                key={eventType}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
              >
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes(eventType)}
                  onChange={() => toggleEventType(eventType)}
                  className="w-4 h-4 border-border text-primary focus:ring-primary/50 cursor-pointer rounded"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {eventType}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-foreground">
            Année
          </h3>
          <select
            value={selectedYear || ""}
            onChange={(e) => {
              setSelectedYear(e.target.value ? parseInt(e.target.value) : null);
            }}
            className="w-full rounded-xl p-3 bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-foreground">
            Mois
          </h3>
          <select
            value={selectedMonth || ""}
            onChange={(e) => {
              setSelectedMonth(
                e.target.value ? parseInt(e.target.value) : null
              );
            }}
            className="w-full rounded-xl p-3 bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
          >
            <option value="">Tous les mois</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t border-muted/20">
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-bold text-primary text-lg">
                {resultsCount}
              </span>{" "}
              {resultsCount === 1 ? "résultat trouvé" : "résultats trouvés"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
