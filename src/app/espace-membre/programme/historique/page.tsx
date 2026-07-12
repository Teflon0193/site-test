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
  Download,
  Eye,
  FileClock,
  FileText,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "@/components/ui/input";
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

function getDocumentUrl(
  documentUrl?: string | null
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

export default function ProgrammeHistoryPage() {
  const [requests, setRequests] = useState<
    SpaceRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] = useState("");

  const loadHistory = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data =
          await spaceRequestService.getDepartmentHistory();

        setRequests(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Programme history error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de charger l'historique"
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
    void loadHistory();
  }, [loadHistory]);

  const filteredRequests = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return requests;
    }

    return requests.filter((request) =>
      [
        request.reference,
        request.eventName,
        request.user?.username,
        request.user?.email,
        request.status,
      ].some((value) =>
        value
          ?.toLowerCase()
          .includes(term)
      )
    );
  }, [requests, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <FileClock className="mt-1 h-8 w-8" />

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
              Service des Programmes
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Historique
            </h1>

            <p className="mt-2 text-primary-foreground/90">
              Retrouvez les demandes déjà traitées ou
              transmises par le Programme.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher dans l'historique..."
            className="bg-background pl-10"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={refreshing}
          onClick={() =>
            void loadHistory(false)
          }
          className="bg-background"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Actualiser
        </Button>
      </div>

      <Card className="overflow-hidden bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />

              <p className="mt-4 text-muted-foreground">
                Chargement de l&apos;historique...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-primary/40" />

              <h2 className="mt-4 font-semibold">
                Historique vide
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Aucune demande n&apos;a encore été
                traitée par le Programme.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-muted/70">
                  <tr className="border-b">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase">
                      Demande
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase">
                      Demandeur
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase">
                      Statut
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase">
                      Dernière modification
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase">
                      Document
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map(
                    (request) => {
                      const documentUrl =
                        getDocumentUrl(
                          request.document?.url
                        );

                      return (
                        <tr
                          key={request.id}
                          className="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                          <td className="px-5 py-4">
                            <p className="text-xs font-semibold text-primary">
                              {request.reference ||
                                `#${request.id}`}
                            </p>

                            <p className="mt-1 font-semibold">
                              {request.eventName}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />

                              <div>
                                <p className="text-sm font-medium">
                                  {request.user
                                    ?.username ||
                                    "Membre"}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {request.user?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <RequestStatusBadge
                              status={
                                request.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />

                              {formatDate(
                                request.updatedAt ||
                                  request.createdAt
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {documentUrl ? (
                              <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                              >
                                <Download className="h-4 w-4" />
                                Télécharger
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Aucun document
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link
                                href={`/espace-membre/programme/demandes/${request.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Consulter
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}