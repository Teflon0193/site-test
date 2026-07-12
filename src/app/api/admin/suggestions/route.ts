/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  type NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

import {
  suggestionCategories,
  suggestionStatuses,
  type SuggestionCategoryValue,
  type SuggestionStatusValue,
} from "@/lib/suggestions";

interface SuggestionUser {
  id: number | string;
  name: string | null;
  email: string;
  phone: string | null;
}

interface AdminSuggestion {
  id: string;
  userId?: number | string;
  category: SuggestionCategoryValue | string;
  status: SuggestionStatusValue | string;
  title?: string | null;
  message?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  resolvedAt?: Date | string | null;
  user: SuggestionUser;
  [key: string]: unknown;
}

function isSuggestionStatus(
  value: string
): value is SuggestionStatusValue {
  return suggestionStatuses.includes(
    value as SuggestionStatusValue
  );
}

function isSuggestionCategory(
  value: string
): value is SuggestionCategoryValue {
  return suggestionCategories.includes(
    value as SuggestionCategoryValue
  );
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

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

async function requireAdmin(): Promise<boolean> {
  const user = await getUser();

  return user?.role === "ADMIN";
}

export async function GET(
  req: NextRequest
) {
  try {
    const isAdmin =
      await requireAdmin();

    if (!isAdmin) {
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

    const { searchParams } =
      new URL(req.url);

    const status =
      searchParams.get("status");

    const category =
      searchParams.get("category");

    const where: Record<
      string,
      unknown
    > = {};

    if (
      status &&
      isSuggestionStatus(status)
    ) {
      where.status = status;
    }

    if (
      category &&
      isSuggestionCategory(category)
    ) {
      where.category = category;
    }

    const [
      suggestionsResult,
      totalSuggestionsResult,
    ] = await Promise.all([
      prisma.memberSuggestion.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),

      prisma.memberSuggestion.count({
        where,
      }),
    ]);

    const suggestions =
      suggestionsResult as unknown as AdminSuggestion[];

    const totalSuggestions =
      Number(
        totalSuggestionsResult
      ) || 0;

    return NextResponse.json({
      success: true,

      suggestions:
        suggestions.map(
          (
            suggestion: AdminSuggestion
          ) => ({
            ...suggestion,

            createdAt:
              toIsoString(
                suggestion.createdAt
              ),

            updatedAt:
              toIsoString(
                suggestion.updatedAt
              ),

            resolvedAt:
              toIsoString(
                suggestion.resolvedAt
              ),
          })
        ),

      totalSuggestions,
    });
  } catch (error: unknown) {
    console.error(
      "Erreur récupération suggestions admin :",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Impossible de charger les suggestions.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest
) {
  try {
    const isAdmin =
      await requireAdmin();

    if (!isAdmin) {
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

    const body: unknown =
      await req
        .json()
        .catch(() => null);

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Corps de requête invalide",
        },
        {
          status: 400,
        }
      );
    }

    const requestBody =
      body as Record<
        string,
        unknown
      >;

    const suggestionId =
      requestBody.suggestionId;

    const status =
      requestBody.status;

    if (
      typeof suggestionId !==
        "string" ||
      !suggestionId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ID de suggestion requis",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof status !== "string" ||
      !isSuggestionStatus(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Statut invalide",
        },
        {
          status: 400,
        }
      );
    }

    const suggestionResult =
      await prisma.memberSuggestion.update({
        where: {
          id:
            suggestionId.trim(),
        },

        data: {
          status,

          resolvedAt:
            status === "RESOLVED"
              ? new Date()
              : null,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

    const suggestion =
      suggestionResult as unknown as AdminSuggestion;

    return NextResponse.json({
      success: true,

      suggestion: {
        ...suggestion,

        createdAt:
          toIsoString(
            suggestion.createdAt
          ),

        updatedAt:
          toIsoString(
            suggestion.updatedAt
          ),

        resolvedAt:
          toIsoString(
            suggestion.resolvedAt
          ),
      },
    });
  } catch (error: unknown) {
    console.error(
      "Erreur mise à jour suggestion :",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour la suggestion.",
      },
      {
        status: 500,
      }
    );
  }
}
