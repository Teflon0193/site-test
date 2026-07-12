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
  ClipboardCheck,
  Clock,
  FileText,
  Gavel,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

function formatDate(
  value?: string | null
): string {
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
  const [requests, setRequests] = useState<
    SpaceRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadRequests = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data =
          await spaceRequestService.getDepartmentRequests();

        setRequests(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Legal dashboard error:",
          error
        );

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
    },
    []
  );

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const statistics = useMemo(() => {
    const pending = requests.filter(
      (request) =>
        request.status === "legal_review"
    ).length;

    const processed = requests.filter(
      (request) =>
        request.currentDepartment !==
        "JURIDIQUE"
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

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <Gavel className="mt-1 h-8 w-8 shrink-0" />

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
              Service juridique
            </p>

            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Tableau de bord
            </h1>

            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              Examinez la conformité juridique des
              demandes d&apos;occupation d&apos;espace
              transmises par le Service des Programmes.
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total assigné
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {statistics.total}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  En attente
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {statistics.pending}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Traitées
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {statistics.processed}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Titre et actualisation */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Demandes récentes
          </h2>

          <p className="text-sm text-muted-foreground">
            Dossiers actuellement assignés au Service
            juridique.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={refreshing}
          onClick={() =>
            void loadRequests(false)
          }
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Actualiser
        </Button>
      </div>

      {/* Liste récente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Dossiers à examiner
          </CardTitle>

          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href="/espace-membre/juridique/demandes">
              Tout afficher
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />

              <p className="mt-4 text-sm text-muted-foreground">
                Chargement des demandes...
              </p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="py-12 text-center">
              <Gavel className="mx-auto h-12 w-12 text-primary/40" />

              <h3 className="mt-4 font-semibold">
                Aucune demande en attente
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Les demandes transmises au Juridique
                apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col justify-between gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary">
                      {request.reference ||
                        `Demande #${request.id}`}
                    </p>

                    <h3 className="mt-1 truncate font-semibold">
                      {request.eventName ||
                        "Demande d'espace"}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.user?.username ||
                        "Membre"}{" "}
                      —{" "}
                      {formatDate(
                        request.submittedAt ||
                          request.createdAt
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <RequestStatusBadge
                      status={request.status}
                    />

                    <Button
                      asChild
                      size="sm"
                    >
                      <Link
                        href={`/espace-membre/juridique/demandes/${request.id}`}
                      >
                        Examiner
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}