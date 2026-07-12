import { useState, useEffect, useMemo } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { Media, MediaFilters } from "@/types/media";
import { useMediaGalleryQuery } from "./useMediaGalleryQuery";

interface UseMediaGalleryReturn {
  mediaItems: Media[];
  loading: boolean;
  error: string | null;
  filteredItems: Media[];
  totalPages: number;
  paginatedItems: Media[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: (
    options?: RefetchOptions & RefetchQueryFilters<Media[]>
  ) => Promise<QueryObserverResult<Media[], Error>>;
}

interface UseMediaGalleryProps {
  searchQuery: string;
  selectedCategories: string[];
  selectedEventTypes: string[];
  selectedYear: number | null;
  selectedMonth: number | null;
  itemsPerPage?: number;
}

export const useMediaGallery = ({
  searchQuery,
  selectedCategories,
  selectedEventTypes,
  selectedYear,
  selectedMonth,
  itemsPerPage = 12,
}: UseMediaGalleryProps): UseMediaGalleryReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  const filters: MediaFilters = {
    search: searchQuery || undefined,
    category: selectedCategories.includes("Tous")
      ? undefined
      : selectedCategories[0],
    eventType: selectedEventTypes.includes("Tous")
      ? undefined
      : selectedEventTypes[0],
    year: selectedYear || undefined,
    month: selectedMonth || undefined,
    limit: 100, // Charger plus d'éléments pour le filtrage côté client
  };

  const {
    data: mediaItems = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMediaGalleryQuery(filters);

  // Ensure mediaItems is always an array
  const safeMediaItems = Array.isArray(mediaItems) ? mediaItems : [];

  // Filtrage des éléments
  const filteredItems = useMemo(() => {
    // If there are no media items or not an array, return empty array
    if (!Array.isArray(safeMediaItems)) return [];
    return safeMediaItems.filter((item) => {
      const matchesCategory =
        selectedCategories.includes("Tous") ||
        selectedCategories.includes(item.category);
      const matchesEventType =
        selectedEventTypes.includes("Tous") ||
        selectedEventTypes.includes(item.eventType || "");
      const matchesSearch =
        (item.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location &&
          item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.photographer &&
          item.photographer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesEventType && matchesSearch;
    });
  }, [safeMediaItems, selectedCategories, selectedEventTypes, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    selectedEventTypes,
    selectedYear,
    selectedMonth,
  ]);

  return {
    mediaItems: safeMediaItems,
    loading: isLoading,
    error: isError ? (error as Error | null)?.message ?? null : null,
    filteredItems,
    totalPages,
    paginatedItems,
    currentPage,
    setCurrentPage,
    refetch,
  };
};