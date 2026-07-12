"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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

const ALL_VALUE = "ALL";

const departmentLabels: Record<
  string,
  string
> = {
  MEMBER: "Membre",
  PROGRAMME: "Programmes",

  REGISSEUR_GENERAL:
    "Régisseur général",

  DIRECTION_ARTISTIQUE:
    "Direction artistique",

  COMMUNICATION:
    "Communication",

  JURIDIQUE:
    "Juridique",

  FINANCE:
    "Finances",
};

const statusSteps: Record<
  string,
  {
    label: string;
    step: number;
  }
> = {
  draft: {
    label: "Brouillon",
    step: 1,
  },

  submitted: {
    label: "Demande soumise",
    step: 2,
  },

  program_review: {
    label: "Examen Programme",
    step: 3,
  },

  general_review: {
    label: "Examen Régisseur",
    step: 4,
  },

  artistic_review: {
    label: "Direction artistique",
    step: 5,
  },

  communication_review: {
    label: "Communication",
    step: 6,
  },

  awaiting_member_confirmation: {
    label: "Confirmation du membre",
    step: 7,
  },

  program_review_after_confirmation: {
    label: "Retour Programme",
    step: 8,
  },

  legal_review: {
    label: "Examen Juridique",
    step: 9,
  },

  program_review_after_legal: {
    label: "Retour du Juridique",
    step: 10,
  },

  finance_cotation: {
    label: "Cotation Finance",
    step: 11,
  },

  program_review_after_finance: {
    label: "Retour des Finances",
    step: 12,
  },

  completed: {
    label: "Terminée",
    step: 13,
  },

  rejected: {
    label: "Refusée",
    step: 0,
  },
};

const TOTAL_WORKFLOW_STEPS = 13;

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
    month: "short",
    year: "numeric",
  });
}

function formatAmount(
  value?: number | null
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "CDF",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDocumentUrl(
  value?: string | null
): string | null {
  if (!value) {
    return null;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
}

function getProgress(status: string): number {
  if (status === "completed") {
    return 100;
  }

  if (status === "rejected") {
    return 0;
  }

  const step =
    statusSteps[status]?.step || 1;

  return Math.min(
    100,
    Math.round(
      (step / TOTAL_WORKFLOW_STEPS) *
        100
    )
  );
}

export default function AdminSpaceRequestsPage() {
  const [requests, setRequests] = useState<
    SpaceRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState(ALL_VALUE);

  const [statusFilter, setStatusFilter] =
    useState(ALL_VALUE);

  const loadRequests = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        /*
         * Pour ADMIN, cet endpoint retourne toutes
         * les demandes sans filtrer le département.
         */
        const data =
          await spaceRequestService.getDepartmentRequests();

        setRequests(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Admin space requests error:",
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
    const completed = requests.filter(
      (request) =>
        request.status === "completed"
    ).length;

    const rejected = requests.filter(
      (request) =>
        request.status === "rejected"
    ).length;

    const inProgress =
      requests.length -
      completed -
      rejected;

    const totalQuoted = requests.reduce(
      (total, request) =>
        total +
        (request.paymentAmount || 0),
      0
    );

    return {
      total: requests.length,
      inProgress,
      completed,
      rejected,
      totalQuoted,
    };
  }, [requests]);

  const departmentStatistics = useMemo(
    () =>
      Object.entries(
        departmentLabels
      ).map(([department, label]) => ({
        department,
        label,

        count: requests.filter(
          (request) =>
            request.currentDepartment ===
              department ||
            request.assignedDepartment ===
              department
        ).length,
      })),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !term ||
        [
          request.reference,
          request.eventName,
          request.user?.username,
          request.user?.email,
        ].some((value) =>
          value
            ?.toLowerCase()
            .includes(term)
        );

      const currentDepartment =
        request.currentDepartment ||
        request.assignedDepartment;

      const matchesDepartment =
        departmentFilter === ALL_VALUE ||
        currentDepartment ===
          departmentFilter;

      const matchesStatus =
        statusFilter === ALL_VALUE ||
        request.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    requests,
    search,
    departmentFilter,
    statusFilter,
  ]);

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Supervision des demandes d&apos;espace
        </h1>

        <p className="mt-3 max-w-3xl text-primary-foreground/90">
          Consultez l&apos;ensemble du processus,
          identifiez le département responsable et
          suivez l&apos;avancement de chaque dossier.
        </p>
      </section>

      {/* Statistiques globales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">
                {statistics.total}
              </p>

              <FileText className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              En cours
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">
                {statistics.inProgress}
              </p>

              <Clock className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Terminées
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">
                {statistics.completed}
              </p>

              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Refusées
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">
                {statistics.rejected}
              </p>

              <XCircle className="h-7 w-7 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total des cotations
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-lg font-bold">
                {formatAmount(
                  statistics.totalQuoted
                )}
              </p>

              <BadgeDollarSign className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition */}
      <Card>
        <CardHeader>
          <CardTitle>
            Répartition actuelle par département
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departmentStatistics.map(
              (item) => (
                <div
                  key={item.department}
                  className="flex items-center justify-between rounded-xl border bg-muted/30 p-4"
                >
                  <p className="text-sm font-medium">
                    {item.label}
                  </p>

                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                    {item.count}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_240px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Référence, événement ou demandeur..."
                className="pl-10"
              />
            </div>

            <Select
              value={departmentFilter}
              onValueChange={
                setDepartmentFilter
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Département" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  Tous les départements
                </SelectItem>

                {Object.entries(
                  departmentLabels
                ).map(
                  ([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  Tous les statuts
                </SelectItem>

                {Object.entries(
                  statusSteps
                ).map(
                  ([value, config]) => (
                    <SelectItem
                      key={value}
                      value={value}
                    >
                      {config.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

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
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau général */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Toutes les demandes
          </CardTitle>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            {filteredRequests.length} résultat(s)
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />

              <p className="mt-4 text-muted-foreground">
                Chargement des demandes...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-primary/40" />

              <h2 className="mt-4 font-semibold">
                Aucune demande trouvée
              </h2>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-muted/70">
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Demande
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Demandeur
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Responsable
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Statut
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Progression
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Cotation
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Document
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      Mise à jour
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map(
                    (request) => {
                      const department =
                        request.currentDepartment ||
                        request.assignedDepartment ||
                        "MEMBER";

                      const documentUrl =
                        getDocumentUrl(
                          request.document?.url
                        );

                      const progress =
                        getProgress(
                          request.status
                        );

                      return (
                        <tr
                          key={request.id}
                          className="border-b last:border-0 hover:bg-muted/40"
                        >
                          <td className="px-4 py-4">
                            <p className="text-xs font-semibold text-primary">
                              {request.reference ||
                                `#${request.id}`}
                            </p>

                            <p className="mt-1 max-w-[220px] font-semibold">
                              {request.eventName}
                            </p>
                          </td>

                          <td className="px-4 py-4">
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

                          <td className="px-4 py-4 text-sm">
                            {departmentLabels[
                              department
                            ] || department}
                          </td>

                          <td className="px-4 py-4">
                            <RequestStatusBadge
                              status={
                                request.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="w-36">
                              <div className="mb-1 flex justify-between text-xs">
                                <span>
                                  {statusSteps[
                                    request.status
                                  ]?.label ||
                                    request.status}
                                </span>

                                <span>
                                  {progress} %
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={
                                    request.status ===
                                    "rejected"
                                      ? "h-full bg-destructive"
                                      : "h-full bg-primary"
                                  }
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium">
                            {formatAmount(
                              request.paymentAmount
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {documentUrl ? (
                              <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                              >
                                <Download className="h-4 w-4" />
                                Ouvrir
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Aucun
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {formatDate(
                              request.updatedAt ||
                                request.createdAt
                            )}
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