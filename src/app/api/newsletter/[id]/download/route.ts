import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { getNewsletterById } from "@/services/newsletterService";
import prisma from "@/lib/prisma";
import { STRAPI_BASE_URL } from "@/lib/constant";

const jsonError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const sanitizeFilename = (filename: string) =>
  filename.replace(/[\\/:*?"<>|\r\n]/g, "-").trim() || "newsletter.pdf";

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

  const newsletter = await getNewsletterById(Number(id));

  if (!newsletter) {
    return jsonError("Newsletter non trouvee", 404);
  }

  const pdfUrl = getPdfUrl(newsletter.pdf.url);

  if (!pdfUrl) {
    return jsonError("PDF indisponible pour cette newsletter", 404);
  }
  

  let pdfResponse: Response;

  try {
    pdfResponse = await fetch(pdfUrl);
  } catch (error) {
    console.error("[Newsletter Download] Failed to fetch PDF:", error);
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
          newsletterId: newsletter.id,
          edition: newsletter.edition,
          mois: newsletter.mois,
          annee: newsletter.annee,
        },
      },
    });
  } catch (error) {
    console.error("[Newsletter Download] Failed to log activity:", error);
  }

  const filename = sanitizeFilename(newsletter.pdf.name);
  const headers = new Headers({
    "Content-Type": pdfResponse.headers.get("content-type") || "application/pdf",
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
