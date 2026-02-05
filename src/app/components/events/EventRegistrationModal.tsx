"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
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
          phone: values.phone,
        },
        {
          onSuccess: async () => {
            const result = await createEventRegistrationAction(
              eventId,
              values.email,
              values.phone
            );

            if (result.success) {
              setStep("success");
            } else {
              toast.error(
                result.error || "Erreur lors de l'inscription à l'événement"
              );
            }
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginClick = () => {
    onOpenChange(false);
    router.push(`/auth/login?redirect=/evenement/${eventSlug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md w-full p-6 sm:p-8 rounded-lg bg-background border-muted/20 shadow-xl"
        showCloseButton={true}
      >
        {step === "info" && (
          <div className="space-y-6 text-center">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Rejoignez l&apos;événement
              </DialogTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vous êtes sur le point de vous inscrire à <br />
                <span className="font-medium text-foreground">
                  {eventTitle}
                </span>
              </p>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => setStep("signup")}
                className="w-full cursor-pointer h-11 text-base font-medium"
              >
                Créer un compte pour m&apos;inscrire
              </Button>

              <div className="text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider bg-background px-2 relative z-10">
                  ou
                </span>
                <div className="h-px w-full bg-border -mt-2 opacity-50 absolute left-0 right-0" />
              </div>

              <Button
                variant="outline"
                onClick={handleLoginClick}
                className="w-full cursor-pointer h-11 text-base font-medium border-muted/40 hover:bg-muted/10 hover:text-foreground"
              >
                J&apos;ai déjà un compte
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto pt-2">
              L&apos;inscription est gratuite et vous donne accès à
              d&apos;autres avantages exclusifs.
            </p>
          </div>
        )}

        {step === "signup" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-2">
              <button
                onClick={() => setStep("info")}
                className="p-1 cursor-pointer -ml-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/10"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold text-foreground">
                Créer un compte
              </h2>
            </div>

            <div className="space-y-5">
              <GoogleAuthButton
                callbackURL={`/auth/callback?eventId=${eventId}&eventSlug=${eventSlug}`}
              />

              <div className="relative text-center my-2">
                <span className="bg-background px-2 text-xs text-muted-foreground uppercase">
                  ou
                </span>
                <div className="absolute inset-0 top-1/2 border-t border-muted/20 -z-10"></div>
              </div>

              <SignupForm onSubmit={handleSignup} />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 mb-2">
              <FaCheck className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Inscription réussie !
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Votre place pour <strong>{eventTitle}</strong> est réservée.
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              Un email de confirmation a été envoyé à votre adresse. Veuillez
              cliquer sur le lien pour activer votre compte.
            </div>

            <Button onClick={handleClose} className="w-full h-11">
              Terminer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
