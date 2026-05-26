import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { STRAPI_BASE_URL, STRAPI_TOKEN } from "@/lib/constant";

type StrapiPdf = {
  name?: string;
  url?: string;
  mime?: string;
  size?: number;
  ext?: string;
};

type StrapiActualite = {
  id: number | string;
  documentId?: string;
  title?: string;
  type?: string;
  mois?: string;
  annee?: number;
  pdf?: StrapiPdf | null;
};

const jsonError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const sanitizeFilename = (filename: string) =>
  filename.replace(/[\\/:*?"<>|\r\n]/g, "-").trim() || "newsletter.pdf";

const getPdfUrl = (url: string) => {
  try {
    const pdfUrl = new URL(url, STRAPI_BASE_URL);
    const strapiUrl = new URL(STRAPI_BASE_URL);

    if (pdfUrl.origin !== strapiUrl.origin) {
      return null;
    }

    return pdfUrl;
  } catch {
    return null;
  }
};

const getActualite = async (id: string): Promise<StrapiActualite | null> => {
  const params = new URLSearchParams({ populate: "pdf" });
  const url = `${STRAPI_BASE_URL}/api/actualites/${encodeURIComponent(
    id
  )}?${params.toString()}`;

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

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Strapi actualite lookup failed: ${response.status}`);
  }

  const payload = (await response.json()) as { data?: StrapiActualite | null };
  return payload.data ?? null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();

  if (!user) {
    return jsonError("Authentification requise", 401);
  }

  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return jsonError("Identifiant invalide", 400);
  }

  let actualite: StrapiActualite | null = null;

  try {
    actualite = await getActualite(id);
  } catch (error) {
    console.error("[Actualite Download] Failed to fetch actualite:", error);
    return jsonError("Telechargement indisponible", 502);
  }

  if (!actualite) {
    return jsonError("Actualite introuvable", 404);
  }

  if (actualite.type !== "NEWSLETTER") {
    return jsonError("Telechargement non autorise pour ce contenu", 403);
  }

  const pdfUrl = actualite.pdf?.url ? getPdfUrl(actualite.pdf.url) : null;

  if (!pdfUrl || !["http:", "https:"].includes(pdfUrl.protocol)) {
    return jsonError("PDF indisponible pour cette newsletter", 404);
  }

  let pdfResponse: Response;

  try {
    pdfResponse = await fetch(pdfUrl);
  } catch (error) {
    console.error("[Actualite Download] Failed to fetch PDF:", error);
    return jsonError("Telechargement indisponible", 502);
  }

  if (!pdfResponse.ok || !pdfResponse.body) {
    return jsonError("Telechargement indisponible", 502);
  }

  try {
    await prisma.memberActivity.create({
      data: {
        userId: user.id,
        type: "NEWSLETTER_DOWNLOAD",
        metadata: {
          actualiteId: actualite.id,
          documentId: actualite.documentId,
          title: actualite.title,
          mois: actualite.mois,
          annee: actualite.annee,
          pdfName: actualite.pdf?.name,
        },
      },
    });
  } catch (error) {
    console.error("[Actualite Download] Failed to log activity:", error);
  }

  const filename = sanitizeFilename(actualite.pdf?.name || "newsletter.pdf");
  const headers = new Headers({
    "Content-Type":
      pdfResponse.headers.get("content-type") ||
      actualite.pdf?.mime ||
      "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "private, no-store",
  });

  const contentLength = pdfResponse.headers.get("content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new NextResponse(pdfResponse.body, {
    status: 200,
    headers,
  });
}
