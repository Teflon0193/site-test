import { Event } from "@/types/events";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T = Event[]> {
  data: T;
  timestamp: number;
  key: string;
}

// ==============================
// SYSTÈME DE CACHE
// ==============================

const eventCache = new Map<string, CacheEntry<Event[]>>();

export const generateCacheKey = (params: Record<string, unknown>): string => {
  return JSON.stringify(params, Object.keys(params).sort());
};

// Fonctions génériques pour le cache
export const getCachedData = <T>(
  cacheKey: string,
  cache: Map<string, CacheEntry<T>>
): T | null => {
  const cached = cache.get(cacheKey);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(cacheKey);
    return null;
  }

  return cached.data;
};

export const setCachedData = <T>(
  cacheKey: string,
  data: T,
  cache: Map<string, CacheEntry<T>>
): void => {
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    key: cacheKey,
  });
};

// Fonctions spécifiques pour les événements (rétrocompatibilité)
export const getCachedEventData = (cacheKey: string): Event[] | null => {
  return getCachedData(cacheKey, eventCache);
};

export const setCachedEventData = (cacheKey: string, data: Event[]): void => {
  setCachedData(cacheKey, data, eventCache);
};

// Fonction pour vider le cache (utile pour le debug)
export const clearEventCache = (): void => {
  eventCache.clear();
};
