/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AdminMemberRow {
  id: number | string;
  email: string;

  first_name?:
    | string
    | null;

  last_name?:
    | string
    | null;

  name?:
    | string
    | null;

  phone?:
    | string
    | null;

  role: string;

  email_verified?:
    | number
    | boolean;

  createdAt?:
    | Date
    | string
    | null;

  created_at?:
    | Date
    | string
    | null;

  updatedAt?:
    | Date
    | string
    | null;

  updated_at?:
    | Date
    | string
    | null;

  [key: string]: unknown;
}

function toIsoString(
  value:
    | Date
    | string
    | null
    | undefined
): string | null {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toISOString();
}

export async function GET(
  request: NextRequest
) {
  try {
    const user =
      await getUser();

    if (
      !user ||
      user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Non autorisé",
        },
        {
          status: 401,
        }
      );
    }

    const {
      searchParams,
    } = new URL(request.url);

    const search =
      searchParams
        .get("search")
        ?.trim() || "";

    const role =
      searchParams
        .get("role")
        ?.trim() || "";

    const prismaMembers =
      await prisma.user.findMany({
        where: {
          ...(role &&
          role !== "all"
            ? {
                role,
              }
            : {}),

          ...(search
            ? {
                OR: [
                  {
                    email: {
                      contains:
                        search,
                    },
                  },

                  {
                    first_name: {
                      contains:
                        search,
                    },
                  },

                  {
                    last_name: {
                      contains:
                        search,
                    },
                  },
                ],
              }
            : {}),
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const members =
      prismaMembers as unknown as AdminMemberRow[];

    return NextResponse.json(
      {
        success: true,

        members:
          members.map(
            (member) => ({
              ...member,

              createdAt:
                toIsoString(
                  member.createdAt ??
                    member.created_at
                ),

              updatedAt:
                toIsoString(
                  member.updatedAt ??
                    member.updated_at
                ),

              fullName:
                [
                  member.first_name,
                  member.last_name,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                member.name ||
                member.email,
            })
          ),
      },
      {
        status: 200,
      }
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "Erreur de récupération des membres :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Impossible de charger les membres",
      },
      {
        status: 500,
      }
    );
  }
}
