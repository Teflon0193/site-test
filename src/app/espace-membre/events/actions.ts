/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function cancelEventRegistrationAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const registrationId = formData.get("registrationId") as string;

    if (!registrationId) {
      return {
        success: false,
        error: "ID d'inscription manquant",
      };
    }

    // Vérifier que l'inscription appartient à l'utilisateur
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return {
        success: false,
        error: "Inscription non trouvée",
      };
    }

    if (registration.userId !== user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à annuler cette inscription",
      };
    }

    if (registration.status === "CANCELLED") {
      return {
        success: false,
        error: "Cette inscription est déjà annulée",
      };
    }

    // Mettre à jour le statut
    await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { status: "CANCELLED" },
    });

    // Créer une activité
    await prisma.memberActivity.create({
      data: {
        userId: user.id,
        type: "EVENT_CANCEL",
        metadata: {
          eventId: registration.eventId,
        },
      },
    });

    revalidatePath("/espace-membre/events");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'inscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'annulation",
    };
  }
}
