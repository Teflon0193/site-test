"use client";

import { useQuery } from "@tanstack/react-query";
import type { Media, MediaFilters } from "@/types/media";
import { getMedia } from "@/services/mediaService";

export const useMediaGalleryQuery = (filters: MediaFilters) =>
  useQuery<Media[], Error>({
    queryKey: ["media", filters],
    queryFn: () => getMedia(filters),
  });
