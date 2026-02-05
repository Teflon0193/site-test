"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignupForm, { type SignupFormValues } from "../auth/SignupForm";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { signUp } from "@/lib/auth-client";
import { GoogleAuthButton } from "@/app/components/auth/GoogleAuthButton";
import { createEventRegistrationAction } from "@/app/evenement/[slug]/actions";
import { toast } from "sonner";

interface EventRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventSlug: string;
  eventId: string;
}

type ModalStep = "info" | "signup" | "success";

export default function EventRegistrationModal({
  open,
  onOpenChange,
  eventTitle,
  eventSlug,
  eventId,
}: EventRegistrationModalProps) {
  const [step, setStep] = useState<ModalStep>("info");
  const router = useRouter();

  const handleClose = () => {
    setStep("info");
    onOpenChange(false);
  };

  const handleSignup = async (values: SignupFormValues) => {
    try {
      await signUp.email(
        {
          email: values.email,
          password: values.password,
          name: `${values.firstName} ${values.lastName}`,
          phone: values.phone ?? "",
          callbackURL: `/auth/callback?eventId=${eventId}&eventSlug=${eventSlug}`,
        },
        {
          onSuccess: async () => {
            const result = await createEventRegistrationAction(
              eventId,
              values.email,
              values.phone,
            );

            if (result.success) {
              setStep("success");
            } else {
              toast.error(
                result.error || "Erreur lors de l'inscription à l'événement",
              );
            }
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginClick = () => {
    onOpenChange(false);
    router.push(`/auth/login?redirectUrl=/evenement/${eventSlug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-md w-full p-0 rounded-none bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        showCloseButton={true}
      >
        <div className="overflow-y-auto flex-1">
          {step === "info" && (
            <div className="flex flex-col h-full">
              <div className="bg-primary p-5 sm:p-8 border-b-4 border-black text-left">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase leading-[0.8]">
                    REJOIGNEZ <br />
                    <span className="text-black italic">L&apos;ÉVÉNEMENT</span>
                  </DialogTitle>
                  <div className="w-12 h-1.5 bg-white"></div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 leading-relaxed">
                    INSCRIPTION POUR : <br />
                    <span className="text-black">{eventTitle}</span>
                  </p>
                </DialogHeader>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <button
                    onClick={() => setStep("signup")}
                    className="w-full cursor-pointer h-12 sm:h-14 bg-black text-white text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 border-2 border-black"
                  >
                    CRÉER UN COMPTE
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200"></div>
                    </div>
                    <span className="relative bg-white px-4 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400">
                      OU
                    </span>
                  </div>

                  <button
                    onClick={handleLoginClick}
                    className="w-full cursor-pointer h-12 sm:h-14 bg-white text-black text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-zinc-50 transition-all duration-300"
                  >
                    J&apos;AI DÉJÀ UN COMPTE
                  </button>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 leading-relaxed max-w-[200px] mx-auto">
                    L&apos;INSCRIPTION EST GRATUITE ET VOUS DONNE ACCÈS À NOTRE
                    MÉMOIRE CULTURELLE.
                  </p>
                </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-black/10 pointer-events-none"></div>
            </div>
          )}

          {step === "signup" && (
            <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 border-b-4 border-black pb-4 sm:pb-6">
                <button
                  onClick={() => setStep("info")}
                  className="p-2 cursor-pointer bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaArrowLeft className="w-3 h-3" />
                </button>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
                  CRÉER UN <span className="text-black">COMPTE</span>
                </h2>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <GoogleAuthButton
                  callbackURL={`/auth/callback?eventId=${eventId}&eventSlug=${eventSlug}`}
                />

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400">
                    OU
                  </span>
                </div>

                <SignupForm onSubmit={handleSignup} />
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col h-full">
              <div className="bg-black p-5 sm:p-8 flex flex-col items-center justify-center border-b-4 border-black text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary flex items-center justify-center mb-6 border-4 border-white animate-slide-up">
                  <FaCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white text-center leading-none">
                  INSCRIPTION <br />
                  <span className="text-primary italic">RÉUSSIE !</span>
                </h2>
              </div>

              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 text-center">
                <div className="space-y-4">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
                    VOTRE PLACE POUR <br />
                    <span className="text-black font-black">
                      {eventTitle}
                    </span>{" "}
                    <br />
                    EST DÉSORMAIS RÉSERVÉE.
                  </p>
                  <div className="w-12 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="bg-zinc-50 border-2 border-zinc-200 p-4 sm:p-6">
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 leading-relaxed text-left italic">
                    UN EMAIL DE CONFIRMATION A ÉTÉ ENVOYÉ. VEUILLEZ CLIQUER SUR
                    LE LIEN POUR ACTIVER VOTRE COMPTE ET FINALISER L&apos;ACCÈS.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full cursor-pointer h-12 sm:h-14 bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 border-2 border-black"
                >
                  TERMINER
                </button>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-black/10 pointer-events-none"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
