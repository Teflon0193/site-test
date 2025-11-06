"use client";

import type React from "react";
import Link from "next/link";
//
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
//
import SignupForm, {
  type SignupFormValues,
} from "@/app/components/auth/SignupForm";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const handleSignupSubmit = async (values: SignupFormValues) => {
    try {
      await signUp.email({
        email: values.email,
        password: values.password,
        name: values.firstName + " " + values.lastName,
      });
      // Initialiser le profil membre (idempotent)
      await fetch("/api/members/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          phone: values.phone,
          name: values.firstName + " " + values.lastName,
        }),
      });
      router.push("/espace-membre");
    } catch (error) {
      console.log("Signup error:", error);
      throw error;
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign-up initiated");
    // À implémenter avec une vraie intégration Google OAuth
  };

  return (
    <AuthLayout title="Créer un compte">
      <Card className="rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader className="space-y-1 py-4">
          <CardTitle className="text-2xl uppercase font-bold drop-shadow-sm text-center">
            Créer un compte
          </CardTitle>
          <CardDescription>
            Rejoignez la communauté CCAPAC et profitez d&apos;avantages
            exclusifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleAuthButton onClick={handleGoogleSignUp} />

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                OU
              </span>
            </div>
          </div>

          <SignupForm onSubmit={handleSignupSubmit} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
