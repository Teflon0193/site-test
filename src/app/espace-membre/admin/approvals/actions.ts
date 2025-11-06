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
      include: { profile: true },
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
      secure: false,
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
      from: process.env.SMTP_FROM || "noreply@centreculturiel.cd",
      to: user.email,
      subject: "Votre compte CCAPAC a été approuvé ! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">CCAPAC</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Centre Culturel et Artistique des Pays d'Afrique Centrale</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; margin-top: 0;">Félicitations ${user.name} ! 🎉</h2>
              
              <p>Votre demande d'adhésion au CCAPAC a été approuvée par notre équipe.</p>
              
              <p>Pour finaliser l'activation de votre compte et accéder à tous nos services, veuillez cliquer sur le bouton ci-dessous :</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${validationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Activer mon compte
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
              <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #667eea;">
                ${validationUrl}
              </p>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404;"><strong>⚠️ Important :</strong> Ce lien expire dans 48 heures.</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px; margin: 0;">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Cordialement,<br>
                <strong>L'équipe CCAPAC</strong>
              </p>
            </div>
          </body>
        </html>
      `,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

    // Revalider la page pour afficher les données mises à jour
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
