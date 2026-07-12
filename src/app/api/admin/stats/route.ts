/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

interface RecentMember {
  id: number | string;
  name: string | null;
  email: string;
  createdAt: Date | string;
  emailVerified: boolean | number;
}

function toIsoString(
  value: Date | string
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString();
}

export async function GET() {
  try {
    const user = await getUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Non autorisé",
        },
        {
          status: 401,
        }
      );
    }

    const [
      totalMembersResult,
      totalActivitiesResult,
      recentMembersResult,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "MEMBER",
        },
      }),

      prisma.memberActivity.count(),

      prisma.user.findMany({
        where: {
          role: "MEMBER",
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,

        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          emailVerified: true,
        },
      }),
    ]);

    const totalMembers =
      Number(totalMembersResult) || 0;

    const totalActivities =
      Number(totalActivitiesResult) || 0;

    const recentMembers =
      recentMembersResult as unknown as RecentMember[];

    const oneWeekAgo = new Date();

    oneWeekAgo.setDate(
      oneWeekAgo.getDate() - 7
    );

    const newMembersThisWeekResult =
      await prisma.user.count({
        where: {
          role: "MEMBER",

          createdAt: {
            gte: oneWeekAgo,
          },
        },
      });

    const newMembersThisWeek =
      Number(newMembersThisWeekResult) || 0;

    return NextResponse.json({
      success: true,

      totalMembers,

      totalActivities,

      newMembersThisWeek,

      recentMembers: recentMembers.map(
        (member: RecentMember) => ({
          ...member,

          createdAt: toIsoString(
            member.createdAt
          ),

          emailVerified:
            Boolean(
              member.emailVerified
            ),
        })
      ),
    });
  } catch (error: unknown) {
    console.error(
      "Erreur récupération statistiques admin :",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Impossible de charger les statistiques.",
      },
      {
        status: 500,
      }
    );
  }
}
