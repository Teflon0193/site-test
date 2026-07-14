
"use client";

import {
  Suspense,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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
  MEMBER: "/espace-membre/membre",
  PROGRAMME: "/espace-membre/programme",
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
  SUPERVISEUR:
    "/espace-membre/superviseur",
  ADMIN:
    "/espace-membre/admin",
};

function LoginContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const requestedRedirect =
    searchParams.get(
      "redirectUrl"
    );

  const safeRequestedRedirect =
    requestedRedirect?.startsWith(
      "/"
    ) &&
    !requestedRedirect.startsWith(
      "//"
    )
      ? requestedRedirect
      : null;

  const { login } = useAuth();

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

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

      const normalizedRole =
        user.role
          ?.trim()
          .toUpperCase();

      const defaultDestination =
        roleDestinations[
          normalizedRole
        ] ||
        "/espace-membre";

      /*
       * redirectUrl est utilisé uniquement
       * s'il appartient à l'espace du rôle.
       */
      const roleBasePath =
        roleDestinations[
          normalizedRole
        ];

      const requestedRouteIsAllowed =
        Boolean(
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
            )
        );

      const destination =
        requestedRouteIsAllowed &&
        safeRequestedRedirect
          ? safeRequestedRedirect
          : defaultDestination;

      toast.success(
        "Connexion réussie",
        {
          description:
            `Bienvenue ${
              user.first_name ||
              user.email
            }`,
        }
      );

      /*
       * Ne pas utiliser router.refresh()
       * ici : AuthContext met déjà l'utilisateur
       * à jour avant la redirection.
       */
      router.replace(destination);
    } catch (err: unknown) {
      console.error(
        "Erreur de connexion :",
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
          err.response?.data
            ?.message;

        if (status === 403) {
          message =
            backendMessage ||
            "Veuillez vérifier votre email avant de vous connecter.";

          try {
            await api.post(
              "/auth/resend-verification",
              {
                email:
                  values.email
                    .trim()
                    .toLowerCase(),
              }
            );

            toast.info(
              "Un nouveau lien de vérification vous a été envoyé."
            );
          } catch (
            resendError: unknown
          ) {
            console.error(
              "Erreur de renvoi de vérification :",
              resendError
            );
          }
        } else if (
          status === 401
        ) {
          message =
            backendMessage ||
            "Email ou mot de passe incorrect.";
        } else if (
          status === 400
        ) {
          message =
            backendMessage ||
            "Veuillez vérifier les informations saisies.";
        } else if (
          backendMessage
        ) {
          message =
            backendMessage;
        } else if (
          err.code ===
          "ERR_NETWORK"
        ) {
          message =
            "Impossible de contacter le serveur.";
        } else if (
          err.message
        ) {
          message =
            err.message;
        }
      } else if (
        err instanceof Error
      ) {
        message =
          err.message;
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
            Entrez vos identifiants
            pour accéder à votre espace
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
            callbackURL={
              googleCallback
            }
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
            onSubmit={
              handleSubmit
            }
            loading={
              isLoading
            }
          />
        </div>

        <div className="text-center text-sm">
          <p>
            Vous n&apos;avez pas
            de compte ?{" "}
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

function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="text-sm text-muted-foreground">
          Chargement de la connexion...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <LoginLoading />
      }
    >
      <LoginContent />
    </Suspense>
  );
}
