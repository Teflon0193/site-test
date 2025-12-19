import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendPasswordResetEmail } from "@/services/mailServices";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      sendPasswordResetEmail(user.email, user.name, url).catch((error) => {
        console.error("[Auth] Échec envoi email de réinitialisation:", error);
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`[Auth] Mot de passe réinitialisé pour: ${user.email}`);
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
