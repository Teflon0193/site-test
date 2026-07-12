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
  BadgeDollarSign,
  Clock,
  FileText,
  RefreshCw,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

  return date.toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function formatAmount(
  value?: number | null
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "Non cotée";
  }

  return new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function FinanceStatusPill({
  status,
}: {
  status: string;
}) {
  const label =
    status === "finance_cotation"
      ? "À coter"
      : status ===
          "program_review_after_finance"
        ? "Cotation transmise"
        : status === "completed"
          ? "Terminée"
          : status === "rejected"
            ? "Rejetée"
            : status;

  const colors =
    status === "finance_cotation"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : status === "rejected"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-green-200 bg-green-50 text-green-700";

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${colors}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function FinanceDashboardPage() {
  const [requests, setRequests] =
    useState<SpaceRequest[]>([]);

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
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Finance dashboard error:",
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
        request.status ===
        "finance_cotation"
    ).length;

    const quotedRequests =
      requests.filter(
        (request) =>
          request.paymentAmount !==
            null &&
          request.paymentAmount !==
            undefined
      );

    const totalAmount =
      quotedRequests.reduce(
        (total, request) =>
          total +
          Number(
            request.paymentAmount || 0
          ),
        0
      );

    return {
      total: requests.length,
      pending,
      quoted:
        quotedRequests.length,
      totalAmount,
    };
  }, [requests]);

  return (
    <div className="space-y-7">
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white/15 p-3">
            <BadgeDollarSign className="h-8 w-8" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-white/75">
              Service des Finances
            </p>

            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Tableau de bord
            </h1>

            <p className="mt-2 max-w-2xl text-white/85">
              Consultez les dossiers validés,
              ajoutez le document de cotation
              et établissez le montant en
              dollars américains.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#D1965B]/15 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#5C4033]/60">
                Total assigné
              </p>

              <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                {statistics.total}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <FileText className="h-7 w-7 text-blue-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1965B]/15 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#5C4033]/60">
                En attente
              </p>

              <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                {statistics.pending}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <Clock className="h-7 w-7 text-amber-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1965B]/15 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#5C4033]/60">
                Dossiers cotés
              </p>

              <p className="mt-1 text-3xl font-bold text-[#5C4033]">
                {statistics.quoted}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <WalletCards className="h-7 w-7 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1965B]/15 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="min-w-0">
              <p className="text-sm text-[#5C4033]/60">
                Total des cotations
              </p>

              <p className="mt-1 truncate text-xl font-bold text-[#5C4033]">
                {formatAmount(
                  statistics.totalAmount
                )}
              </p>
            </div>

            <div className="rounded-xl bg-[#D1965B]/10 p-3">
              <BadgeDollarSign className="h-7 w-7 text-[#D1965B]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={refreshing}
          onClick={() =>
            void loadRequests(false)
          }
          className="border-[#D1965B]/30 text-[#5C4033] hover:bg-[#F8F5EF]"
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
      </div>

      <Card className="overflow-hidden border-[#D1965B]/15 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#D1965B]/12 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#5C4033]">
              Demandes à coter
            </h2>

            <p className="mt-1 text-sm text-[#5C4033]/55">
              Dossiers actuellement assignés
              au Service des Finances.
            </p>
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-[#D1965B]/30 text-[#5C4033]"
          >
            <Link href="/espace-membre/finance/demandes">
              Tout afficher
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <CardContent className="p-5 sm:p-6">
          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D1965B] border-t-transparent" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center">
              <BadgeDollarSign className="mx-auto h-12 w-12 text-[#D1965B]/40" />

              <h2 className="mt-4 font-semibold text-[#5C4033]">
                Aucune demande à coter
              </h2>
            </div>
          ) : (
            <div className="divide-y divide-[#D1965B]/10">
              {requests
                .slice(0, 5)
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col justify-between gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#D1965B]">
                        {request.reference}
                      </p>

                      <h2 className="mt-1 truncate font-semibold text-[#5C4033]">
                        {request.eventName}
                      </h2>

                      <p className="mt-1 text-sm text-[#5C4033]/55">
                        {request.user
                          ?.username ||
                          "Demandeur"}{" "}
                        —{" "}
                        {formatDate(
                          request.submittedAt ||
                            request.createdAt
                        )}
                      </p>

                      {request.paymentAmount !==
                        null &&
                        request.paymentAmount !==
                          undefined && (
                          <p className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Cotation :{" "}
                            {formatAmount(
                              request.paymentAmount
                            )}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <FinanceStatusPill
                        status={
                          request.status
                        }
                      />

                      <Button
                        asChild
                        size="sm"
                        className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                      >
                        <Link
                          href={`/espace-membre/finance/demandes/${request.id}`}
                        >
                          {request.status ===
                          "finance_cotation"
                            ? "Établir la cotation"
                            : "Consulter"}
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