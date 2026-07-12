"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileClock,
  FilePlus2,
  Files,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "../../components/ui/card";
import { useAuth } from "@/context/AuthContext";

const shortcuts = [
  {
    title: "Nouvelle demande",
    description:
      "Créez une nouvelle demande d’occupation d’espace.",
    href: "/espace-membre/membre/nouvelle-demande",
    icon: FilePlus2,
  },
  {
    title: "Mes demandes",
    description:
      "Consultez les demandes en attente de validation.",
    href: "/espace-membre/membre/demandes",
    icon: Files,
  },
  {
    title: "Historique",
    description:
      "Retrouvez vos demandes traitées et leurs décisions.",
    href: "/espace-membre/membre/historique",
    icon: FileClock,
  },
  {
    title: "Mon profil",
    description:
      "Consultez et mettez à jour vos informations.",
    href: "/espace-membre/profile",
    icon: User,
  },
];

export default function MemberHomePage() {
  const { user } = useAuth();

  const fullName =
    `${user?.first_name || ""} ${
      user?.last_name || ""
    }`.trim() || "Membre";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wider text-white/80">
          Espace personnel
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Bienvenue, {fullName}
        </h1>

        <p className="mt-3 max-w-2xl text-white/90">
          Créez une demande d’espace et suivez son
          traitement par les différents services du
          CCAPAC.
        </p>

        <Button
          asChild
          className="mt-6 bg-white text-[#5C4033] hover:bg-[#F3EEE5]"
        >
          <Link href="/espace-membre/membre/nouvelle-demande">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Créer une demande
          </Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#5C4033]">
          Actions rapides
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Card
                key={shortcut.href}
                className="group border-[#D1965B]/20 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D1965B]/10 text-[#D1965B]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-semibold text-[#5C4033]">
                  {shortcut.title}
                </h3>

                <p className="mt-2 text-sm text-[#5C4033]/70">
                  {shortcut.description}
                </p>

                <Link
                  href={shortcut.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[#D1965B]"
                >
                  Ouvrir

                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}