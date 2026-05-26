import { STRAPI_BASE_URL, STRAPI_TOKEN } from "@/lib/constant";
import {
  Actualite,
  ActualiteForDownload,
  ActualiteMois,
  ActualiteType,
  StrapiActualite,
} from "@/types/actualite";

interface ActualiteFilters {
  type?: ActualiteType;
  annee?: number;
  mois?: ActualiteMois;
  search?: string;
}

const getMediaUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${STRAPI_BASE_URL}${url}`;
};

const getCoverImageUrl = (image: StrapiActualite["coverImage"]) =>
  getMediaUrl(
    image?.formats?.large?.url ||
      image?.formats?.medium?.url ||
      image?.formats?.small?.url ||
      image?.url
  );

const transformStrapiActualite = (data: StrapiActualite): Actualite => ({
  id: data.id,
  documentId: data.documentId,
  title: data.title,
  slug: data.slug,
  type: data.type,
  summary: data.summary,
  blocks: data.blocks,
  pdf: data.pdf
    ? {
        name: data.pdf.name,
        size: data.pdf.size,
        ext: data.pdf.ext,
      }
    : undefined,
  coverImage: getCoverImageUrl(data.coverImage),
  mois: data.mois,
  annee: data.annee,
  pageCount: data.pageCount,
  isFeatured: data.isFeatured ?? false,
  datePublication: data.datePublication,
  createdAt: data.createdAt,
  publishedAt: data.publishedAt,
});

const buildActualiteQuery = (filters: ActualiteFilters = {}) => {
  const params = new URLSearchParams();
  params.append("populate", "pdf,coverImage,blocks");
  params.append("sort[0]", "annee:desc");
  params.append("sort[1]", "datePublication:desc");
  params.append("sort[2]", "createdAt:desc");

  if (filters.type) {
    params.append("filters[type][$eq]", filters.type);
  }

  if (filters.annee) {
    params.append("filters[annee][$eq]", filters.annee.toString());
  }

  if (filters.mois) {
    params.append("filters[mois][$eq]", filters.mois);
  }

  if (filters.search) {
    params.append("filters[$or][0][title][$containsi]", filters.search);
    params.append("filters[$or][1][summary][$containsi]", filters.search);
  }

  return params;
};

const fetchActualiteJson = async (url: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Erreur API Strapi: ${response.status}`);
  }

  return response.json();
};

export const getActualites = async (
  filters: ActualiteFilters = {}
): Promise<Actualite[]> => {
  const params = buildActualiteQuery(filters);
  const url = `${STRAPI_BASE_URL}/api/actualites?${params.toString()}`;
  const data = await fetchActualiteJson(url);

  return data.data.map(transformStrapiActualite);
};

export const getActualiteBySlug = async (
  slug: string
): Promise<Actualite | null> => {
  const params = buildActualiteQuery();
  params.append("filters[slug][$eq]", slug);
  params.append("pagination[limit]", "1");

  try {
    const url = `${STRAPI_BASE_URL}/api/actualites?${params.toString()}`;
    const data = await fetchActualiteJson(url);
    const actualite = data.data[0];

    return actualite ? transformStrapiActualite(actualite) : null;
  } catch (error) {
    console.error("[Actualite Service] Error fetching actualite by slug:", error);
    return null;
  }
};

export const getActualiteForDownload = async (
  id: number
): Promise<ActualiteForDownload | null> => {
  const params = new URLSearchParams();
  params.append("populate", "pdf,coverImage");

  try {
    const url = `${STRAPI_BASE_URL}/api/actualites/${id}?${params.toString()}`;
    const data = await fetchActualiteJson(url);
    const actualite = data.data as StrapiActualite;

    if (!actualite?.pdf?.url) {
      return null;
    }

    return {
      ...transformStrapiActualite(actualite),
      pdfUrl: getMediaUrl(actualite.pdf.url) || actualite.pdf.url,
      pdfName: actualite.pdf.name,
    };
  } catch (error) {
    console.error("[Actualite Service] Error fetching actualite for download:", error);
    return null;
  }
};
