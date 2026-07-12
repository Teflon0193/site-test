"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  FaArrowLeft,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";

import { isAxiosError } from "axios";
import { toast } from "sonner";

import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";

import {
  register,
  type RegisterData,
} from "@/services/auth";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | string;
  eventTitle?: string;
  onRegistrationSuccess?: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function getErrorMessage(
  error: unknown
): string {
  if (isAxiosError(error)) {
    const backendMessage =
      error.response?.data?.message;

    if (
      typeof backendMessage === "string"
    ) {
      return backendMessage;
    }

    if (error.code === "ERR_NETWORK") {
      return "Impossible de contacter le serveur backend.";
    }

    return (
      error.message ||
      "Une erreur réseau est survenue."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle = "cet événement",
  onRegistrationSuccess,
}: EventRegistrationModalProps) {
  const [form, setForm] =
    useState<FormState>(
      INITIAL_FORM_STATE
    );

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM_STATE);
      setLoading(false);
      setSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        isOpen &&
        !loading
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) {
    return null;
  }

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      return "Le prénom est obligatoire.";
    }

    if (!form.lastName.trim()) {
      return "Le nom est obligatoire.";
    }

    if (!form.email.trim()) {
      return "L’adresse email est obligatoire.";
    }

    if (!form.email.includes("@")) {
      return "L’adresse email est invalide.";
    }

    if (form.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Les mots de passe ne correspondent pas.";
    }

    return null;
  };

  const registerForEvent = async () => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {
      throw new Error(
        "Le compte a été créé, mais vous devez vous connecter avant de vous inscrire à l’événement."
      );
    }

    const backendUrl = (
      process.env
        .NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api"
    ).replace(/\/$/, "");

    const response = await fetch(
      `${backendUrl}/events/${eventId}/registrations`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data: unknown =
      await response.json().catch(
        () => null
      );

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message ===
          "string"
          ? data.message
          : "Impossible de vous inscrire à l’événement.";

      throw new Error(message);
    }

    return data;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setErrorMessage(null);

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(
        validationError
      );

      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const registerData: RegisterData =
        {
          email: form.email
            .trim()
            .toLowerCase(),

          password: form.password,

          first_name:
            form.firstName.trim(),

          last_name:
            form.lastName.trim(),

          phone:
            form.phone.trim() ||
            undefined,
        };

      await register(registerData);

      /*
       * Ton backend demande probablement
       * une vérification email après la
       * création du compte.
       *
       * L'inscription à l'événement sera
       * donc faite après connexion.
       */
      setSuccess(true);

      toast.success(
        "Compte créé avec succès. Vérifiez votre adresse email puis connectez-vous pour finaliser l’inscription."
      );

      onRegistrationSuccess?.();
    } catch (error: unknown) {
      console.error(
        "Erreur de création du compte :",
        error
      );

      const message =
        getErrorMessage(error);

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExistingUserRegistration =
    async () => {
      if (loading) {
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        await registerForEvent();

        setSuccess(true);

        toast.success(
          "Inscription à l’événement réussie."
        );

        onRegistrationSuccess?.();
      } catch (error: unknown) {
        console.error(
          "Erreur d’inscription à l’événement :",
          error
        );

        const message =
          getErrorMessage(error);

        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-registration-title"
    >
      <button
        type="button"
        aria-label="Fermer la fenêtre"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <h2
              id="event-registration-title"
              className="text-lg font-bold text-[#5C4033]"
            >
              Inscription à l’événement
            </h2>

            <p className="mt-1 text-sm text-[#5C4033]/60">
              {eventTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-[#5C4033] transition hover:bg-[#D1965B]/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {success ? (
            <div className="space-y-6 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <FaCheck className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#5C4033]">
                  Opération réussie
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5C4033]/65">
                  Votre demande a été enregistrée.
                  Consultez votre messagerie pour
                  vérifier votre compte si
                  nécessaire.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#D1965B] px-4 py-3 font-semibold text-white transition hover:bg-[#B97D47]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mb-6">
                <button
                  type="button"
                  onClick={() =>
                    void handleExistingUserRegistration()
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-[#D1965B] bg-white px-4 py-3 font-semibold text-[#D1965B] transition hover:bg-[#D1965B]/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  J’ai déjà un compte
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500">
                    ou créer un compte
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <GoogleAuthButton callbackURL="/espace-membre" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="registration-first-name"
                      className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                    >
                      Prénom
                    </label>

                    <input
                      id="registration-first-name"
                      type="text"
                      value={form.firstName}
                      onChange={(event) =>
                        updateField(
                          "firstName",
                          event.target.value
                        )
                      }
                      disabled={loading}
                      autoComplete="given-name"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registration-last-name"
                      className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                    >
                      Nom
                    </label>

                    <input
                      id="registration-last-name"
                      type="text"
                      value={form.lastName}
                      onChange={(event) =>
                        updateField(
                          "lastName",
                          event.target.value
                        )
                      }
                      disabled={loading}
                      autoComplete="family-name"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="registration-email"
                    className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                  >
                    Adresse email
                  </label>

                  <input
                    id="registration-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="email"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registration-phone"
                    className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                  >
                    Téléphone
                  </label>

                  <input
                    id="registration-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="tel"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registration-password"
                    className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                  >
                    Mot de passe
                  </label>

                  <input
                    id="registration-password"
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registration-confirm-password"
                    className="mb-1.5 block text-sm font-medium text-[#5C4033]"
                  >
                    Confirmer le mot de passe
                  </label>

                  <input
                    id="registration-confirm-password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D1965B] px-4 py-3 font-semibold text-white transition hover:bg-[#B97D47] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Traitement..."
                    : "Créer mon compte"}
                </button>
              </form>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#5C4033]/70 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <FaArrowLeft />
                Retour
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}