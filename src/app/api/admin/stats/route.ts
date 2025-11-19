import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET() {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const [
    totalMembers,
    approvedMembers,
    pendingMembers,
    totalActivities,
    recentMembers,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "MEMBER" },
    }),
    prisma.user.count({
      where: { role: "MEMBER", isApproved: true },
    }),
    prisma.user.count({
      where: { role: "MEMBER", isApproved: false },
    }),
    prisma.memberActivity.count(),
    prisma.user.findMany({
      where: { role: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isApproved: true,
      },
    }),
  ]);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newMembersThisWeek = await prisma.user.count({
    where: {
      role: "MEMBER",
      createdAt: { gte: oneWeekAgo },
    },
  });

  return NextResponse.json({
    totalMembers,
    approvedMembers,
    pendingMembers,
    totalActivities,
    newMembersThisWeek,
    recentMembers: recentMembers.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
