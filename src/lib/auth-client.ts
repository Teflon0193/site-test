import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Dans le navigateur, on cible toujours l'origine de la page en cours
  // (ex. https://www.centreculturel.cd) pour éviter tout appel cross-origin
  // entre les variantes www / non-www. Côté serveur (SSR), on retombe sur
  // la variable d'environnement.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [inferAdditionalFields({
    user: {
      phone: {
        type: "string",
      }
    }
  })],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
} = authClient;
