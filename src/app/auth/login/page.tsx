"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import LoginForm, {
  type LoginFormValues,
} from "../../components/auth/LoginForm";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectUrl");
  const handleLoginSubmit = async (values: LoginFormValues) => {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: redirect ? redirect as string : "/espace-membre",
      },
      {
        onSuccess: () => router.push(redirect ? redirect as string : "/espace-membre"),
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            toast.error(
              "Veillez à vérifier votre email pour accéder à votre espace.",
            );
        }
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <AuthLayout title="Connexion">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bon retour parmi nous
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </div>

        <div className="space-y-4">
          <GoogleAuthButton callbackURL={redirect ?? "/espace-membre"} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou continuer avec
              </span>
            </div>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-all"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
