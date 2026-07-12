"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, FileClock, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

const FINAL_STATUSES = new Set([
  "completed",
  "rejected",
  "cotation_transmise",
  "programme_refuse",
  "regisseur_general_refuse",
  "direction_artistique_refuse",
  "communication_refuse",
  "juridique_refuse",
  "finance_refuse",
]);

function formatDate(value?: string | null): string {
  if (!value) return "Date non précisée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non précisée";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getRequestDate(request: SpaceRequest): string | null {
  return (
    request.desiredDate ||
    request.date ||
    request.submittedAt ||
    request.createdAt ||
    null
  );
}

export default function MemberHistoryPage() {
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async (showMessage = false) => {
    try {
      showMessage ? setRefreshing(true) : setLoading(true);
      const data = await spaceRequestService.getMyRequests();
      setRequests(
        Array.isArray(data)
          ? data.filter((request) => FINAL_STATUSES.has(request.status))
          : []
      );
      if (showMessage) toast.success("Historique actualisé");
    } catch (error: unknown) {
      console.error("Erreur de chargement de l’historique :", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger l’historique"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#5C4033]">
            <FileClock className="h-7 w-7 text-[#D1965B]" />
            Historique
          </h1>
          <p className="mt-1 text-[#5C4033]/70">
            Retrouvez vos demandes terminées ou refusées.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading || refreshing}
          onClick={() => void loadHistory(true)}
          className="border-[#D1965B]/40 text-[#5C4033] hover:bg-[#D1965B]/10"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      {loading ? (
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D1965B] border-t-transparent" />
            <p className="mt-4 text-sm text-[#5C4033]/70">
              Chargement de l’historique...
            </p>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-[#D1965B]/40" />
            <h2 className="mt-4 font-semibold text-[#5C4033]">
              Aucun élément dans l’historique
            </h2>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="border-[#D1965B]/20 bg-white transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#D1965B]">
                      {request.reference || `Demande #${request.id}`}
                    </p>
                    <h2 className="mt-1 truncate text-lg font-semibold text-[#5C4033]">
                      {request.eventName || request.title || "Demande d’espace"}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#5C4033]/70">
                      <Calendar className="h-4 w-4 shrink-0 text-[#D1965B]" />
                      <span>{formatDate(getRequestDate(request))}</span>
                    </div>
                    {request.currentStep && (
                      <p className="mt-3 text-sm text-[#5C4033]/70">
                        <span className="font-medium text-[#5C4033]">
                          Dernière étape :
                        </span>{" "}
                        {request.currentStep}
                      </p>
                    )}
                    {request.rejectionComment && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <span className="font-semibold">Motif du refus :</span>{" "}
                        {request.rejectionComment}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <RequestStatusBadge status={request.status} />
                    <Button
                      variant="outline"
                      asChild
                      className="border-[#D1965B]/40 text-[#5C4033] hover:bg-[#D1965B]/10"
                    >
                      <Link href={`/espace-membre/membre/demandes/${request.id}`}>
                        Consulter
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
