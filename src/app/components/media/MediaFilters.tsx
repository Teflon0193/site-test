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
      <div className="lg:sticky lg:top-24 xl:top-32 space-y-8 sm:space-y-10">
        {/* Search Bar */}
        <div>
          <div className="relative group">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors w-4 h-4 sm:w-5 sm:h-5"
              size={18}
            />
            <input
              type="text"
              placeholder="RECHERCHER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-zinc-200 py-2 pl-6 pr-0 focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300 text-sm font-bold uppercase tracking-wide"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 sm:mb-5">
            Catégories
          </h3>
          <div className="space-y-3">
            {MEDIA_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "w-4 h-4 border-2 border-zinc-300 rounded-none flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    selectedCategories.includes(category)
                      ? "bg-black border-black"
                      : "group-hover:border-black",
                  )}
                >
                  {selectedCategories.includes(category) && (
                    <div className="w-2 h-2 bg-white rounded-none" />
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
                    "text-sm uppercase tracking-wide transition-colors font-bold",
                    selectedCategories.includes(category)
                      ? "text-black"
                      : "text-zinc-500 group-hover:text-black",
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
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 sm:mb-5">
            Type d&apos;événement
          </h3>
          <div className="space-y-3">
            {EVENT_TYPES.map((eventType) => (
              <label
                key={eventType}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "w-4 h-4 border-2 border-zinc-300 rounded-none flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    selectedEventTypes.includes(eventType)
                      ? "bg-black border-black"
                      : "group-hover:border-black",
                  )}
                >
                  {selectedEventTypes.includes(eventType) && (
                    <div className="w-2 h-2 bg-white rounded-none" />
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
                    "text-sm uppercase tracking-wide transition-colors font-bold",
                    selectedEventTypes.includes(eventType)
                      ? "text-black"
                      : "text-zinc-500 group-hover:text-black",
                  )}
                >
                  {eventType}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
              Année
            </h3>
            <select
              value={selectedYear || ""}
              onChange={(e) => {
                setSelectedYear(
                  e.target.value ? parseInt(e.target.value) : null,
                );
              }}
              className="w-full bg-transparent border-b-2 border-zinc-200 py-2 text-sm font-bold uppercase focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none"
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
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
              Mois
            </h3>
            <select
              value={selectedMonth || ""}
              onChange={(e) => {
                setSelectedMonth(
                  e.target.value ? parseInt(e.target.value) : null,
                );
              }}
              className="w-full bg-transparent border-b-2 border-zinc-200 py-2 text-sm font-bold uppercase focus:outline-none focus:border-black transition-colors cursor-pointer rounded-none"
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
        <div className="pt-6 border-t-2 border-zinc-100">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            {resultsCount} {resultsCount === 1 ? "résultat" : "résultats"}
          </p>
        </div>
      </div>
    </aside>
  );
}
