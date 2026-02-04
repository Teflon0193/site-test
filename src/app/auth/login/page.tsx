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
  const redirect = searchParams.get("redirect");
  const handleLoginSubmit = async (values: LoginFormValues) => {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          if (redirect) {
            router.push(redirect as string);
          } else {
            router.push("/espace-membre");
          }
          router.push("/espace-membre/admin");
        },

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
      <div className="space-y-10">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
            Espace <br />
            <span className="text-black">Membre</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Authentification
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
