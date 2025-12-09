"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import SignupForm, { type SignupFormValues } from "../auth/SignupForm";
import {
  FaEnvelope,
  FaCircleCheck,
  FaUsers,
  FaCalendar,
  FaBell,
  FaUserPlus,
  FaRightToBracket,
  FaArrowLeft,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
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
        },
        {
          onSuccess: async () => {
            const result = await createEventRegistrationAction(
              eventId,
              values.email,
              values.phone
            );

            if (result.success) {
              toast.success("Compte créé avec succès !");
              setStep("success");
            } else {
              toast.error(
                result.error || "Erreur lors de l'inscription à l'événement"
              );
            }
          },
          onError: (error) => {
            toast.error(error.error.message);
            throw new Error(error.error.message);
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const handleLoginClick = () => {
    handleClose();
    router.push(`/auth/login?redirect=/evenement/${eventSlug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[90%] sm:w-full max-w-2xl max-h-[90vh] sm:max-h-[95vh] flex flex-col p-0 overflow-hidden bg-background rounded-xl sm:rounded-2xl"
        showCloseButton={true}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {step === "info" && (
            <div className="flex flex-col h-full">
              <div className="pt-8 pb-6 px-6 sm:px-8 text-center space-y-3">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                    Rejoignez la communauté CCAPAC
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground max-w-md mx-auto">
                    Inscrivez-vous à{" "}
                    <strong className="text-foreground font-semibold">
                      {eventTitle}
                    </strong>{" "}
                    et profitez d&apos;une expérience privilégiée.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="px-6 sm:px-8 pb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FeatureCard
                    icon={<FaCalendar className="h-5 w-5" />}
                    title="Inscription simplifiée"
                    description="Accédez rapidement à tous nos événements futurs."
                  />
                  <FeatureCard
                    icon={<FaBell className="h-5 w-5" />}
                    title="Restez informé"
                    description="Recevez nos actualités et invitations exclusives."
                  />
                  <FeatureCard
                    icon={<FaUsers className="h-5 w-5" />}
                    title="Espace Membre"
                    description="Gérez votre profil et suivez vos activités."
                    className="sm:col-span-2"
                  />
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex-shrink-0 mt-0.5">
                    <FaEnvelope className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Inscription immédiate
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Votre place est réservée dès la création de votre compte,
                      en attendant sa validation.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Button
                      onClick={() => setStep("signup")}
                      size="lg"
                      className="flex-1 text-base font-semibold py-2 sm:h-12"
                    >
                      <FaUserPlus className="mr-2 h-5 w-5" />
                      Créer un compte
                    </Button>
                    <Button
                      onClick={handleLoginClick}
                      variant="outline"
                      size="lg"
                      className="flex-1 text-base font-semibold py-2 sm:h-12"
                    >
                      <FaRightToBracket className="mr-2 h-5 w-5" />
                      Se connecter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "signup" && (
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep("info")}
                  className="h-9 w-9 -ml-2"
                >
                  <FaArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-lg font-bold text-foreground leading-none">
                    Créer mon compte
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex gap-3">
                  <FaEnvelope className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Un email de confirmation vous sera envoyé. Votre inscription
                    à <strong>{eventTitle}</strong> sera maintenue pendant la
                    validation.
                  </p>
                </div>

                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <GoogleAuthButton />
                    <SignupForm onSubmit={handleSignup} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center space-y-6">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
                <FaCircleCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                  Félicitations !
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Votre inscription à{" "}
                  <strong className="text-foreground">{eventTitle}</strong> est
                  confirmée.
                </DialogDescription>
              </div>

              <div className="w-full max-w-sm bg-muted/50 rounded-lg p-5 border border-border text-left space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FaEnvelope className="h-4 w-4 text-muted-foreground" />
                  Vérifiez vos emails
                </h4>
                <p className="text-sm text-muted-foreground">
                  Un lien d&apos;activation vous a été envoyé. Cliquez dessus
                  pour finaliser la création de votre compte et accéder à votre
                  espace membre.
                </p>
              </div>

              <Button
                onClick={handleClose}
                size="lg"
                className="w-full max-w-xs"
              >
                Compris, merci !
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn("p-4 rounded-lg border border-border bg-card", className)}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
