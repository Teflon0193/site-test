import {
  generateCacheKey,
  getCachedEventData,
  setCachedEventData,
} from "@/lib/cacheData";
import {
  buildStrapiQuery,
  transformStrapiEvent,
  fetchFromStrapi,
} from "@/lib/strapi";
import { Event, EventFilters } from "@/types/events";

const fetchEventsFromStrapi = async (
  filters: EventFilters = {}
): Promise<Event[]> => {
  const cacheKey = generateCacheKey(filters);

  // Vérifier le cache
  const cachedData = getCachedEventData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const queryParams = buildStrapiQuery(filters);
    const transformedData = await fetchFromStrapi(
      "events",
      queryParams,
      transformStrapiEvent
    );

    // Mettre en cache
    setCachedEventData(cacheKey, transformedData);

    return transformedData;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    throw new Error(
      `Impossible de récupérer les événements: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Récupère tous les événements depuis Strapi
 */
export const getEvents = async (): Promise<Event[]> => {
  return fetchEventsFromStrapi();
};

/**
 * Récupère les événements mis en avant
 */
export const getFeaturedEvents = async (): Promise<Event[]> => {
  return fetchEventsFromStrapi({ featured: true });
};

/**
 * Récupère les prochains événements (futurs uniquement)
 */
export const getUpcomingEvents = async (limit?: number): Promise<Event[]> => {
  return fetchEventsFromStrapi({ upcoming: true, limit });
};

/**
 * Récupère les événements avec filtres personnalisés
 */
export const getFilteredEvents = async (filters: {
  month: string;
  discipline: string;
  public: string;
}): Promise<Event[]> => {
  return fetchEventsFromStrapi({
    month: filters.month,
    discipline: filters.discipline,
    public: filters.public,
  });
};

/**
 * Récupère un événement par son slug
 */
export const getEventBySlug = async (slug: string): Promise<Event[] | []> => {
  return fetchEventsFromStrapi({ slug });
};

/**
 * Récupère les événements par discipline
 */
export const getEventsByDiscipline = async (
  discipline: string
): Promise<Event[]> => {
  return fetchEventsFromStrapi({ discipline });
};

/**
 * Récupère les événements par catégorie
 */
export const getEventsByCategory = async (
  category: string
): Promise<Event[]> => {
  return fetchEventsFromStrapi({ category });
};
