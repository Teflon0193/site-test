import { fetchFromStrapi } from "@/lib/strapi";
import { Newsletter, StrapiNewsletter } from "@/types/newsletter";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

export const transformStrapiNewsletter = (
  data: StrapiNewsletter
): Newsletter => ({
  id: data.id,
  title: data.title,
  edition: data.edition,
  mois: data.mois,
  annee: data.annee,
  description: data.description,
  pdf: {
    url: data.pdf.url,
    name: data.pdf.name,
    size: data.pdf.size,
    ext: data.pdf.ext,
  },
  coverImage: data.coverImage?.formats?.medium?.url || data.coverImage?.url,
  pageCount: data.pageCount,
  isFeatured: data.isFeatured,
  datePublication: data.datePublication,
  createdAt: data.createdAt,
  publishedAt: data.publishedAt,
});

export const getNewsletters = async (): Promise<Newsletter[]> => {
  const params = new URLSearchParams();
  params.append("populate", "pdf,coverImage");
  params.append("sort[0]", "annee:desc");
  params.append("sort[1]", "datePublication:desc");

  return fetchFromStrapi("newsletters", params, transformStrapiNewsletter);
};

export const getFeaturedNewsletter = async (): Promise<Newsletter | null> => {
  const params = new URLSearchParams();
  params.append("populate", "pdf,coverImage");
  params.append("filters[isFeatured][$eq]", "true");
  params.append("pagination[limit]", "1");

  const results = await fetchFromStrapi(
    "newsletters",
    params,
    transformStrapiNewsletter
  );
  return results[0] || null;
};

export const getNewsletterById = async (
  id: number
): Promise<Newsletter | null> => {
  const params = new URLSearchParams();
  params.append("populate", "pdf,coverImage");

  try {
    const url = `${STRAPI_BASE_URL}/api/newsletters/${id}?${params}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const { data } = await res.json();
    return transformStrapiNewsletter(data);
  } catch (error) {
    console.error("[Newsletter Service] Error fetching newsletter:", error);
    return null;
  }
};
