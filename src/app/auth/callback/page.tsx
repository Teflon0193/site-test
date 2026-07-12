export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createEventRegistrationAfterGoogleAuth } from "@/app/evenement/[slug]/actions";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

interface CallbackPageProps {
  searchParams: Promise<{
    eventId?: string;
    eventSlug?: string;
    redirectUrl?: string;
  }>;
}

export default async function AuthCallbackPage({
  searchParams,
}: CallbackPageProps) {
  const params = await searchParams;
  const { eventId, eventSlug, redirectUrl } = params;

  // Vérifier que l'utilisateur est authentifié
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Si un eventId est présent, créer l'inscription à l'événement
  if (eventId) {
    const result = await createEventRegistrationAfterGoogleAuth(eventId);

    if (result.success) {
      if (eventSlug) {
        redirect(`/evenement/${eventSlug}?registered=true`);
      } else if (redirectUrl) {
        redirect(redirectUrl);
      } else {
        redirect("/espace-membre?registered=true");
      }
    } else {
      if (eventSlug) {
        redirect(
          `/evenement/${eventSlug}?error=${encodeURIComponent(
            result.error || "Erreur lors de l'inscription"
          )}`
        );
      } else {
        redirect("/espace-membre?error=true");
      }
    }
  }

  // Si pas d'eventId, rediriger vers l'espace membre normal
  if (user.role === "ADMIN") {
    redirect("/espace-membre/admin");
  } else {
    redirect("/espace-membre");
  }
}
