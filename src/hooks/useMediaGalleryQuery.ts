// src/hooks/useMediaGalleryQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getMedia } from "@/services/mediaService";
import { Media, MediaFilters } from "@/types/media";

export const useMediaGalleryQuery = (filters: MediaFilters) => {
  return useQuery<Media[]>({
    queryKey: ["media", filters],
    queryFn: () => getMedia(filters),
    staleTime: 5 * 60 * 1000,
    // Ensure data is always an array
    placeholderData: [],
  });
};