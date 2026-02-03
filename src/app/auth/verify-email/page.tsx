"use client";

import { AuthLayout } from "@/app/components/auth/AuthLayout";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Vérification">
      <div className="space-y-10">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
            Vérifiez <br />
            <span className="text-primary">Email</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Activation de votre accès membre — CCAPAC
          </p>
        </div>

        <div className="bg-zinc-50 border-l-4 border-black p-6 space-y-6 text-left animate-slide-up">
          <div className="space-y-4 text-xs text-black font-bold uppercase tracking-wider leading-relaxed">
            <p>Nous avons envoyé un message de confirmation à votre adresse.</p>
            <p className="text-zinc-500">
              Veuillez cliquer sur le lien d&apos;activation pour authentifier
              votre compte et accéder à nos services.
            </p>
          </div>

          <div className="space-y-2 pt-6 border-t border-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Problèmes fréquents :
            </p>
            <ul className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 space-y-2">
              <li className="flex items-center gap-2 text-primary tracking-[0.2em]">
                • VÉRIFIEZ VOS SPAMS
              </li>
              <li className="flex items-center gap-2">
                • DURÉE DU LIEN : 24 HEURES
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6">
          <Link
            href="/auth/login"
            className="w-full inline-flex items-center justify-center h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300"
          >
            RETOUR À LA CONNEXION
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
