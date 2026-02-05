"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import ForgotPasswordForm, {
  type ForgotPasswordFormValues,
} from "@/app/components/auth/ForgotPasswordForm";
import { requestPasswordReset } from "@/lib/auth-client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error(error.message || "Une erreur est survenue");
      return;
    }

    setSentEmail(values.email);
    setEmailSent(true);
    toast.success("Email de réinitialisation envoyé !");
  };

  return (
    <AuthLayout title="Mot de passe oublié">
      <div className="space-y-6">
        {!emailSent ? (
          <div className="space-y-10">
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
                Accès <br />
                <span className="text-primary">Oublié</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Récupération de vos identifiants member
              </p>
            </div>

            <div className="space-y-8">
              <ForgotPasswordForm onSubmit={handleSubmit} />

              <div className="text-center pt-6">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors group"
                >
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  RETOUR À LA CONNEXION
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-10">
              <div className="text-center lg:text-left space-y-4">
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
                  Email <br />
                  <span className="text-green-600">Envoyé</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Vérifiez votre boîte de réception
                </p>
              </div>

              <div className="bg-zinc-50 border-l-4 border-black p-6 space-y-4 text-left">
                <p className="text-xs text-black font-bold uppercase tracking-wider">
                  Un lien de réinitialisation a été transmis à : <br />
                  <span className="text-primary">{sentEmail}</span>
                </p>

                <div className="space-y-2 pt-2 border-t border-zinc-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Prochaines étapes :
                  </p>
                  <ul className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary"></div> CLIQUEZ SUR LE
                      LIEN REÇU
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary"></div> CRÉEZ VOTRE
                      NOUVEAU PASSE
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
                >
                  RENVOYER OU CHANGER D&apos;EMAIL
                </button>

                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300"
                >
                  RETOUR À LA CONNEXION
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
