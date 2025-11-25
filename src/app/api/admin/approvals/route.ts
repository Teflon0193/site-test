import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const [pendingUsers, approvedCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          isApproved: false,
          role: "MEMBER",
        },
      }),
      prisma.user.count({
        where: { isApproved: true, role: "MEMBER" },
      }),
      prisma.user.count({
        where: { isApproved: false, role: "MEMBER" },
      }),
    ]);

    return NextResponse.json({
      pendingUsers: pendingUsers.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      approvedCount,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      {
        status: 500,
      }
    );
  }
}
