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

    // Contenu de l'email avec le design CCAPAC
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@centreculturel.cd",
      to: user.email,
      subject: "Votre compte CCAPAC a été approuvé ! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Poppins', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #804423; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f2e9;">
            <!-- Header avec gradient CCAPAC -->
            <div style="background: linear-gradient(135deg, #cd935b 0%, #804423 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 4px 6px rgba(128, 68, 35, 0.1);">
              <h1 style="color: #f3f2e9; margin: 0; font-size: 32px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">CCAPAC</h1>
              <p style="color: rgba(243, 242, 233, 0.95); margin: 12px 0 0 0; font-size: 14px; font-weight: 500;">Centre Culturel et Artistique des Pays d'Afrique Centrale</p>
            </div>
            
            <!-- Corps du message -->
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(128, 68, 35, 0.1);">
              <h2 style="color: #cd935b; margin-top: 0; font-size: 24px; font-weight: 700;">Félicitations ${user.name} ! 🎉</h2>
              
              <p style="color: #804423; margin: 20px 0; font-size: 15px;">Votre demande d'adhésion au <strong>CCAPAC</strong> a été approuvée par notre équipe.</p>
              
              <p style="color: #804423; margin: 20px 0; font-size: 15px;">Pour finaliser l'activation de votre compte et y accéder, veuillez cliquer sur le bouton ci-dessous :</p>
              
              <!-- Bouton CTA -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${validationUrl}" style="background: linear-gradient(135deg, #cd935b 0%, #804423 100%); color: #f3f2e9; padding: 16px 45px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(205, 147, 91, 0.3); transition: transform 0.2s;">
                  Activer mon compte
                </a>
              </div>
              
              <!-- Lien alternatif -->
              <p style="color: #6b5b4f; font-size: 13px; margin: 25px 0 10px 0;">Ou copiez ce lien dans votre navigateur :</p>
              <p style="background: #f3f2e9; padding: 12px 15px; border-radius: 8px; word-break: break-all; font-size: 12px; color: #cd935b; border: 2px solid #e8e6dd; font-family: monospace;">
                ${validationUrl}
              </p>
              
              <!-- Avertissement -->
              <div style="background: #fff9e6; border-left: 4px solid #ffcc02; padding: 16px 20px; margin: 25px 0; border-radius: 6px;">
                <p style="margin: 0; color: #804423; font-size: 14px;"><strong style="color: #cd935b;">⚠️ Important :</strong> Ce lien expire dans <strong>48 heures</strong>. Veuillez activer votre compte rapidement.</p>
              </div>
              
              <!-- Séparateur -->
              <hr style="border: none; border-top: 2px solid #e8e6dd; margin: 35px 0;">
              
              <!-- Note de sécurité -->
              <p style="color: #6b5b4f; font-size: 13px; margin: 25px 0 0 0; line-height: 1.5;">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
              </p>
              
              <!-- Signature -->
              <p style="color: #804423; font-size: 14px; margin-top: 30px; font-weight: 500;">
                Bienvenue dans la famille CCAPAC ! 🎭🥁<br>
                <strong style="color: #cd935b; font-size: 15px;">L'équipe CCAPAC</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 25px 20px; color: #6b5b4f; font-size: 12px;">
              <p style="margin: 5px 0;">Centre Culturel et Artistique des Pays d'Afrique Centrale</p>
              <p style="margin: 5px 0; color: #a08b7a;">Promouvoir et célébrer les cultures d'Afrique Centrale</p>
              <p style="margin: 15px 0 5px 0;">
                <a href="${baseUrl}" style="color: #cd935b; text-decoration: none; font-weight: 600;">Visiter notre site web</a>
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
