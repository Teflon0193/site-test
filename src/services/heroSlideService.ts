import { fetchFromStrapi } from "@/lib/strapi";
import { transformStrapiHeroSlide } from "@/lib/strapi";
import { HeroSlide } from "@/types/hero-slide";

const fetchHeroSlidesFromStrapi = async (): Promise<HeroSlide[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("filters[isActive][$eq]", "true");
    queryParams.append("populate", "image");
    queryParams.append("sort", "order:asc,createdAt:desc");
    queryParams.append("pagination[limit]", "10");

    const transformedData = await fetchFromStrapi(
      "hero-slides",
      queryParams,
      transformStrapiHeroSlide
    );

    return transformedData;
  } catch (error) {
    // Si 403, retourner un tableau vide au lieu de lever une erreur
    if (error instanceof Error && error.message.includes("403")) {
      console.warn(
        "Permissions manquantes pour hero-slides, retour d'un tableau vide"
      );
      return [];
    }

    console.error("Erreur lors de la récupération des slides du hero:", error);
    throw new Error(
      `Impossible de récupérer les slides du hero: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Récupère tous les slides actifs du hero
 */
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  return fetchHeroSlidesFromStrapi();
};
