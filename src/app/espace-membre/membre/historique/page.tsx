"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { FileClock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "../../../components/ui/card";
import RequestStatusBadge from "../../../../components/space-requests/RequestStatusBadge";
import { spaceRequestService } from "@/services/spaceRequestService";
import type {
  SpaceRequest,
} from "@/types/space-request";

const finalStatuses = [
  "cotation_transmise",
  "programme_refuse",
  "regisseur_general_refuse",
  "direction_artistique_refuse",
  "communication_refuse",
  "juridique_refuse",
  "finance_refuse",
];

export default function MemberHistoryPage() {
  const [requests, setRequests] = useState<
    SpaceRequest[]
  >([]);
  const [loading, setLoading] =
    useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await spaceRequestService.getMyRequests();

      setRequests(
        data.filter((request) =>
          finalStatuses.includes(
            request.status
          )
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger l’historique"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#5C4033]">
          <FileClock className="h-7 w-7 text-[#D1965B]" />
          Historique
        </h1>

        <p className="mt-1 text-[#5C4033]/70">
          Retrouvez les demandes terminées ou
          refusées.
        </p>
      </div>

      {loading ? (
        <Card className="p-10 text-center">
          Chargement...
        </Card>
      ) : requests.length === 0 ? (
        <Card className="border-[#D1965B]/20 bg-white p-10 text-center">
          <p className="text-[#5C4033]/70">
            Aucun élément dans l’historique.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="border-[#D1965B]/20 bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-xs font-semibold text-[#D1965B]">
                    {request.reference}
                  </p>

                  <h2 className="text-lg font-semibold text-[#5C4033]">
                    {request.eventName}
                  </h2>

                  <p className="mt-1 text-sm text-[#5C4033]/70">
                    {request.space.name} —{" "}
                    {new Date(
                      request.date
                    ).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <RequestStatusBadge
                    status={request.status}
                  />

                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link
                      href={`/espace-membre/membre/demandes/${request.id}`}
                    >
                      Consulter
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}