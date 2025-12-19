import nodemailer from "nodemailer";

// =============================================================================
// CONFIGURATION
// =============================================================================

const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : SMTP_PORT === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
  // Timeouts pour éviter les blocages
  // connectionTimeout: 10000, // 10 secondes
  // greetingTimeout: 10000,
  // socketTimeout: 10000,
});

const EMAIL_FROM =
  process.env.SMTP_FROM || `"CCAPAC" <${process.env.SMTP_USER}>`;
const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

/**
 * Génère le layout de base pour tous les emails CCAPAC
 */
function baseEmailLayout(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .header img { height: 40px; width: auto; }
        .card { background-color: #ffffff; padding: 40px; border: 1px solid #e5e5e5; border-radius: 8px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
        h1, h2 { color: #1a1a1a; margin-top: 0; }
        p { line-height: 1.6; margin-bottom: 20px; color: #4a4a4a; }
        .button { display: inline-block; background-color: #804423; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px; }
        .alt-link { margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        .alt-link a { color: #804423; text-decoration: none; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <div class="header">
          <img src="${BASE_URL}/images/logo-primary.png" alt="CCAPAC" />
        </div>

        <div class="card">
          ${content}
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} CCAPAC. Tous droits réservés.<br>
          Kinshasa, République Démocratique du Congo</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Génère un bouton CTA stylisé
 */
function ctaButton(url: string, text: string): string {
  return `
    <div style="margin: 30px 0;">
      <a href="${url}" class="button">
        ${text}
      </a>
    </div>
  `;
}

/**
 * Génère un bloc de lien alternatif
 */
function alternativeLink(url: string): string {
  return `
    <div class="alt-link">
      <p style="margin: 0;">Si le bouton ne fonctionne pas, copiez ce lien :</p>
      <a href="${url}">${url}</a>
    </div>
  `;
}

// =============================================================================
// EMAIL TEMPLATE GENERATORS
// =============================================================================

export const emailTemplates = {
  /**
   * Email de réinitialisation de mot de passe
   */
  passwordReset: (userName: string, resetUrl: string): string => {
    const content = `
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Réinitialisation de mot de passe</h2>

      <p>Bonjour ${userName || "cher membre"},</p>

      <p>
        Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte CCAPAC.
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
      </p>

      <p>Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>

      ${ctaButton(resetUrl, "Réinitialiser mon mot de passe")}

      <p style="font-size: 13px; color: #666; margin-top: 20px;">
        Ce lien est valide pour une durée limitée de 1 heure.
      </p>

      ${alternativeLink(resetUrl)}
    `;
    return baseEmailLayout(content);
  },

  /**
   * Email d'approbation de compte membre
   */
  memberApproval: (userName: string, validationUrl: string): string => {
    const content = `
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Bienvenue au CCAPAC</h2>

      <p>Bonjour ${userName},</p>

      <p>
        Nous avons le plaisir de vous informer que votre demande d'adhésion a été approuvée. 
        Vous faites désormais partie de notre communauté.
      </p>

      <p>
        Pour finaliser votre inscription et accéder à votre espace membre, veuillez activer votre compte via le bouton ci-dessous :
      </p>

      ${ctaButton(validationUrl, "Activer mon compte")}

      <p style="font-size: 13px; color: #666; margin-top: 20px;">
        Ce lien d'activation est valable pendant 48 heures.
      </p>

      ${alternativeLink(validationUrl)}
    `;
    return baseEmailLayout(content);
  },

  /**
   * Email de contact (formulaire de contact)
   */
  contactForm: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): string => {
    const content = `
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">Nouveau message de contact</h2>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; border: 1px solid #eee;">
        <p style="margin: 0 0 10px 0;"><strong>De :</strong> ${data.firstName} ${data.lastName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #804423; text-decoration: none;">${data.email}</a></p>
        <p style="margin: 0 0 10px 0;"><strong>Téléphone :</strong> ${data.phone}</p>
        <p style="margin: 0;"><strong>Sujet :</strong> ${data.subject}</p>
      </div>

      <div style="margin-top: 24px;">
        <p style="font-weight: 600; margin-bottom: 12px;">Message :</p>
        <p style="white-space: pre-wrap; background-color: #fff; padding: 15px; border-left: 3px solid #804423;">${data.message}</p>
      </div>
    `;
    return baseEmailLayout(content);
  },
};

// =============================================================================
// MAIN SEND EMAIL FUNCTION
// =============================================================================

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Fonction centralisée pour l'envoi d'emails
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = EMAIL_FROM,
}: SendEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`[Email] Envoyé avec succès à: ${to}`);
    return true;
  } catch (error) {
    console.error("[Email] Erreur lors de l'envoi:", error);
    throw new Error("Échec de l'envoi de l'email");
  }
}

// =============================================================================
// HELPER FUNCTIONS FOR COMMON USE CASES
// =============================================================================

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetUrl: string
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Réinitialisation de votre mot de passe - CCAPAC",
    html: emailTemplates.passwordReset(userName, resetUrl),
  });
}

/**
 * Envoie un email d'approbation de membre
 */
export async function sendMemberApprovalEmail(
  userEmail: string,
  userName: string,
  validationUrl: string
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Votre compte CCAPAC a été approuvé",
    html: emailTemplates.memberApproval(userName, validationUrl),
  });
}

/**
 * Envoie un email depuis le formulaire de contact
 */
export async function sendContactFormEmail(
  adminEmail: string,
  contactData: Parameters<typeof emailTemplates.contactForm>[0]
): Promise<boolean> {
  return sendEmail({
    to: adminEmail,
    subject: `Nouveau message de contact - ${contactData.subject}`,
    html: emailTemplates.contactForm(contactData),
  });
}
