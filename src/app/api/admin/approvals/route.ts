import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET() {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const pendingUsers = await prisma.user.findMany({
    where: {
      isApproved: false,
      role: "MEMBER",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      phone: true,
    },
  });

  const approvedCount = await prisma.user.count({
    where: {
      isApproved: true,
      role: "MEMBER",
    },
  });

  return NextResponse.json({
    pendingUsers: pendingUsers.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
    approvedCount,
  });
}






