"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCircleCheck, FaClock } from "react-icons/fa6";
import { toast } from "sonner";

import { Button } from "../ui/button";
import EventRegistrationModal from "./EventRegistrationModal";
import {
  checkEventRegistration,
  registerEventAction,
} from "@/app/evenement/[slug]/actions";

interface RegisterButtonUser {
  id: number | string;
  emailVerified: boolean | number;
}

interface RegisterButtonProps {
  eventId: string | number;
  eventTitle: string;
  eventSlug?: string;
  isRegistrationOpen?: boolean;
  user?: RegisterButtonUser | null;
}

export default function RegisterButton({
  eventId,
  eventTitle,
  isRegistrationOpen = true,
  user = null,
}: RegisterButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const normalizedEventId = String(eventId);
  const emailVerified = Boolean(user?.emailVerified);

  useEffect(() => {
    if (!user || !isRegistrationOpen) return;

    void checkEventRegistration(normalizedEventId).then((result) => {
      setIsRegistered(Boolean(result.isRegistered));
      setRegistrationStatus(result.status || null);
    });
  }, [user, normalizedEventId, isRegistrationOpen]);

  useEffect(() => {
    if (
      searchParams.get("registered") !== "true" ||
      !user ||
      !isRegistrationOpen
    ) {
      return;
    }

    void checkEventRegistration(normalizedEventId).then((result) => {
      setIsRegistered(Boolean(result.isRegistered));
      setRegistrationStatus(result.status || null);
    });
  }, [searchParams, user, normalizedEventId, isRegistrationOpen]);

  const handleDirectRegister = async () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerEventAction(normalizedEventId);

      if (result.success) {
        toast.success(result.message || "Vous êtes inscrit à cet événement !");
        setIsRegistered(true);
        setRegistrationStatus("PENDING");
        return;
      }

      if (result.redirectTo) {
        router.push(result.redirectTo);
        return;
      }

      toast.error(result.error || "Erreur lors de l'inscription");
    } catch (error: unknown) {
      console.error("Erreur d'inscription :", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRegistrationOpen) return null;

  if (user && !emailVerified) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6 sm:max-w-sm">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-lg sm:p-4">
          <div className="flex items-start gap-3">
            <FaClock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Email non vérifié
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Veuillez vérifier votre adresse email avant de vous inscrire.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <Button
          size="lg"
          disabled
          className="h-12 cursor-not-allowed bg-green-500 px-4 text-white shadow-2xl hover:bg-green-500 sm:h-14 sm:px-6"
        >
          <FaCircleCheck className="mr-2 h-5 w-5" />
          <span className="whitespace-nowrap text-sm font-bold sm:text-lg">
            {registrationStatus === "CONFIRMED"
              ? "Inscription confirmée"
              : "Déjà inscrit"}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <Button
          size="lg"
          type="button"
          onClick={() => void handleDirectRegister()}
          disabled={isSubmitting}
          className="h-12 bg-accent px-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:px-6"
        >
          <span className="whitespace-nowrap text-sm font-bold text-black sm:text-lg">
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </span>
        </Button>
      </div>

      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={eventTitle}
        eventId={normalizedEventId}
        onRegistrationSuccess={() => {
          setIsModalOpen(false);
          setIsRegistered(true);
          setRegistrationStatus("PENDING");
        }}
      />
    </>
  );
}
