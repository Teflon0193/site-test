"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  Gavel,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

function formatDate(value?: string | null): string {
  if (!value) {
    return "Date inconnue";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function LegalDashboardPage() {
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data =
        await spaceRequestService.getDepartmentRequests();

      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Legal dashboard error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger les demandes"
      );

      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const statistics = useMemo(() => {
    const pending = requests.filter(
      (request) => request.status === "legal_review"
    ).length;

    const processed = requests.filter(
      (request) =>
        request.currentDepartment !== "JURIDIQUE" ||
        request.status !== "legal_review"
    ).length;

    return {
      total: requests.length,
      pending,
      processed,
    };
  }, [requests]);

  const recentRequests = useMemo(
    () => requests.slice(0, 5),
    [requests]
  );

  const statisticCards = [
    {
      title: "Total assigné",
      value: statistics.total,
      description: "Tous les dossiers reçus",
      icon: FileText,
      iconClassName: "bg-[#D1965B]/15 text-[#9B5D26]",
    },
    {
      title: "En attente",
      value: statistics.pending,
      description: "Dossiers à examiner",
      icon: Clock,
      iconClassName: "bg-amber-100 text-amber-700",
    },
    {
      title: "Traitées",
      value: statistics.processed,
      description: "Dossiers déjà examinés",
      icon: ClipboardCheck,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen space-y-7 bg-[#F5F1E9] p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#9B5D26] to-[#D1965B] px-6 py-8 text-white shadow-lg sm:px-8 lg:px-10">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
            <Gavel className="h-8 w-8" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Service juridique
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Tableau de bord
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/85 sm:text-base">
              Examinez la conformité juridique des demandes
              d&apos;occupation d&apos;espace transmises par le
              Service des Programmes.
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statisticCards.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <Card
              key={statistic.title}
              className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#7A6A5D]">
                      {statistic.title}
                    </p>

                    <p className="mt-2 text-4xl font-bold text-[#4D2C17]">
                      {statistic.value}
                    </p>

                    <p className="mt-1 text-xs text-[#9A8B7E]">
                      {statistic.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statistic.iconClassName}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Titre et actualisation */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B8753D]">
            Suivi juridique
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#4D2C17]">
            Demandes récentes
          </h2>

          <p className="mt-1 text-sm text-[#7A6A5D]">
            Dossiers actuellement assignés au Service juridique.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={refreshing}
          onClick={() => void loadRequests(false)}
          className="h-10 rounded-xl border-[#D9C8B7] bg-white text-[#6F3D1C] hover:bg-[#F4E9DD] hover:text-[#4D2C17]"
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}

          {refreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </section>

      {/* Liste des dossiers */}
      <Card className="overflow-hidden rounded-2xl border border-[#E6DDD3] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-[#EEE6DD] px-5 py-5 sm:px-7">
          <div>
            <CardTitle className="text-xl font-bold text-[#633817]">
              Dossiers à examiner
            </CardTitle>

            <p className="mt-1 text-sm text-[#8A796B]">
              Consultez et examinez les demandes transmises.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="shrink-0 rounded-lg text-[#8B4513] hover:bg-[#F4E9DD] hover:text-[#633817]"
          >
            <Link href="/espace-membre/juridique/demandes">
              <span className="hidden sm:inline">Tout afficher</span>
              <ArrowRight className="h-4 w-4 sm:ml-2" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-14">
              <Loader2 className="h-10 w-10 animate-spin text-[#D1965B]" />

              <p className="mt-4 text-sm text-[#7A6A5D]">
                Chargement des demandes...
              </p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EBDD]">
                <Gavel className="h-8 w-8 text-[#B8753D]" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#4D2C17]">
                Aucune demande en attente
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#7A6A5D]">
                Les demandes transmises au Service juridique
                apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEE6DD]">
              {recentRequests.map((request) => (
                <article
                  key={request.id}
                  className="group px-5 py-6 transition-colors hover:bg-[#FCF9F5] sm:px-7"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Informations */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#F5EBDD] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#B8753D]">
                          {request.reference ||
                            `Demande #${request.id}`}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-[#633817] transition-colors group-hover:text-[#9B5D26] sm:text-xl">
                        {request.eventName || "Demande d’espace"}
                      </h3>

                      <div className="mt-3 flex flex-col gap-2 text-sm text-[#7A6A5D] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                        <span className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 shrink-0 text-[#B8753D]" />
                          {request.user?.username || "Membre"}
                        </span>

                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0 text-[#B8753D]" />
                          {formatDate(
                            request.submittedAt || request.createdAt
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                      <div className="max-w-full overflow-hidden">
                        <RequestStatusBadge status={request.status} />
                      </div>

                      <Button
                        asChild
                        className="h-10 rounded-xl bg-[#D1965B] px-5 font-semibold text-white shadow-sm hover:bg-[#B8753D]"
                      >
                        <Link
                          href={`/espace-membre/juridique/demandes/${request.id}`}
                        >
                          Examiner
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}