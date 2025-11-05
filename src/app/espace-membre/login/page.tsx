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
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/app/components/auth/layout";
import LoginForm, {
  type LoginFormValues,
} from "../../components/auth/LoginForm";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    console.log("Google sign-in initiated");
    // À implémenter avec une vraie intégration Google OAuth
  };

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      await signIn.email({
        email: values.email,
        password: values.password,
      });
      router.push("/espace-membre/admin");
    } catch (error) {
      console.log("Signup error:", error);
      throw error;
    }
  };

  return (
    <AuthLayout title="Connexion">
      <Card className="rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader className="space-y-1 py-4">
          <CardTitle className="text-2xl uppercase font-bold drop-shadow-sm text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-base">
            Entrez vos identifiants pour accéder à votre espace membre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleAuthButton onClick={handleGoogleSignIn} />

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="sr-only">Mot de passe</span>
            </div>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/espace-membre/signup"
              className="text-primary font-semibold hover:underline"
            >
              Créer un compte
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
