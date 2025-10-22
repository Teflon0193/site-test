import { useState } from "react";

interface UseMediaFiltersReturn {
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
  resetFilters: () => void;
}

export const useMediaFilters = (): UseMediaFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Tous",
  ]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    "Tous",
  ]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    if (category === "Tous") {
      setSelectedCategories(["Tous"]);
    } else {
      setSelectedCategories((prev) => {
        const newCategories = prev.filter((c) => c !== "Tous");
        if (prev.includes(category)) {
          const filtered = newCategories.filter((c) => c !== category);
          return filtered.length === 0 ? ["Tous"] : filtered;
        } else {
          return [...newCategories, category];
        }
      });
    }
  };

  const toggleEventType = (eventType: string) => {
    if (eventType === "Tous") {
      setSelectedEventTypes(["Tous"]);
    } else {
      setSelectedEventTypes((prev) => {
        const newEventTypes = prev.filter((c) => c !== "Tous");
        if (prev.includes(eventType)) {
          const filtered = newEventTypes.filter((c) => c !== eventType);
          return filtered.length === 0 ? ["Tous"] : filtered;
        } else {
          return [...newEventTypes, eventType];
        }
      });
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories(["Tous"]);
    setSelectedEventTypes(["Tous"]);
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  return {
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
    resetFilters,
  };
};







