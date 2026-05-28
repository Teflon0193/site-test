"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

type VerificationState = "idle" | "loading" | "succeeded" | "pending" | "failed";

export default function DonationVerifier() {
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState(
    "Nous confirmons votre paiement."
  );

  useEffect(() => {
    const donationId = sessionStorage.getItem("ccapac.last_donation_id");

    if (!donationId) {
      return;
    }

    async function verifyDonation(id: string) {
      setState("loading");

      try {
        const response = await fetch(`/api/fundraising/donations/${id}/verify`, {
          method: "POST",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
              "Nous ne pouvons pas confirmer le paiement pour le moment."
          );
        }

        if (data.status === "succeeded") {
          setState("succeeded");
          setMessage("Votre don est confirme. Merci pour votre soutien.");
          sessionStorage.removeItem("ccapac.last_donation_id");
          return;
        }

        if (data.status === "pending") {
          setState("pending");
          setMessage(
            "Votre paiement est encore en cours de confirmation."
          );
          return;
        }

        setState("failed");
        setMessage(
          "Le paiement n'a pas pu être confirmé. Vous pouvez réessayer depuis la campagne."
        );
      } catch {
        setState("pending");
        setMessage(
          "Nous n'avons pas pu confirmer le paiement immédiatement. La collecte sera mise à jour dès que la confirmation sera reçue."
        );
      }
    }

    verifyDonation(donationId);
  }, []);

  if (state === "idle") {
    return null;
  }

  const isSucceeded = state === "succeeded";
  const isFailed = state === "failed";
  const Icon = isSucceeded ? CheckCircle2 : isFailed ? XCircle : Clock3;

  return (
    <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-md border border-secondary/20 bg-white p-4 text-left text-sm font-semibold text-primary">
      <span
        className={`grid h-10 w-10 flex-none place-items-center rounded-full ${
          isSucceeded
            ? "bg-green-100 text-green-800"
            : isFailed
            ? "bg-red-100 text-red-800"
            : "bg-secondary/10 text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="pt-0.5">
        {state === "loading" ? "Confirmation du paiement..." : message}
      </span>
    </div>
  );
}
