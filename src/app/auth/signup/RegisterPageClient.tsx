"use client";

import type React from "react";
import { useState } from "react"; // ✅ added missing import
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import SignupForm, {
  type SignupFormValues,
} from "@/app/components/auth/SignupForm";
import { register } from "@/services/auth";
import { isAxiosError } from "axios";

export function RegisterPageClient({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const response = await register({
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone || "",
      });

      if (response.success) {
        toast.success(
          "Compte créé avec succès ! Un email de vérification vous a été envoyé."
        );
        router.push("/auth/verify-email");
      } else {
        toast.error(response.message || "Erreur lors de l'inscription");
      }
    } catch (error: unknown) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
          ? error.message
          : "Erreur lors de l'inscription";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Créer un compte">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Créer un compte
          </h1>
        </div>

        <div className="space-y-4">
          <GoogleAuthButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou s&apos;inscrire avec
              </span>
            </div>
          </div>

          <SignupForm
            initialEmail={initialEmail}
            onSubmit={handleSignupSubmit}
            loading={loading}
          />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary underline-offset-4 transition-all hover:text-primary/90 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>

        <div className="px-4 text-center text-xs text-muted-foreground/60">
          En créant un compte, vous acceptez nos{" "}
          <Link href="#" className="underline hover:text-foreground">
            Conditions d&apos;utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="#" className="underline hover:text-foreground">
            Politique de confidentialité
          </Link>
          .
        </div>
      </div>
    </AuthLayout>
  );
}