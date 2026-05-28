import Link from "next/link";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import MainLayout from "../components/layouts/MainLayout";
import DonationVerifier from "./DonationVerifier";

export default function DonationThankYouPage() {
  return (
    <MainLayout>
      <main className="bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
            Confirmation du don
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase leading-tight text-primary sm:text-4xl">
            Vérification du paiement
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
            Nous confirmons votre paiement avant de mettre à jour la collecte.
            Merci de patienter quelques instants.
          </p>

          <DonationVerifier />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#fundraising"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary/90"
            >
              <HeartHandshake className="h-4 w-4" />
              Voir la campagne
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-secondary/30 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-muted"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
