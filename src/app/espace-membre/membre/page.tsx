"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Building2,
  CalendarDays,
  Clock3,
  Compass,
  FilePlus2,
  Loader2,
  MapPin,
  Newspaper,
  Sparkles,
  Ticket,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "../../components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type UnknownRecord = Record<
  string,
  unknown
>;

type ExploreItem = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  category: string;
  location: string;
  slug: string;
  href: string;
  source:
    | "agenda"
    | "programme"
    | "actualite";
};

const spaces = [
  {
    name: "Grand théâtre",
    capacity: "2 000 personnes",
  },
  {
    name: "Petit théâtre",
    capacity: "800 personnes",
  },
  {
    name: "Hall",
    capacity: "1 000 personnes",
  },
  {
    name: "Atrium",
    capacity: "200 personnes",
  },
];

function isRecord(
  value: unknown
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function firstString(
  source: UnknownRecord,
  keys: string[]
) {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function firstIdentifier(
  source: UnknownRecord,
  fallback: number
) {
  for (const key of [
    "id",
    "documentId",
    "slug",
  ]) {
    const value = source[key];

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }
  }

  return String(fallback);
}

function extractCollection(
  payload: unknown
): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of [
    "data",
    "items",
    "events",
    "programmes",
    "actualites",
    "results",
  ]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }

    if (isRecord(value)) {
      const nested =
        extractCollection(value);

      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

function normalizeItem(
  raw: UnknownRecord,
  index: number,
  source: ExploreItem["source"]
): ExploreItem {
  const title =
    firstString(raw, [
      "title",
      "name",
      "nom",
      "eventName",
    ]) || "À découvrir";

  const description =
    firstString(raw, [
      "summary",
      "description",
      "slogan",
      "excerpt",
      "objectif",
      "objective",
    ]) ||
    "Découvrez cette proposition culturelle du CCAPAC - Grand Tambour.";

  const date =
    firstString(raw, [
      "startDate",
      "date",
      "datePublication",
      "publishedAt",
      "createdAt",
    ]) || null;

  const category =
    firstString(raw, [
      "discipline",
      "category",
      "type",
      "public",
    ]) ||
    (source === "actualite"
      ? "Actualité"
      : "Programme");

  const location =
    firstString(raw, [
      "location",
      "lieu",
      "space",
    ]) || "CCAPAC - Grand Tambour";

  const slug =
    firstString(raw, ["slug"]) ||
    firstIdentifier(raw, index);

  const href =
    source === "agenda"
      ? `/agenda/${slug}`
      : source === "programme"
        ? `/programmes/${slug}`
        : `/actualites/${slug}`;

  return {
    id: `${source}-${firstIdentifier(
      raw,
      index
    )}`,
    title,
    description,
    date,
    category,
    location,
    slug,
    href,
    source,
  };
}

function validDate(
  value: string | null
) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(
  value: string | null,
  fallback = "Date à découvrir"
) {
  const date = validDate(value);

  if (!date) {
    return fallback;
  }

  return date.toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function truncate(
  value: string,
  length = 150
) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(
    0,
    length
  )}…`;
}

function ExploreSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-64 animate-pulse rounded-3xl border border-[#D1965B]/10 bg-white"
        />
      ))}
    </div>
  );
}

export default function MemberHomePage() {
  const { user } = useAuth();

  const [agenda, setAgenda] =
    useState<ExploreItem[]>([]);

  const [programmes, setProgrammes] =
    useState<ExploreItem[]>([]);

  const [actualites, setActualites] =
    useState<ExploreItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fullName =
    `${user?.first_name || ""} ${
      user?.last_name || ""
    }`.trim() || "Membre";

  const firstName =
    user?.first_name?.trim() ||
    fullName.split(" ")[0] ||
    "Membre";

  const loadExploreContent =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const results =
            await Promise.allSettled([
              api.get("/agenda"),
              api.get("/programmes"),
              api.get("/actualites"),
            ]);

          const [
            agendaResult,
            programmesResult,
            actualitesResult,
          ] = results;

          if (
            agendaResult.status ===
            "fulfilled"
          ) {
            setAgenda(
              extractCollection(
                agendaResult.value.data
              ).map((item, index) =>
                normalizeItem(
                  item,
                  index,
                  "agenda"
                )
              )
            );
          }

          if (
            programmesResult.status ===
            "fulfilled"
          ) {
            setProgrammes(
              extractCollection(
                programmesResult.value
                  .data
              ).map((item, index) =>
                normalizeItem(
                  item,
                  index,
                  "programme"
                )
              )
            );
          }

          if (
            actualitesResult.status ===
            "fulfilled"
          ) {
            setActualites(
              extractCollection(
                actualitesResult.value.data
              ).map((item, index) =>
                normalizeItem(
                  item,
                  index,
                  "actualite"
                )
              )
            );
          }

          const allFailed =
            results.every(
              (result) =>
                result.status ===
                "rejected"
            );

          if (allFailed) {
            toast.error(
              "Le contenu culturel n’a pas pu être chargé."
            );
          }
        } catch (error) {
          console.error(
            "Member explore error:",
            error
          );

          toast.error(
            "Impossible d’actualiser la page."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadExploreContent();
  }, [loadExploreContent]);

  const now = useMemo(
    () => new Date(),
    []
  );

  const upcomingEvents = useMemo(
    () =>
      [...agenda]
        .filter((item) => {
          const date =
            validDate(item.date);

          return (
            !date ||
            date.getTime() >=
              now.getTime()
          );
        })
        .sort((left, right) => {
          const leftTime =
            validDate(
              left.date
            )?.getTime() ??
            Number.MAX_SAFE_INTEGER;

          const rightTime =
            validDate(
              right.date
            )?.getTime() ??
            Number.MAX_SAFE_INTEGER;

          return leftTime - rightTime;
        }),
    [agenda, now]
  );

  const pastDiscoveries = useMemo(
    () => {
      const pastEvents = agenda
        .filter((item) => {
          const date =
            validDate(item.date);

          return (
            date &&
            date.getTime() <
              now.getTime()
          );
        })
        .sort((left, right) => {
          const leftTime =
            validDate(
              left.date
            )?.getTime() || 0;

          const rightTime =
            validDate(
              right.date
            )?.getTime() || 0;

          return (
            rightTime - leftTime
          );
        });

      return [
        ...pastEvents,
        ...programmes,
      ].slice(0, 4);
    },
    [agenda, now, programmes]
  );

  const newsletters = useMemo(
    () => {
      const selected =
        actualites.filter((item) =>
          `${item.category} ${item.title}`
            .toLowerCase()
            .includes("newsletter")
        );

      return (
        selected.length > 0
          ? selected
          : actualites
      ).slice(0, 3);
    },
    [actualites]
  );

  const featured =
    upcomingEvents[0] ||
    programmes[0] ||
    actualites[0] ||
    null;

  return (
    <div className="space-y-10 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#5C4033] px-6 py-8 text-white shadow-xl shadow-[#5C4033]/10 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D1965B]/35 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#E7B57F]/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D7B7]">
              <Compass className="h-4 w-4" />
              Explorer le CCAPAC
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Bonjour {firstName},
              <span className="block text-[#E7B57F]">
                la culture vous attend.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Découvrez ce qui se prépare au Grand Tambour, retrouvez les projets qui ont marqué notre programmation et imaginez votre prochain événement.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 bg-[#D1965B] px-5 text-white hover:bg-[#E0A66C]"
              >
                <Link href="/espace-membre/membre/evenements">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Explorer le calendrier
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/espace-membre/membre/">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Proposer un projet
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-[#D1965B] p-3">
                  <Sparkles className="h-6 w-6" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  À la une
                </span>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-[#E7B57F]">
                {featured?.category ||
                  "Grand Tambour"}
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                {featured?.title ||
                  "Une scène ouverte aux idées"}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                {featured
                  ? truncate(
                      featured.description,
                      180
                    )
                  : "Explorez les espaces, consultez les dates disponibles et donnez vie à votre proposition culturelle."}
              </p>

              {featured && (
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/65">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(
                      featured.date
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {featured.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D1965B]">
              Prochainement
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#5C4033] sm:text-3xl">
              À vivre au Grand Tambour
            </h2>
          </div>

          <Button
            asChild
            variant="ghost"
            className="hidden text-[#D1965B] hover:bg-[#D1965B]/10 hover:text-[#B97D47] sm:inline-flex"
          >
            <Link href="/agenda">
              Tout l’agenda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-5">
          {loading ? (
            <ExploreSkeleton />
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {upcomingEvents
                .slice(0, 3)
                .map(
                  (event, index) => (
                    <Link
                      key={event.id}
                      href={event.href}
                      className="group"
                    >
                      <article
                        className={`relative h-full min-h-72 overflow-hidden rounded-3xl p-6 text-white transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
                          index === 0
                            ? "bg-[#D1965B]"
                            : index === 1
                              ? "bg-[#5C4033]"
                              : "bg-[#8F6955]"
                        }`}
                      >
                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                              {event.category}
                            </span>

                            <Ticket className="h-5 w-5 text-white/65" />
                          </div>

                          <div className="mt-auto pt-14">
                            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                              {formatDate(
                                event.date
                              )}
                            </p>

                            <h3 className="mt-2 text-xl font-bold leading-tight">
                              {event.title}
                            </h3>

                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">
                              {event.description}
                            </p>

                            <span className="mt-5 inline-flex items-center text-sm font-semibold">
                              Découvrir
                              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#D1965B]/25 bg-white p-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-[#D1965B]/50" />
              <h3 className="mt-4 font-bold text-[#5C4033]">
                La prochaine programmation arrive
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5C4033]/60">
                En attendant, consultez le calendrier des occupations et découvrez les espaces du CCAPAC.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-[#D1965B]/15 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#D1965B]">
                <Clock3 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Mémoire culturelle
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black text-[#5C4033]">
                Programmes à redécouvrir
              </h2>
            </div>

            <TrendingUp className="h-7 w-7 text-[#D1965B]/40" />
          </div>

          <div className="mt-6 divide-y divide-[#D1965B]/10">
            {pastDiscoveries.length >
            0 ? (
              pastDiscoveries.map(
                (item, index) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EEE5] font-black text-[#D1965B]">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C4033]/50">
                        <span>
                          {item.category}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDate(
                            item.date,
                            "Archives"
                          )}
                        </span>
                      </div>

                      <h3 className="mt-1 truncate font-bold text-[#5C4033] transition group-hover:text-[#D1965B]">
                        {item.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5C4033]/60">
                        {truncate(
                          item.description,
                          130
                        )}
                      </p>
                    </div>

                    <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-[#D1965B]/40 transition group-hover:translate-x-1 group-hover:text-[#D1965B]" />
                  </Link>
                )
              )
            ) : (
              <div className="py-10 text-center">
                <BookOpenText className="mx-auto h-9 w-9 text-[#D1965B]/45" />
                <p className="mt-3 text-sm text-[#5C4033]/60">
                  Les archives des programmes apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#F3EEE5] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#D1965B] shadow-sm">
              <Newspaper className="h-6 w-6" />
            </div>

            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#5C4033]/60">
              Newsletter
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-black text-[#5C4033]">
            Les nouvelles du Centre
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#5C4033]/60">
            Publications, coulisses, appels et temps forts de la communauté culturelle.
          </p>

          <div className="mt-6 space-y-3">
            {newsletters.length > 0 ? (
              newsletters.map(
                (item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group block rounded-2xl bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#D1965B]/10 p-2 text-[#D1965B]">
                        <Newspaper className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#D1965B]">
                          {formatDate(
                            item.date,
                            "Publication"
                          )}
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[#5C4033] group-hover:text-[#D1965B]">
                          {item.title}
                        </h3>
                      </div>

                      <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-[#D1965B]/40 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D1965B]/25 bg-white/60 p-6 text-center">
                <p className="text-sm text-[#5C4033]/60">
                  La prochaine newsletter sera bientôt disponible.
                </p>
              </div>
            )}
          </div>

          <Button
            asChild
            variant="ghost"
            className="mt-5 w-full text-[#D1965B] hover:bg-white hover:text-[#B97D47]"
          >
            <Link href="/actualites">
              Voir toutes les actualités
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#D1965B]/15 bg-white">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div className="bg-[#D1965B] p-7 text-white sm:p-9">
            <Building2 className="h-9 w-9" />

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/65">
              Imaginer, créer, accueillir
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Trouvez votre scène.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75">
              Du théâtre à l’esplanade, chaque espace possède une identité et une capacité propres.
            </p>

            <Button
              asChild
              className="mt-7 bg-white text-[#5C4033] hover:bg-[#F3EEE5]"
            >
              <Link href="/espace-membre/membre/evenements">
                Voir les disponibilités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-px bg-[#D1965B]/10 sm:grid-cols-2">
            {spaces.map((space) => (
              <div
                key={space.name}
                className="bg-white p-6 transition hover:bg-[#FBF8F3]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#5C4033]">
                      {space.name}
                    </h3>

                    <p className="mt-2 text-sm text-[#5C4033]/55">
                      Jusqu’à{" "}
                      {space.capacity}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#D1965B]/10 p-2 text-[#D1965B]">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#D1965B]/15 bg-[#FBF8F3] p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white p-3 text-[#D1965B] shadow-sm">
            <User className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-bold text-[#5C4033]">
              Votre espace, à votre image
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#5C4033]/60">
              Vérifiez vos coordonnées afin de recevoir toutes les notifications liées à vos demandes.
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="shrink-0 border-[#D1965B]/30 bg-white text-[#5C4033] hover:bg-[#F3EEE5]"
        >
          <Link href="/espace-membre/profile">
            Mettre à jour mon profil
          </Link>
        </Button>
      </section>
    </div>
  );
}