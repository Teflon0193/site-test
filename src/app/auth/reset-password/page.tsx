"use client";

import type React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import ResetPasswordForm, {
  type ResetPasswordFormValues,
} from "@/app/components/auth/ResetPasswordForm";
import { resetPassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  if (error === "INVALID_TOKEN" || !token) {
    return (
      <main>
      <div className="space-y-8">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
            Lien <br />
            <span className="text-red-600">Invalide</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Erreur de sécurité ou expiration
          </p>
        </div>
          <p className="text-sm text-muted-foreground">
            Ce lien de réinitialisation n&apos;est plus valide. Il a peut-être
            expiré ou a déjà été utilisé.
          </p>
        </div>

        <div className="bg-zinc-50 border-l-4 border-black p-6">
          <p className="text-xs text-black font-bold uppercase tracking-wider leading-relaxed">
            📧 Vous pouvez demander un nouveau lien de réinitialisation. Les jetons de sécurité expirent après 1 heure.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/forgot-password"
            className="w-full inline-flex items-center justify-center h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300"
          >
            NOUVELLE DEMANDE
          </Link>
          <Link
            href="/auth/login"
            className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
          >
            RETOUR À LA CONNEXION
          </Link>
        
      </div>
      </main>
      
    );
  }

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    const { error } = await resetPassword({
      newPassword: values.newPassword,
      token: token,
    });

    if (error) {
      toast.error(error.message || "Une erreur est survenue");
      return;
    }

    toast.success("Mot de passe réinitialisé avec succès !");
    router.push("/auth/login");
  };

  return (
    <div className="space-y-10">
      <div className="text-center lg:text-left space-y-4">
        <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
          Réinitialiser <br />
          <span className="text-black">Mot de Passe</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Sécurisation de votre accès membre
        </p>
      </div>

      <div className="space-y-4">
        <ResetPasswordForm onSubmit={handleSubmit} />
      </div>

      <div className="bg-zinc-50 border-2 border-zinc-100 p-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-black mb-4">
          Conseils de sécurité :
        </p>
        <ul className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 space-y-2">
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary"></div> AU MOINS 8 CARACTÈRES</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary"></div> LETTRES, CHIFFRES & SYMBOLES</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary"></div> ÉVITEZ LES INFOS PERSONNELLES</li>
        </ul>
      </div>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          RETOUR À LA CONNEXION
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Réinitialiser le mot de passe">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
