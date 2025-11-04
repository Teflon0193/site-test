import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body as {
      email?: string;
      phone?: string;
    };

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    const existing = await prisma.memberProfile.findUnique({
      where: { userId: user.id },
    });
    if (existing) {
      return NextResponse.json({ ok: true, created: false });
    }

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        phone: phone ?? null,

        // Optionnel: tenter de découper le name plus tard (ici on ne stocke pas)
      },
    });

    return NextResponse.json({ ok: true, created: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue: " + error },
      { status: 500 }
    );
    console.error("Une erreur est survenue: ", error);
  }
}
