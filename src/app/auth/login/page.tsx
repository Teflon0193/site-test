"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import {
  isAxiosError,
} from "axios";
import { toast } from "sonner";

import { AuthLayout } from "@/app/components/auth/AuthLayout";
import LoginForm, {
  type LoginFormValues,
} from "@/app/components/auth/LoginForm";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

const roleDestinations: Record<
  string,
  string
> = {
  MEMBER:
    "/espace-membre/membre",

  PROGRAMME:
    "/espace-membre/programme",

  REGISSEUR_GENERAL:
    "/espace-membre/regisseur",

  DIRECTION_ARTISTIQUE:
    "/espace-membre/direction-artistique",

  COMMUNICATION:
    "/espace-membre/communication",

  JURIDIQUE:
    "/espace-membre/juridique",

  FINANCE:
    "/espace-membre/finance",

  ADMIN:
    "/espace-membre/demandes-espaces",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedRedirect =
    searchParams.get("redirectUrl");

  const safeRequestedRedirect =
    requestedRedirect?.startsWith("/") &&
    !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : null;

  const { login } = useAuth();

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const handleSubmit = async (
    values: LoginFormValues
  ) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await login(
        values.email,
        values.password
      );

      const defaultDestination =
        roleDestinations[user.role] ||
        "/espace-membre";

      /*
       * Utiliser redirectUrl uniquement lorsqu'il
       * correspond à l'espace autorisé du rôle.
       */
      const roleBasePath =
        roleDestinations[user.role];

      const requestedRouteIsAllowed =
        safeRequestedRedirect &&
        roleBasePath &&
        (
          safeRequestedRedirect ===
            roleBasePath ||
          safeRequestedRedirect.startsWith(
            `${roleBasePath}/`
          ) ||
          safeRequestedRedirect ===
            "/espace-membre/profile"
        );

      const destination =
        requestedRouteIsAllowed
          ? safeRequestedRedirect
          : defaultDestination;

      toast.success("Connexion réussie", {
        description:
          `Bienvenue ${
            user.first_name || user.email
          }`,
      });

      router.replace(destination);
      router.refresh();
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      let message =
        "Erreur de connexion";

      if (
        isAxiosError<ApiErrorResponse>(
          err
        )
      ) {
        const status =
          err.response?.status;

        const backendMessage =
          err.response?.data?.message;

        if (status === 403) {
          message =
            backendMessage ||
            "Veuillez vérifier votre email avant de vous connecter.";

          try {
            await api.post(
              "/auth/resend-verification",
              {
                email: values.email
                  .trim()
                  .toLowerCase(),
              }
            );

            toast.info(
              "Un nouveau lien de vérification vous a été envoyé."
            );
          } catch (resendError) {
            console.error(
              "Erreur de renvoi de vérification :",
              resendError
            );
          }
        } else if (status === 401) {
          message =
            backendMessage ||
            "Email ou mot de passe incorrect.";
        } else if (status === 400) {
          message =
            backendMessage ||
            "Veuillez vérifier les informations saisies.";
        } else if (backendMessage) {
          message = backendMessage;
        } else if (
          err.code === "ERR_NETWORK"
        ) {
          message =
            "Impossible de contacter le serveur.";
        }
      } else if (
        err instanceof Error
      ) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleCallback =
    safeRequestedRedirect ||
    "/espace-membre";

  return (
    <AuthLayout title="Connexion">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Accédez à votre espace
          </h1>

          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à
            votre espace
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GoogleAuthButton
            callbackURL={googleCallback}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou continuer avec
              </span>
            </div>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={isLoading}
          />
        </div>

        <div className="text-center text-sm">
          <p>
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}