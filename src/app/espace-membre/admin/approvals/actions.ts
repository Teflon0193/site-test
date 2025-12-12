"use server";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";

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
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const validationUrl = `${baseUrl}/auth/validate/${token}`;

    // Configurer le transporteur email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Accepter les certificats auto-signés en développement
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    // Contenu de l'email
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@centreculturel.cd",
      to: user.email,
      subject: "Votre compte CCAPAC a été approuvé",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #804423; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f3f2e9;">
            <!-- Main Container -->
            <div style="background: #ffffff; padding: 40px; border-radius: 4px; border: 1px solid #e8e6dd;">
              
              <!-- Header -->
              <div style="margin-bottom: 40px; text-align: center;">
                 <img src="${baseUrl}/images/logo-primary.png" alt="CCAPAC" style="width: 120px; height: auto;" />
              </div>
            
              <!-- Content -->
              <div style="text-align: left;">
                <h2 style="color: #804423; margin-top: 0; font-size: 20px; font-weight: 600;">Bonjour ${
                  user.name
                },</h2>
                
                <p style="color: #6b5b4f; font-size: 16px; margin: 24px 0;">
                  Nous avons le plaisir de vous informer que votre demande d'adhésion au CCAPAC a été approuvée.
                </p>
                
                <p style="color: #6b5b4f; font-size: 16px; margin: 24px 0;">
                  Pour activer votre compte et accéder à votre espace membre, veuillez cliquer sur le lien ci-dessous. Ce lien est valable pendant 48 heures.
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${validationUrl}" style="background-color: #cd935b; color: #f3f2e9; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; transition: background-color 0.2s;">
                    Activer mon compte
                  </a>
                </div>
                
                <!-- Alt Link -->
                <div style="background-color: #f3f2e9; padding: 16px; border-radius: 4px; margin-top: 40px; border: 1px solid #e8e6dd;">
                   <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b5b4f;">Si le bouton ne fonctionne pas, copiez ce lien :</p>
                   <p style="margin: 0; font-size: 12px; color: #804423; word-break: break-all; font-family: monospace;">${validationUrl}</p>
                </div>

              </div>
              
              <!-- Footer -->
              <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e8e6dd; text-align: center; font-size: 12px; color: #a08b7a;">
                <p style="margin: 4px 0;">© ${new Date().getFullYear()} CCAPAC. Tous droits réservés.</p>
                <p style="margin: 4px 0;">Kinshasa, République Démocratique du Congo</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

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
