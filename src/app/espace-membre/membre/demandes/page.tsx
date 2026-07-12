"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

function formatDate(
  value?: string | null
): string {
  if (!value) {
    return "Date non renseignée";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date non renseignée";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MemberRequestsPage() {
  /*
   * Important : le type utilisé ici vient du même
   * service qui retourne les données.
   */
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
          await spaceRequestService.getMyRequests();

        setRequests(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Erreur de chargement des demandes :",
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5C4033]">
            Mes demandes
          </h1>

          <p className="mt-1 text-[#5C4033]/70">
            Suivez le traitement et la validation de
            vos demandes d&apos;espace.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={refreshing}
            onClick={() =>
              void loadRequests(false)
            }
            className="border-[#D1965B]/40 text-[#5C4033] hover:bg-[#F3EEE5]"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Actualiser
          </Button>

          <Button
            asChild
            className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
          >
            <Link href="/espace-membre/membre/nouvelle-demande">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Link>
          </Button>
        </div>
      </div>

      {/* Chargement */}
      {loading ? (
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D1965B] border-t-transparent" />

            <p className="mt-4 text-[#5C4033]/70">
              Chargement de vos demandes...
            </p>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        /* Liste vide */
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D1965B]/10">
              <FileText className="h-8 w-8 text-[#D1965B]" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#5C4033]">
              Aucune demande enregistrée
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#5C4033]/70">
              Vous n&apos;avez pas encore créé de
              demande d&apos;occupation d&apos;espace.
            </p>

            <Button
              asChild
              className="mt-5 bg-[#D1965B] text-white hover:bg-[#B97D47]"
            >
              <Link href="/espace-membre/membre/nouvelle-demande">
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première demande
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Liste des demandes */
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="border-[#D1965B]/20 bg-white transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div className="min-w-0 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#D1965B]">
                        {request.reference ||
                          `Demande #${request.id}`}
                      </p>

                      <h2 className="mt-1 break-words text-xl font-semibold text-[#5C4033]">
                        {request.eventName ||
                          "Demande d'occupation d'espace"}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#5C4033]/70">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#D1965B]" />

                        Créée le{" "}
                        {formatDate(
                          request.createdAt
                        )}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#F3EEE5]/70 px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#5C4033]/60">
                        Étape actuelle
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#5C4033]">
                        {request.currentDepartment
                          ? request.currentDepartment.replaceAll(
                              "_",
                              " "
                            )
                          : "Brouillon du membre"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                    <RequestStatusBadge
                      status={request.status}
                    />

                    <Button
                      variant="outline"
                      asChild
                      className="border-[#D1965B]/40 text-[#5C4033] hover:bg-[#F3EEE5]"
                    >
                      <Link
                        href={`/espace-membre/membre/demandes/${request.id}`}
                      >
                        Voir la demande
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}