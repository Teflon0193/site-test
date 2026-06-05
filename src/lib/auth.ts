import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@prisma/client";
import {
  sendPasswordResetEmail,
  sendEmailVerification,
} from "@/services/mailServices";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendPasswordResetEmail(user.email, user.name, url);
        console.log(
          `[Auth] Email de réinitialisation envoyé à: ${user.email}`
        );
      } catch (error) {
        // Log l'erreur mais ne pas la propager pour éviter timing attacks
        console.error(
          "[Auth] Échec envoi email de réinitialisation:",
          error
        );
      }
    },

    onPasswordReset: async ({ user }) => {
      console.log(
        `[Auth] Mot de passe réinitialisé pour: ${user.email}`
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    callbackUrl: "/espace-membre",
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string; name: string };
      url: string;
      token: string;
    }) => {
      try {
        await sendEmailVerification(user.email, user.name, url);
        console.log(
          `[Auth] Email de vérification envoyé à: ${user.email}`
        );
      } catch (error) {
        console.error(
          "[Auth] Échec envoi email de vérification:",
          error
        );
        // Ne pas propager l'erreur pour ne pas bloquer l'inscription
      }
    },
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      isApproved: {
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [
    nextCookies(),
  ],
});
