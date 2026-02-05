import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { getNewsletterById } from "@/services/newsletterService";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const newsletter = await getNewsletterById(parseInt(id));

  if (!newsletter) {
    return NextResponse.json(
      { error: "Newsletter non trouvée" },
      { status: 404 }
    );
  }

  // Log activity
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

  return NextResponse.redirect(newsletter.pdf.url);
}
