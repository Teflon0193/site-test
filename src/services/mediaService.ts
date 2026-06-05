import { fetchFromStrapi } from "@/lib/strapi";
import { transformStrapiMedia } from "@/lib/strapi";
import { Media, MediaFilters } from "@/types/media";

const buildMediaQuery = (filters: MediaFilters): URLSearchParams => {
  const queryParams = new URLSearchParams();

  // Filtres de recherche
  if (filters.search) {
    queryParams.append("filters[$or][0][title][$containsi]", filters.search);
    queryParams.append(
      "filters[$or][1][description][$containsi]",
      filters.search
    );
    queryParams.append("filters[$or][2][location][$containsi]", filters.search);
    queryParams.append(
      "filters[$or][3][photographer][$containsi]",
      filters.search
    );
  }

  // Filtres par catégorie
  if (filters.category && filters.category !== "Tous") {
    queryParams.append("filters[category][$eq]", filters.category);
  }

  // Filtres par type d'événement
  if (filters.eventType && filters.eventType !== "Tous") {
    queryParams.append("filters[eventType][$eq]", filters.eventType);
  }

  // Filtres par année
  if (filters.year) {
    queryParams.append("filters[year][$eq]", filters.year.toString());
  }

  // Filtres par mois
  if (filters.month) {
    queryParams.append("filters[month][$eq]", filters.month.toString());
  }

  // Filtres par galerie
  if (filters.gallery) {
    queryParams.append("filters[gallery][$eq]", filters.gallery);
  }

  // Filtres par lieu
  if (filters.location) {
    queryParams.append("filters[location][$containsi]", filters.location);
  }

  // Filtres par photographe
  if (filters.photographer) {
    queryParams.append(
      "filters[photographer][$containsi]",
      filters.photographer
    );
  }

  // Filtres par tags
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag, index) => {
      queryParams.append(`filters[tags][$in][${index}]`, tag);
    });
  }

  // Filtres par featured
  if (filters.featured !== undefined) {
    queryParams.append("filters[featured][$eq]", filters.featured.toString());
  }

  // Paramètres globaux
  queryParams.append("populate", "image");
  queryParams.append("sort", filters.sort || "eventDate:desc");
  queryParams.append("pagination[pageSize]", (filters.limit || 12).toString());

  if (filters.page) {
    queryParams.append("pagination[page]", filters.page.toString());
  }

  return queryParams;
};

const fetchMediaFromStrapi = async (
  filters: MediaFilters = {}
): Promise<Media[]> => {
  try {
    const queryParams = buildMediaQuery(filters);
    const transformedData = await fetchFromStrapi(
      "media-galleries",
      queryParams,
      transformStrapiMedia
    );

    return transformedData;
  } catch (error) {
    // Si 403, retourner un tableau vide au lieu de lever une erreur
    if (error instanceof Error && error.message.includes("403")) {
      console.warn(
        "Permissions manquantes pour media, retour d'un tableau vide"
      );
      return [];
    }

    console.error("Erreur lors de la récupération des médias:", error);
    throw new Error(
      `Impossible de récupérer les médias: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Récupère tous les médias
 */
export const getMedia = async (filters?: MediaFilters): Promise<Media[]> => {
  return fetchMediaFromStrapi(filters);
};

/**
 * Récupère les médias mis en avant
 */
export const getFeaturedMedia = async (): Promise<Media[]> => {
  return fetchMediaFromStrapi({ featured: true });
};

/**
 * Récupère les médias par catégorie
 */
export const getMediaByCategory = async (
  category: string
): Promise<Media[]> => {
  return fetchMediaFromStrapi({ category });
};

/**
 * Récupère les médias par année
 */
export const getMediaByYear = async (year: number): Promise<Media[]> => {
  return fetchMediaFromStrapi({ year });
};

/**
 * Récupère les médias par galerie
 */
export const getMediaByGallery = async (gallery: string): Promise<Media[]> => {
  return fetchMediaFromStrapi({ gallery });
};

// Plus de fonction pour vider le cache : TanStack Query gère désormais le cache côté client
