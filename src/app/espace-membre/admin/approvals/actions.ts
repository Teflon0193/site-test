"use server";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { sendMemberApprovalEmail } from "@/services/mailServices";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function approveMemberAction(userId: string) {
  try {
    // Vérifier que l'utilisateur est admin
    const admin = await getUser();
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Non autorisé" };
    }

    if (!userId) {
      return { success: false, error: "userId requis" };
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    if (user.isApproved) {
      return { success: false, error: "Utilisateur déjà approuvé" };
    }

    // Générer un token unique
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Expire dans 48h

    // Supprimer les anciens tokens de cet utilisateur
    await prisma.approvalToken.deleteMany({
      where: { userId: user.id },
    });

    // Créer le token d'approbation
    await prisma.approvalToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // URL de validation
    const validationUrl = `${BASE_URL}/auth/validate/${token}`;

    // Envoyer l'email
    await sendMemberApprovalEmail(user.email, user.name, validationUrl);

    // Revalider les pages et layouts admin pour afficher les données mises à jour
    revalidatePath("/espace-membre");
    revalidatePath("/espace-membre/admin");
    revalidatePath("/espace-membre/admin/approvals");

    return {
      success: true,
      message: `Email d'activation envoyé à ${user.name}`,
    };
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return {
      success: false,
      error: "Erreur lors de l'envoi de l'email. Veuillez réessayer.",
    };
  }
}
