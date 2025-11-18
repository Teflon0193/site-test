import { getMonthNumber } from "./utils";
import { STRAPI_BASE_URL, STRAPI_TOKEN } from "./constant";
import { generateUniqueSlug } from "./slugify";
import { Event, StrapiEvent, EventFilters } from "@/types/events";
import { HeroSlide, StrapiHeroSlide } from "@/types/hero-slide";
import { Media, StrapiMedia } from "@/types/media";

export const buildStrapiQuery = (filters: EventFilters): URLSearchParams => {
  const queryParams = new URLSearchParams();

  // Filtres de base
  if (filters.upcoming) {
    const today = new Date().toISOString().split("T")[0];
    queryParams.append("filters[startDate][$gte]", today);
  }

  if (filters.featured) {
    queryParams.append("filters[featured][$eq]", "true");
    queryParams.append("filters[createdAt][$notNull]", "true");
  }

  // Filtres utilisateur - Filtrage par mois
  if (filters.month && filters.month !== "Tous") {
    const monthNumber = getMonthNumber(filters.month);
    if (monthNumber) {
      // Approche alternative: utiliser $gte et $lt pour une plage de dates
      const year = new Date().getFullYear();
      const startDate = `${year}-${monthNumber}-01`;
      const nextMonth =
        monthNumber === "12"
          ? "01"
          : String(parseInt(monthNumber) + 1).padStart(2, "0");
      const nextYear = monthNumber === "12" ? year + 1 : year;
      const endDate = `${nextYear}-${nextMonth}-01`;

      queryParams.append("filters[startDate][$gte]", startDate);
      queryParams.append("filters[startDate][$lt]", endDate);
    }
  }

  if (filters.discipline && filters.discipline !== "Tous") {
    queryParams.append("filters[discipline][$eq]", filters.discipline);
  }

  if (filters.public && filters.public !== "Tous") {
    queryParams.append("filters[public][$eq]", filters.public);
  }

  if (filters.slug) {
    queryParams.append("filters[slug][$eq]", filters.slug);
    queryParams.append("populate", "image");
  }

  // Paramètres globaux
  queryParams.append("populate", "image");
  queryParams.append("sort", "startDate:asc");

  if (filters.limit) {
    queryParams.append("pagination[limit]", filters.limit.toString());
  }

  return queryParams;
};

// Fonction générique pour faire des requêtes Strapi
export const fetchFromStrapi = async <T>(
  endpoint: string,
  queryParams: URLSearchParams,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformFunction: (data: any) => T
): Promise<T[]> => {
  const url = `${STRAPI_BASE_URL}/api/${endpoint}?${queryParams.toString()}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Erreur API Strapi: ${response.status} - ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data.map(transformFunction);
};

export const transformStrapiEvent = (strapiEvent: StrapiEvent): Event => {
  return {
    id: strapiEvent.id,
    title: strapiEvent.title,
    slug: strapiEvent.slug || generateUniqueSlug(strapiEvent.title),
    startDate: strapiEvent.startDate,
    endDate: strapiEvent.endDate,
    startTime: strapiEvent.startTime,
    endTime: strapiEvent.endTime,
    location: strapiEvent.location,
    discipline: strapiEvent.discipline,
    public: strapiEvent.public,
    description: strapiEvent.description,
    image: (strapiEvent.image?.formats?.large as { url: string })?.url || "",
    capacity: strapiEvent.capacity,
    featured: strapiEvent.featured || false,
    category: strapiEvent.category,
    objective: strapiEvent.objective,
    targetAudience: strapiEvent.targetAudience,
    impact: strapiEvent.impact,
    slogan: strapiEvent.slogan,
    organizer: strapiEvent.organizer || "",
    contact: strapiEvent.contact,
    requirements: strapiEvent.requirements,
    accessibility: strapiEvent.accessibility,
    tags: strapiEvent.tags || [],
    // Propriétés de compatibilité pour le code existant
    date: strapiEvent.startDate,
    time: strapiEvent.startTime,
  };
};

export const transformStrapiHeroSlide = (
  strapiSlide: StrapiHeroSlide
): HeroSlide => {
  return {
    id: strapiSlide.id,
    title: strapiSlide.title,
    subtitle: strapiSlide.subtitle,
    description: strapiSlide.description,
    buttonText: strapiSlide.buttonText || "En savoir plus",
    buttonLink: strapiSlide.buttonLink || "/",
    image: strapiSlide.image?.url || "",
    order: strapiSlide.order || 0,
    isActive: strapiSlide.isActive !== false,
    createdAt: strapiSlide.createdAt,
    updatedAt: strapiSlide.updatedAt,
    publishedAt: strapiSlide.publishedAt,
  };
};

export const transformStrapiMedia = (strapiMedia: StrapiMedia): Media => {
  return {
    id: strapiMedia.id,
    title: strapiMedia.title,
    description: strapiMedia.description,
    image: strapiMedia.image?.url || "",
    eventDate: strapiMedia.eventDate,
    category: strapiMedia.category,
    eventType: strapiMedia.eventType,
    location: strapiMedia.location,
    photographer: strapiMedia.photographer,
    tags: strapiMedia.tags || [],
    featured: strapiMedia.featured || false,
    gallery: strapiMedia.gallery,
    year: strapiMedia.year,
    month: strapiMedia.month,
    createdAt: strapiMedia.createdAt,
    updatedAt: strapiMedia.updatedAt,
    publishedAt: strapiMedia.publishedAt,
  };
};
