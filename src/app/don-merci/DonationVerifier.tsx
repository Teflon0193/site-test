"use client";

import { useEffect, useState } from "react";

type VerificationState = "idle" | "loading" | "succeeded" | "pending" | "failed";

export default function DonationVerifier() {
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState(
    "Votre retour de paiement a bien ete pris en compte."
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
            "Votre paiement est encore en cours de confirmation. Les statistiques seront mises a jour apres validation."
          );
          return;
        }

        setState("failed");
        setMessage(
          "Le paiement n'a pas pu etre confirme. Vous pouvez reessayer depuis la campagne."
        );
      } catch {
        setState("pending");
        setMessage(
          "Nous n'avons pas pu confirmer le paiement immediatement. La collecte sera mise a jour des que la confirmation sera recue."
        );
      }
    }

    verifyDonation(donationId);
  }, []);

  if (state === "idle") {
    return null;
  }

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-md border border-secondary/20 bg-white p-4 text-sm font-semibold text-primary">
      {state === "loading" ? "Confirmation du paiement..." : message}
    </div>
  );
}
