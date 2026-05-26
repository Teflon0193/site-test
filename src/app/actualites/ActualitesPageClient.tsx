"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  FileText,
  Newspaper,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Actualite, ActualiteMois, ActualiteType } from "@/types/actualite";

const typeLabels: Record<ActualiteType, string> = {
  NEWSLETTER: "Newsletter",
  COMMUNIQUE: "Communique",
  POINT_PRESSE: "Point de presse",
};

const typeOptions: Array<{ value: ActualiteType | "TOUS"; label: string }> = [
  { value: "TOUS", label: "Tous" },
  { value: "NEWSLETTER", label: "Newsletters" },
  { value: "COMMUNIQUE", label: "Communiques" },
  { value: "POINT_PRESSE", label: "Points de presse" },
];

const moisOptions: ActualiteMois[] = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

interface ActualitesPageClientProps {
  actualites: Actualite[];
  isAuthenticated: boolean;
}

const normalize = (value?: string | number) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function ActualitesPageClient({
  actualites,
  isAuthenticated,
}: ActualitesPageClientProps) {
  const router = useRouter();
  const [type, setType] = useState<ActualiteType | "TOUS">("TOUS");
  const [annee, setAnnee] = useState("TOUS");
  const [mois, setMois] = useState<ActualiteMois | "TOUS">("TOUS");
  const [search, setSearch] = useState("");
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<
    number | null
  >(actualites.find((actualite) => actualite.type === "NEWSLETTER")?.id ?? null);

  const annees = useMemo(
    () =>
      Array.from(
        new Set(actualites.map((actualite) => actualite.annee).filter(Boolean))
      ).sort((a, b) => Number(b) - Number(a)),
    [actualites]
  );

  const filteredActualites = useMemo(() => {
    const searchTerm = normalize(search.trim());

    return actualites.filter((actualite) => {
      const matchesType = type === "TOUS" || actualite.type === type;
      const matchesAnnee =
        annee === "TOUS" || actualite.annee?.toString() === annee;
      const matchesMois = mois === "TOUS" || actualite.mois === mois;
      const matchesSearch =
        !searchTerm ||
        normalize(actualite.title).includes(searchTerm) ||
        normalize(actualite.summary).includes(searchTerm);

      return matchesType && matchesAnnee && matchesMois && matchesSearch;
    });
  }, [actualites, annee, mois, search, type]);

  const featured = filteredActualites.find((actualite) => actualite.isFeatured);
  const newsletterActualites = filteredActualites.filter(
    (actualite) => actualite.type === "NEWSLETTER"
  );
  const selectedNewsletter =
    newsletterActualites.find(
      (actualite) => actualite.id === selectedNewsletterId
    ) ?? newsletterActualites[0];

  const handleNewsletterDownload = (actualite: Actualite) => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirectUrl=/actualites");
      return;
    }

    window.open(`/api/actualites/${actualite.id}/download`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b-2 border-black bg-zinc-950 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-28">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em]">
              <Newspaper size={13} />
              Publications du centre
            </span>
            <h1 className="mt-8 text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Actualites
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base font-semibold uppercase tracking-tight text-zinc-300">
              Newsletters, communiques officiels et annonces de points de
              presse du CCAPAC.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16 max-w-7xl">
        <div className="grid gap-6 border-2 border-black p-4 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:p-6">
          <label className="relative block">
            <span className="sr-only">Recherche</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par mot cle"
              className="h-12 w-full border-2 border-zinc-200 pl-11 pr-4 text-sm font-bold uppercase tracking-widest outline-none transition focus:border-black"
            />
          </label>

          <select
            value={annee}
            onChange={(event) => setAnnee(event.target.value)}
            className="h-12 border-2 border-zinc-200 px-4 text-sm font-black uppercase tracking-widest outline-none transition focus:border-black"
          >
            <option value="TOUS">Toutes les annees</option>
            {annees.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={mois}
            onChange={(event) => setMois(event.target.value as ActualiteMois | "TOUS")}
            className="h-12 border-2 border-zinc-200 px-4 text-sm font-black uppercase tracking-widest outline-none transition focus:border-black"
          >
            <option value="TOUS">Tous les mois</option>
            {moisOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`border-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition ${
                type === option.value
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-black hover:text-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {featured && (
          <section className="mt-12 grid overflow-hidden border-2 border-black lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative min-h-[260px] bg-zinc-100">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FileText className="h-20 w-20 text-zinc-300" />
                </div>
              )}
            </div>
            <div className="p-8 md:p-10">
              <span className="inline-block bg-primary px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-white">
                Actuel
              </span>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                {typeLabels[featured.type]}{" "}
                {featured.mois && featured.annee
                  ? `- ${featured.mois} ${featured.annee}`
                  : ""}
              </p>
              <h2 className="mt-4 text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                {featured.title}
              </h2>
              {featured.summary && (
                <p className="mt-5 max-w-2xl text-sm font-semibold uppercase tracking-tight text-zinc-500">
                  {featured.summary}
                </p>
              )}
              <ActualiteAction
                actualite={featured}
                onPreview={setSelectedNewsletterId}
              />
            </div>
          </section>
        )}

        {newsletterActualites.length > 0 && selectedNewsletter && (
          <section className="mt-12 grid gap-10 border-t-4 border-black pt-12 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                  Newsletters
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tighter">
                  Apercu de l&apos;edition
                </h2>
              </div>
              <div className="space-y-3">
                {newsletterActualites.map((newsletter) => (
                  <button
                    key={newsletter.id}
                    type="button"
                    onClick={() => setSelectedNewsletterId(newsletter.id)}
                    className={`w-full border-2 p-5 text-left transition ${
                      selectedNewsletter.id === newsletter.id
                        ? "border-black bg-zinc-50"
                        : "border-zinc-100 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <span className="block text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">
                      {newsletter.mois && newsletter.annee
                        ? `${newsletter.mois} ${newsletter.annee}`
                        : "Edition"}
                    </span>
                    <span className="mt-2 block text-lg font-black uppercase leading-none tracking-tighter text-black">
                      {newsletter.title}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <span className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1">
                    <Calendar size={12} className="text-primary" />
                    {selectedNewsletter.mois && selectedNewsletter.annee
                      ? `${selectedNewsletter.mois} ${selectedNewsletter.annee}`
                      : "Date a venir"}
                  </span>
                  {selectedNewsletter.pageCount && (
                    <span className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1">
                      <FileText size={12} className="text-primary" />
                      {selectedNewsletter.pageCount} pages
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-black uppercase leading-none tracking-tighter md:text-5xl">
                  {selectedNewsletter.title}
                </h3>
                {selectedNewsletter.summary && (
                  <p className="max-w-2xl text-sm font-semibold uppercase tracking-tight text-zinc-500">
                    {selectedNewsletter.summary}
                  </p>
                )}
              </div>

              <div className="grid overflow-hidden border-2 border-black bg-zinc-50 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[320px] border-b-2 border-black bg-white md:border-b-0 md:border-r-2">
                  {selectedNewsletter.coverImage ? (
                    <Image
                      src={selectedNewsletter.coverImage}
                      alt={selectedNewsletter.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center">
                      <FileText className="h-20 w-20 text-zinc-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Apercu public
                  </p>
                  <h4 className="mt-4 text-2xl font-black uppercase leading-none tracking-tighter">
                    Edition reservee aux membres
                  </h4>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-tight text-zinc-500">
                    La fiche publique presente la couverture, la date et le
                    resume. Le PDF complet est servi par une route securisee
                    apres connexion.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNewsletterDownload(selectedNewsletter)}
                    className="mt-8 inline-flex w-fit items-center gap-3 bg-black px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-primary"
                  >
                    <FileText size={16} />
                    {isAuthenticated
                      ? "Telecharger le PDF"
                      : "Connexion pour telecharger"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.35em]">
              Archives
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
              {filteredActualites.length} resultat
              {filteredActualites.length > 1 ? "s" : ""}
            </span>
          </div>

          {filteredActualites.length === 0 ? (
            <div className="border-2 border-dashed border-zinc-200 p-12 text-center">
              <FileText className="mx-auto mb-5 h-12 w-12 text-zinc-300" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                Aucune actualite ne correspond aux filtres.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredActualites.map((actualite) => (
                <article
                  key={actualite.id}
                  className="group flex min-h-[310px] flex-col border-2 border-zinc-100 bg-white transition hover:border-black"
                >
                  <div className="relative h-44 border-b-2 border-zinc-100 bg-zinc-50">
                    {actualite.coverImage ? (
                      <Image
                        src={actualite.coverImage}
                        alt={actualite.title}
                        fill
                        className="object-cover grayscale transition group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="h-12 w-12 text-zinc-300" />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 bg-black px-3 py-1 text-[8px] font-black uppercase tracking-[0.25em] text-white">
                      {typeLabels[actualite.type]}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                      <Calendar size={12} />
                      {actualite.mois && actualite.annee
                        ? `${actualite.mois} ${actualite.annee}`
                        : actualite.datePublication || "Date a venir"}
                    </p>
                    <h3 className="mt-4 text-xl font-black uppercase tracking-tighter leading-none">
                      {actualite.title}
                    </h3>
                    {actualite.summary && (
                      <p className="mt-4 line-clamp-3 text-xs font-semibold uppercase tracking-tight text-zinc-500">
                        {actualite.summary}
                      </p>
                    )}
                    <div className="mt-auto pt-6">
                      <ActualiteAction
                        actualite={actualite}
                        onPreview={setSelectedNewsletterId}
                        compact
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ActualiteAction({
  actualite,
  onPreview,
  compact = false,
}: {
  actualite: Actualite;
  onPreview: (id: number) => void;
  compact?: boolean;
}) {
  if (actualite.type === "NEWSLETTER") {
    return (
      <button
        type="button"
        onClick={() => {
          onPreview(actualite.id);
        }}
        className={`mt-6 inline-flex items-center gap-3 bg-black font-black uppercase tracking-[0.2em] text-white transition hover:bg-primary ${
          compact ? "px-4 py-3 text-[10px]" : "px-6 py-4 text-xs"
        }`}
      >
        <FileText size={compact ? 13 : 16} />
        Apercu
      </button>
    );
  }

  return (
    <Link
      href={`/actualites/${actualite.slug}`}
      className={`mt-6 inline-flex items-center gap-3 bg-black font-black uppercase tracking-[0.2em] text-white transition hover:bg-primary ${
        compact ? "px-4 py-3 text-[10px]" : "px-6 py-4 text-xs"
      }`}
    >
      Lire
      <ArrowRight size={compact ? 13 : 16} />
    </Link>
  );
}
