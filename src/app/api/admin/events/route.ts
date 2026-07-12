import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  serverApiFetch,
} from "@/lib/api-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BackendEvent {
  id: number | string;
  title: string;
  description?: string | null;
  slug: string;
  startDate?: string | null;
  start_date?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  startTime?: string | null;
  start_time?: string | null;
  endTime?: string | null;
  end_time?: string | null;
  location?: string | null;
  discipline?: string | null;
  public?: string | boolean | null;
  image?: string | null;
  isRegistrationOpen?: boolean | number;
  is_registration_open?: boolean | number;
  maxParticipants?: number | null;
  max_participants?: number | null;

  registrations?: BackendRegistration[];
  registrationsCount?: number;
  registrations_count?: number;
}

interface BackendRegistration {
  id: number | string;

  userName?: string | null;
  user_name?: string | null;

  userEmail?: string | null;
  user_email?: string | null;

  status?: string | null;

  registeredAt?: string | null;
  registered_at?: string | null;

  user?: {
    id?: number | string;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
}

interface BackendEventsResponse {
  success?: boolean;
  message?: string;

  data?: BackendEvent[];
  events?: BackendEvent[];
}

interface EventRegistrationItem {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  registeredAt: string;
}

interface EventWithRegistrations {
  id: number;
  title: string;
  description: string;
  slug: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  discipline: string;
  public: string | boolean;
  image: string | null;
  isRegistrationOpen: boolean;
  maxParticipants: number;

  registrationsCount: number;
  registrations: EventRegistrationItem[];
}

function normalizeNumberId(
  value: number | string
): number {
  if (typeof value === "number") {
    return value;
  }

  const parsedId = Number.parseInt(
    value,
    10
  );

  return Number.isNaN(parsedId)
    ? 0
    : parsedId;
}

function normalizeBoolean(
  value:
    | boolean
    | number
    | string
    | null
    | undefined
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return [
      "1",
      "true",
      "yes",
      "oui",
    ].includes(
      value.trim().toLowerCase()
    );
  }

  return false;
}

function getRegistrationUserName(
  registration: BackendRegistration
): string {
  const directName =
    registration.userName ||
    registration.user_name;

  if (directName?.trim()) {
    return directName.trim();
  }

  const firstName =
    registration.user?.first_name
      ?.trim() || "";

  const lastName =
    registration.user?.last_name
      ?.trim() || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    registration.user?.name?.trim() ||
    registration.user?.email ||
    "Utilisateur"
  );
}

function normalizeRegistration(
  registration: BackendRegistration
): EventRegistrationItem {
  return {
    id: String(registration.id),

    userName:
      getRegistrationUserName(
        registration
      ),

    userEmail:
      registration.userEmail ||
      registration.user_email ||
      registration.user?.email ||
      "",

    status:
      registration.status ||
      "CONFIRMED",

    registeredAt:
      registration.registeredAt ||
      registration.registered_at ||
      "",
  };
}

function normalizeEvent(
  event: BackendEvent
): EventWithRegistrations {
  const registrations = Array.isArray(
    event.registrations
  )
    ? event.registrations.map(
        normalizeRegistration
      )
    : [];

  return {
    id: normalizeNumberId(event.id),

    title: event.title || "",

    description:
      event.description || "",

    slug: event.slug || "",

    startDate:
      event.startDate ||
      event.start_date ||
      "",

    endDate:
      event.endDate ||
      event.end_date ||
      "",

    startTime:
      event.startTime ||
      event.start_time ||
      "",

    endTime:
      event.endTime ||
      event.end_time ||
      "",

    location:
      event.location || "",

    discipline:
      event.discipline || "Général",

    public:
      event.public ?? "",

    image:
      event.image || null,

    isRegistrationOpen:
      normalizeBoolean(
        event.isRegistrationOpen ??
          event.is_registration_open
      ),

    maxParticipants: Number(
      event.maxParticipants ??
        event.max_participants ??
        0
    ),

    registrationsCount:
      event.registrationsCount ??
      event.registrations_count ??
      registrations.length,

    registrations,
  };
}

/**
 * GET /api/admin/events/registrations
 *
 * Cette route Next.js transmet la demande
 * au backend Node.js.
 *
 * Le backend attendu :
 * GET /api/events/admin/registrations
 */
export async function GET(
  request: NextRequest
) {
  try {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const backendResponse =
      await serverApiFetch<BackendEventsResponse>(
        request,
        `/events/admin/registrations?isRegistrationOpen=true&startDateFrom=${encodeURIComponent(
          today
        )}`,
        {
          method: "GET",
        }
      );

    const backendEvents =
      backendResponse.events ??
      backendResponse.data ??
      [];

    if (!Array.isArray(backendEvents)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le backend n'a pas retourné une liste valide d'événements.",
        },
        {
          status: 502,
        }
      );
    }

    const events =
      backendEvents
        .map(normalizeEvent)
        .filter(
          (event) => event.id > 0
        );

    return NextResponse.json(
      {
        success: true,
        events,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(
      "Erreur récupération événements et inscriptions :",
      error
    );

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    const message =
      error instanceof Error
        ? error.message
        : "Impossible de récupérer les événements.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status,
      }
    );
  }
}
