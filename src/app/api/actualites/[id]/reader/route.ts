import { NextRequest, NextResponse } from "next/server";
import { STRAPI_BASE_URL, STRAPI_TOKEN } from "@/lib/constant";

type StrapiPdf = {
  name?: string;
  url?: string;
  mime?: string;
};

type StrapiActualite = {
  type?: string;
  pdf?: StrapiPdf | null;
};

const jsonError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const getPdfUrl = (url: string) => {
  try {
    const pdfUrl = new URL(url, STRAPI_BASE_URL);
    const strapiUrl = new URL(STRAPI_BASE_URL);

    const isStrapiMedia = pdfUrl.origin === strapiUrl.origin;
    const isExternalHttpsMedia = pdfUrl.protocol === "https:";

    if (!isStrapiMedia && !isExternalHttpsMedia) {
      return null;
    }

    return pdfUrl;
  } catch {
    return null;
  }
};

const getActualite = async (id: string): Promise<StrapiActualite | null> => {
  const params = new URLSearchParams();
  params.append("populate", "pdf");
  params.append("pagination[limit]", "1");

  if (/^\d+$/.test(id)) {
    params.append("filters[id][$eq]", id);
  } else {
    params.append("filters[documentId][$eq]", id);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(
    `${STRAPI_BASE_URL}/api/actualites?${params.toString()}`,
    {
      headers,
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Strapi actualite lookup failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: StrapiActualite[] | StrapiActualite | null;
  };

  return Array.isArray(payload.data) ? payload.data[0] ?? null : payload.data ?? null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return jsonError("Identifiant invalide", 400);
  }

  let actualite: StrapiActualite | null = null;

  try {
    actualite = await getActualite(id);
  } catch (error) {
    console.error("[Actualite Reader] Failed to fetch actualite:", error);
    return jsonError("Liseuse indisponible", 502);
  }

  if (!actualite || actualite.type !== "NEWSLETTER") {
    return jsonError("Newsletter introuvable", 404);
  }

  const pdfUrl = actualite.pdf?.url ? getPdfUrl(actualite.pdf.url) : null;

  if (!pdfUrl) {
    return jsonError("PDF indisponible pour cette newsletter", 404);
  }

  let pdfResponse: Response;

  try {
    pdfResponse = await fetch(pdfUrl);
  } catch (error) {
    console.error("[Actualite Reader] Failed to fetch PDF:", error);
    return jsonError("Liseuse indisponible", 502);
  }

  if (!pdfResponse.ok || !pdfResponse.body) {
    return jsonError("Liseuse indisponible", 502);
  }

  return new NextResponse(pdfResponse.body, {
    status: 200,
    headers: {
      "Content-Type":
        pdfResponse.headers.get("content-type") ||
        actualite.pdf?.mime ||
        "application/pdf",
      "Content-Disposition": `inline; filename="${actualite.pdf?.name || "newsletter.pdf"}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
