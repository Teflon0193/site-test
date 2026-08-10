"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Drama,
  Lightbulb,
  Music2,
  Palette,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const projectHighlights = [
  {
    title: "Création et spectacle vivant",
    description:
      "Des projets de théâtre, de danse et de performance pensés pour rapprocher les artistes et les publics.",
    category: "Scène",
    icon: Drama,
    color: "bg-[#D1965B]",
    accent: "bg-white/15 text-white",
  },
  {
    title: "Musique et nouvelles voix",
    description:
      "Des scènes ouvertes, rencontres musicales et initiatives qui accompagnent l’émergence de nouveaux talents.",
    category: "Musique",
    icon: Music2,
    color: "bg-[#5C4033]",
    accent: "bg-white/15 text-white",
  },
  {
    title: "Cinéma et création audiovisuelle",
    description:
      "Des projections, échanges et projets audiovisuels qui valorisent les récits, les auteurs et les images d’ici.",
    category: "Audiovisuel",
    icon: Clapperboard,
    color: "bg-[#EDE4DA]",
    accent: "bg-[#5C4033]/10 text-[#5C4033]",
  },
  {
    title: "Patrimoine, livre et transmission",
    description:
      "Des initiatives autour de la mémoire, du livre, des savoirs et de la transmission culturelle entre générations.",
    category: "Transmission",
    icon: BookOpenText,
    color: "bg-[#F2D4B5]",
    accent: "bg-[#5C4033]/10 text-[#5C4033]",
  },
];

const steps = [
  {
    number: "01",
    title: "Présentez votre idée",
    description:
      "Expliquez le concept, les objectifs, le public visé et l’impact attendu.",
  },
  {
    number: "02",
    title: "Étude par le Centre",
    description:
      "L’équipe examine la pertinence culturelle, la faisabilité et les besoins du projet.",
  },
  {
    number: "03",
    title: "Échange et orientation",
    description:
      "Si l’idée est retenue, le Centre vous contacte pour préciser la suite et l’accompagnement possible.",
  },
];

const supportAreas = [
  "Accompagnement artistique",
  "Orientation et structuration",
  "Mise à disposition d’un espace",
  "Appui technique",
  "Communication et visibilité",
  "Mise en relation avec des partenaires",
];

export default function ProposerProjetIntroductionPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#402C22] px-6 py-10 text-white shadow-[0_24px_70px_rgba(64,44,34,0.2)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-[#D1965B]/30 blur-3xl" />
        <div className="absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F0C79F]">
              <Sparkles className="h-4 w-4" />
              Vos idées font vivre la culture
            </div>

            <h1 className="mt-6 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Une idée culturelle peut devenir
              <span className="block text-[#E7B57F]">
                un projet qui rassemble.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Le CCAPAC – Grand Tambour accueille les
              propositions d’artistes, de collectifs,
              d’associations et de citoyens souhaitant
              contribuer à la vie culturelle. Découvrez
              les formes de projets que le Centre peut
              étudier, puis présentez-nous votre idée.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 bg-[#D1965B] px-6 font-bold text-white hover:bg-[#E0A66C]"
              >
                <Link href="/espace-membre/membre/proposer-projet/formulaire">
                  Remplir le formulaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <a
                href="#decouvrir"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Découvrir les projets
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3 pt-8">
                <div className="flex min-h-40 flex-col justify-between rounded-[1.7rem] bg-[#D1965B] p-5 shadow-xl">
                  <Palette className="h-8 w-8 text-white" />
                  <p className="font-bold leading-snug">
                    Créer, imaginer et transmettre
                  </p>
                </div>
                <div className="rounded-[1.7rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-3xl font-black text-[#E7B57F]">
                    01
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/65">
                    Une idée claire pour commencer
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[1.7rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <Users className="h-7 w-7 text-[#E7B57F]" />
                  <p className="mt-8 text-sm font-bold">
                    Des projets pensés pour les publics
                  </p>
                </div>
                <div className="flex min-h-48 flex-col justify-between rounded-[1.7rem] bg-[#F1E6DA] p-5 text-[#402C22] shadow-xl">
                  <Lightbulb className="h-8 w-8 text-[#B66F38]" />
                  <div>
                    <p className="text-xl font-black">
                      Votre projet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#5C4033]/65">
                      Une nouvelle histoire à construire
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="decouvrir" className="scroll-mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D1965B]">
              Projets et initiatives culturelles
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#402C22] sm:text-3xl">
              Des idées qui prennent différentes formes
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#5C4033]/60">
            Le Centre favorise les projets qui créent du
            lien, valorisent les talents et rendent la
            culture accessible au plus grand nombre.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projectHighlights.map((project, index) => {
            const Icon = project.icon;
            const dark = index < 2;

            return (
              <article
                key={project.title}
                className={`group relative min-h-64 overflow-hidden rounded-[1.8rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${project.color} ${
                  dark ? "text-white" : "text-[#402C22]"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[24px] border-current opacity-[0.06] transition group-hover:scale-110" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${project.accent}`}
                    >
                      {project.category}
                    </span>
                    <Icon className="h-7 w-7 opacity-80" />
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="text-xl font-black sm:text-2xl">
                      {project.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-xl text-sm leading-6 ${
                        dark
                          ? "text-white/72"
                          : "text-[#5C4033]/65"
                      }`}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[#D1965B]/15 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#F5E8DC] p-3 text-[#B66F38]">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D1965B]">
                Votre parcours
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#402C22]">
                Comment ça fonctionne ?
              </h2>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 rounded-2xl border border-[#EDE4DC] bg-[#FCFAF8] p-4 sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#402C22] text-xs font-black text-white">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-[#402C22]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#5C4033]/60">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#F0E5DA] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-[#B66F38] shadow-sm">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B66F38]">
                Accompagnement
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#402C22]">
                Ce que vous pouvez demander
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {supportAreas.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-xl bg-white/75 p-3.5 text-sm font-semibold text-[#5C4033]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D1965B]" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#D1965B]/20 bg-white/55 p-4 text-xs leading-6 text-[#5C4033]/65">
            L’envoi d’une proposition ne constitue pas une
            réservation d’espace ni un engagement financier
            ou contractuel du Centre. Chaque projet est étudié
            selon sa pertinence et sa faisabilité.
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#D1965B] px-6 py-9 text-white sm:px-10 sm:py-11">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
              Passez de l’idée à la proposition
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Vous avez un projet à nous présenter ?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Préparez une description claire de votre idée,
              de ses objectifs, de son public et des besoins
              d’accompagnement souhaités.
            </p>
          </div>

          <Button
            asChild
            className="h-12 shrink-0 bg-white px-6 font-bold text-[#5C4033] hover:bg-[#F6EEE7]"
          >
            <Link href="/espace-membre/membre/proposer-projet/formulaire">
              Remplir le formulaire
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}