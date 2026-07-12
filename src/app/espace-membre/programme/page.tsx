"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  Calendar,
  ClipboardCheck,
  Clock,
  Download,
  Eye,
  FileText,
  RefreshCw,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

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

function getDocumentUrl(
  documentUrl?: string
): string | null {
  if (!documentUrl) {
    return null;
  }

  if (
    documentUrl.startsWith("http://") ||
    documentUrl.startsWith("https://")
  ) {
    return documentUrl;
  }

  return `${API_ORIGIN}${documentUrl}`;
}

export default function ProgrammeDashboardPage() {
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
          "Programme requests error:",
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

  const statistics = useMemo(
    () => ({
      total: requests.length,

      pending: requests.filter(
        (request) =>
          request.status ===
          "program_review"
      ).length,

      returned: requests.filter(
        (request) =>
          request.status ===
            "program_review_after_confirmation" ||
          request.status ===
            "program_review_after_legal" ||
          request.status ===
            "program_review_after_finance"
      ).length,
    }),
    [requests]
  );

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wider text-white/80">
          Service des Programmes
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Tableau de bord
        </h1>

        <p className="mt-3 max-w-2xl text-white/90">
          Consultez et traitez les demandes
          d&apos;occupation d&apos;espace transmises
          au Service des Programmes.
        </p>
      </section>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]/70">
                  Total assigné
                </p>

                <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                  {statistics.total}
                </p>
              </div>

              <FileText className="h-8 w-8 text-[#D1965B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]/70">
                  Nouvelles demandes
                </p>

                <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                  {statistics.pending}
                </p>
              </div>

              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]/70">
                  Dossiers retournés
                </p>

                <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                  {statistics.returned}
                </p>
              </div>

              <ClipboardCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre du tableau */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#5C4033]">
            Demandes à traiter
          </h2>

          <p className="text-sm text-[#5C4033]/70">
            Tous les agents Programme voient cette
            même liste.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void loadRequests(false)
          }
          disabled={refreshing}
          className="border-[#D1965B]/40 text-[#5C4033]"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Actualiser
        </Button>
      </div>

      {/* Tableau */}
      <Card className="overflow-hidden border-[#D1965B]/20 bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D1965B] border-t-transparent" />

              <p className="mt-4 text-[#5C4033]/70">
                Chargement des demandes...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-[#D1965B]/50" />

              <h3 className="mt-4 font-semibold text-[#5C4033]">
                Aucune demande à traiter
              </h3>

              <p className="mt-1 text-sm text-[#5C4033]/70">
                Les demandes transmises par les membres
                apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-[#F3EEE5]">
                  <tr className="border-b border-[#D1965B]/20">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-[#5C4033]">
                      Demande
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-[#5C4033]">
                      Demandeur
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-[#5C4033]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-[#5C4033]">
                      Statut
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-[#5C4033]">
                      Document
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-[#5C4033]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const documentUrl =
                      getDocumentUrl(
                        request.document?.url
                      );

                    return (
                      <tr
                        key={request.id}
                        className="border-b border-[#D1965B]/10 last:border-0 hover:bg-[#F3EEE5]/40"
                      >
                        <td className="px-5 py-4">
                          <p className="text-xs font-semibold text-[#D1965B]">
                            {request.reference ||
                              `#${request.id}`}
                          </p>

                          <p className="mt-1 max-w-[240px] font-semibold text-[#5C4033]">
                            {request.eventName}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-[#D1965B]" />

                            <div>
                              <p className="text-sm font-medium text-[#5C4033]">
                                {request.user
                                  ?.username ||
                                  "Membre"}
                              </p>

                              <p className="text-xs text-[#5C4033]/60">
                                {request.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="flex items-center gap-2 text-sm text-[#5C4033]/70">
                            <Calendar className="h-4 w-4" />
                            {formatDate(
                              request.submittedAt ||
                                request.createdAt
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <RequestStatusBadge
                            status={request.status}
                          />
                        </td>

                        <td className="px-5 py-4">
                          {documentUrl ? (
                            <a
                              href={documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-[#D1965B] hover:underline"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Aucun document
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Button
                            asChild
                            className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                          >
                            <Link
                              href={`/espace-membre/programme/demandes/${request.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Traiter
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}