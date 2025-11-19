import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("search") ?? "";
  const filterStatus = searchParams.get("status") ?? "all";

  const whereClause: Prisma.UserWhereInput = {
    role: "MEMBER",
  };

  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (filterStatus === "validated") {
    whereClause.isApproved = true;
  } else if (filterStatus === "pending") {
    whereClause.isApproved = false;
  }

  const members = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isApproved: true,
      createdAt: true,
      _count: {
        select: {
          activities: true,
        },
      },
    },
  });

  const [totalMembers, approvedMembers, pendingMembers] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "MEMBER", isApproved: true } }),
    prisma.user.count({ where: { role: "MEMBER", isApproved: false } }),
  ]);

  return NextResponse.json({
    members: members.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    totalMembers,
    approvedMembers,
    pendingMembers,
  });
}
