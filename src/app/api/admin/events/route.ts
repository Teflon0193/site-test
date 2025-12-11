import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { STRAPI_BASE_URL, STRAPI_TOKEN } from "@/lib/constant";
import { transformStrapiEvent } from "@/lib/strapi";
import prisma from "@/lib/prisma";
import type { Event } from "@/types/events";

export const runtime = "nodejs";

interface EventWithRegistrations extends Event {
  registrationsCount: number;
  registrations: Array<{
    id: string;
    userName: string;
    userEmail: string;
    status: string;
    registeredAt: string;
  }>;
}

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Récupérer les événements avec isRegistrationOpen: true depuis Strapi
    const queryParams = new URLSearchParams();
    queryParams.append("filters[isRegistrationOpen][$eq]", "true");
    queryParams.append("populate", "image");
    queryParams.append("sort", "startDate:asc");

    const url = `${STRAPI_BASE_URL}/api/events?${queryParams.toString()}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(
        `Erreur API Strapi: ${response.status} - ${response.statusText}`
      );
    }

    const strapiData = await response.json();
    const events: Event[] = strapiData.data.map(transformStrapiEvent);

    // Pour chaque événement, récupérer les inscriptions depuis Prisma
    const eventsWithRegistrations: EventWithRegistrations[] = await Promise.all(
      events.map(async (event) => {
        const registrations = await prisma.eventRegistration.findMany({
          where: {
            eventId: event.id.toString(),
            status: {
              not: "CANCELLED",
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          ...event,
          registrationsCount: registrations.length,
          registrations: registrations.map((reg) => ({
            id: reg.id,
            userName: reg.user.name,
            userEmail: reg.user.email,
            status: reg.status,
            registeredAt: reg.createdAt.toISOString(),
          })),
        };
      })
    );

    return NextResponse.json({
      events: eventsWithRegistrations,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des événements",
      },
      { status: 500 }
    );
  }
}
