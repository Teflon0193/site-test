import {
  buildStrapiQuery,
  transformStrapiEvent,
  fetchFromStrapi,
} from "@/lib/strapi";
import { Event, EventFilters, EventWithRegistrations } from "@/types/events";

const fetchEventsFromStrapi = async (
  filters: EventFilters = {}
): Promise<Event[]> => {
  try {
    const queryParams = buildStrapiQuery(filters);
    const transformedData = await fetchFromStrapi(
      "events",
      queryParams,
      transformStrapiEvent
    );

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
  publicTarget: string;
}): Promise<Event[]> => {
  return fetchEventsFromStrapi({
    month: filters.month,
    discipline: filters.discipline,
    public: filters.publicTarget,
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

/**
 * Récupère les événements avec inscription ouverte et leurs inscriptions
 * (Pour l'administration uniquement)
 */
export const getEventsWithRegistrations = async (): Promise<
  EventWithRegistrations[]
> => {
  try {
    const response = await fetch("/api/admin/events", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        text || `Erreur API admin (${response.status} ${response.statusText})`
      );
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements avec inscriptions:",
      error
    );
    throw new Error(
      `Impossible de récupérer les événements avec inscriptions: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};
