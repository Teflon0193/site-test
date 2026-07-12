// src/services/heroSlideService.ts
import api from "@/lib/api";
import { HeroSlide } from "@/types/hero-slide";

/**
 * Récupère tous les slides actifs du hero depuis le backend Express
 */
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const res = await api.get("/hero-slides");
    // Ensure we return an array even if backend returns null/undefined
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    // Any error (404, 403, network, etc.) returns an empty array
    console.warn("Hero slides not available, returning empty array:", error);
    return [];
  }
};