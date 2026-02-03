"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import SignupForm, {
  type SignupFormValues,
} from "@/app/components/auth/SignupForm";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const handleSignupSubmit = async (values: SignupFormValues) => {
    await signUp.email(
      {
        email: values.email,
        phone: values.phone,
        password: values.password,
        name: values.firstName + " " + values.lastName,
      },
      {
        onSuccess: () => {
          toast.success("Compte créé avec succès !");
          router.push("/auth/verify-email");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };

  return (
    <AuthLayout title="Créer un compte">
      <div className="space-y-10">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
            Nouveau <br />
            <span className="text-black">Compte</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Rejoignez la communauté CCAPAC
          </p>
        </div>

        <div className="space-y-8">
          <GoogleAuthButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-white px-6 text-zinc-300">OU</span>
            </div>
          </div>

          <SignupForm onSubmit={handleSignupSubmit} />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-all"
            >
              Se connecter
            </Link>
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground/60 px-4">
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
