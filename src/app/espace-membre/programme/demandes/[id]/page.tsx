"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileSignature,
  FileText,
  History,
  Loader2,
  Mail,
  Phone,
  Send,
  User,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "../../../../components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import RequestDocuments from "@/components/space-requests/RequestDocuments";
import { useAuth } from "@/context/AuthContext";
import {
  spaceRequestService,
  type SpaceRequest,
  type SpaceRequestDocument,
  type ValidationHistory,
} from "@/services/spaceRequestService";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const PROGRAMME_STATUSES = [
  "program_review",
  "program_review_after_confirmation",
  "program_review_after_legal",
  "program_review_after_finance",
  "program_payment_review",
];

const statusLabels: Record<
  string,
  string
> = {
  draft: "Brouillon",
  submitted: "Demande envoyée",
  program_review:
    "Examen par les Programmes",
  general_review:
    "Examen par le Régisseur général",
  artistic_review:
    "Examen par la Direction artistique",
  communication_review:
    "Examen par la Communication",
  awaiting_member_confirmation:
    "Confirmation du demandeur",
  program_review_after_confirmation:
    "Retour aux Programmes après confirmation",
  legal_review:
    "Examen par le Service juridique",
  program_review_after_legal:
    "Retour aux Programmes après examen juridique",
  finance_cotation:
    "Cotation par les Finances",
  program_review_after_finance:
    "Retour aux Programmes après cotation",
  awaiting_payment_proof:
    "En attente de la preuve de paiement",
  program_payment_review:
    "Vérification du paiement par les Programmes",
  completed: "Traitement terminé",
  rejected: "Demande rejetée",
};

const departmentLabels: Record<
  string,
  string
> = {
  MEMBER: "Demandeur",
  PROGRAMME: "Service des Programmes",
  REGISSEUR_GENERAL:
    "Régisseur général",
  DIRECTION_ARTISTIQUE:
    "Direction artistique",
  COMMUNICATION:
    "Service Communication",
  JURIDIQUE: "Service juridique",
  FINANCE: "Service des Finances",
  ADMIN: "Administration",
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    isAxiosError<ApiErrorResponse>(
      error
    )
  ) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ERR_NETWORK"
        ? "Impossible de contacter le serveur."
        : fallback)
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "Non renseignée";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Non renseignée";
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

function formatDateTime(
  value?: string | null
) {
  if (!value) {
    return "Non renseignée";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Non renseignée";
  }

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNextStepLabel(
  status: string
) {
  switch (status) {
    case "program_review":
      return "Transmettre au Régisseur général";

    case "program_review_after_confirmation":
      return "Transmettre au Service juridique";

    case "program_review_after_legal":
      return "Transmettre aux Finances";

    case "program_review_after_finance":
      return "Transmettre la cotation au demandeur";

    case "program_payment_review":
      return "Confirmer le paiement et la date";

    default:
      return "Valider et transmettre";
  }
}

function getNextDepartment(
  status: string
) {
  switch (status) {
    case "program_review":
      return "Régisseur général";

    case "program_review_after_confirmation":
      return "Service juridique";

    case "program_review_after_legal":
      return "Service des Finances";

    case "program_review_after_finance":
      return "Demandeur";

    case "program_payment_review":
      return "Clôture du dossier";

    default:
      return "Service suivant";
  }
}

function normalizeDocuments(
  requestData: SpaceRequest,
  documentData: SpaceRequestDocument[]
): SpaceRequestDocument[] {
  const documentsByUrl = new Map<
    string,
    SpaceRequestDocument
  >();

  const addDocument = (
    document?: SpaceRequestDocument | null
  ) => {
    if (!document?.url) {
      return;
    }

    documentsByUrl.set(
      document.url,
      document
    );
  };

  if (Array.isArray(documentData)) {
    documentData.forEach(addDocument);
  }

  if (Array.isArray(requestData.documents)) {
    requestData.documents.forEach(
      addDocument
    );
  }

  /*
   * Compatibilité avec les anciennes demandes :
   * le formulaire initial est parfois encore
   * retourné dans request.document au lieu de
   * request.documents.
   */
  if (requestData.document?.url) {
    addDocument({
      ...requestData.document,
      type:
        requestData.document.type ||
        "INITIAL_REQUEST",
    });
  }

  return Array.from(
    documentsByUrl.values()
  );
}

export default function ProgrammeRequestDetailPage() {
  const params = useParams<{
    id: string;
  }>();

  const router = useRouter();
  const { user } = useAuth();

  const requestId = Number(params.id);

  const [request, setRequest] =
    useState<SpaceRequest | null>(null);

  const [histories, setHistories] =
    useState<ValidationHistory[]>([]);

  const [documents, setDocuments] =
    useState<SpaceRequestDocument[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [
    validateModalOpen,
    setValidateModalOpen,
  ] = useState(false);

  const [
    rejectModalOpen,
    setRejectModalOpen,
  ] = useState(false);

  const [comment, setComment] =
    useState("");

  const [rejectionComment, setRejectionComment] =
    useState("");

  const [validationSignature, setValidationSignature] =
    useState("");

  const [rejectionSignature, setRejectionSignature] =
    useState("");

  const loadRequest =
    useCallback(async () => {
      if (
        !Number.isInteger(requestId) ||
        requestId <= 0
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [
          requestData,
          historyData,
          documentData,
        ] = await Promise.all([
          spaceRequestService.getOne(
            requestId
          ),

          spaceRequestService
            .getHistory(requestId)
            .catch(() => []),

          spaceRequestService
            .getDocuments(requestId)
            .catch(() => []),
        ]);

        setRequest(requestData);
        setHistories(historyData);
        setDocuments(
          normalizeDocuments(
            requestData,
            Array.isArray(documentData)
              ? documentData
              : []
          )
        );
      } catch (error) {
        console.error(
          "Programme request error:",
          isAxiosError(error)
            ? error.response?.data
            : error
        );

        toast.error(
          getErrorMessage(
            error,
            "Impossible de charger la demande."
          )
        );
      } finally {
        setLoading(false);
      }
    }, [requestId]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const canProcess = useMemo(() => {
    if (!request || !user) {
      return false;
    }

    if (
      request.assignedDepartment !== "PROGRAMME" ||
      !PROGRAMME_STATUSES.includes(request.status)
    ) {
      return false;
    }

    if (user.role === "PROGRAMME_ASSISTANT") {
      return (
        Number(request.assignedToUserId) === Number(user.id) &&
        ![
          "assistant_validated",
          "assistant_rejected",
        ].includes(
          request.programmeReviewState || ""
        )
      );
    }

    return [
      "ADMIN",
      "PROGRAMME",
      "PROGRAMME_SUPERVISEUR",
    ].includes(user.role);
  }, [request, user]);

  const isProgrammeAssistant =
    user?.role === "PROGRAMME_ASSISTANT";

  const handleValidate = async () => {
    if (!request || processing) {
      return;
    }

    if (validationSignature.trim().length < 3) {
      toast.error("La signature électronique est obligatoire.");
      return;
    }

    if (
      isProgrammeAssistant &&
      comment.trim().length < 5
    ) {
      toast.error(
        "Ajoutez un commentaire d'au moins 5 caractères."
      );
      return;
    }

    try {
      setProcessing(true);

      const updatedRequest = isProgrammeAssistant
        ? await spaceRequestService.assistantReview(
            request.id,
            "VALIDATED",
            comment.trim(),
            validationSignature.trim()
          )
        : await spaceRequestService.validate(
            request.id,
            comment.trim(),
            validationSignature.trim()
          );

      setRequest(updatedRequest);
      setValidateModalOpen(false);
      setComment("");
      setValidationSignature("");

      toast.success(
        isProgrammeAssistant
          ? "Avis transmis au superviseur Programme"
          : request.status === "program_payment_review"
          ? "Paiement et date confirmés"
          : "Demande validée",
        {
          description:
            isProgrammeAssistant
              ? "Le superviseur Programme doit maintenant prendre la décision finale."
              : request.status === "program_payment_review"
              ? "Le membre a reçu la confirmation définitive. Le processus est terminé."
              : "Le dossier a été transmis au service suivant.",
        }
      );

      await loadRequest();
      router.refresh();
    } catch (error) {
      console.error(
        "Programme validation error:",
        isAxiosError(error)
          ? error.response?.data
          : error
      );

      toast.error(
        getErrorMessage(
          error,
          "Impossible de valider la demande."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request || processing) {
      return;
    }

    if (
      rejectionComment.trim().length < 5
    ) {
      toast.error(
        "Veuillez préciser le motif du rejet."
      );
      return;
    }

    if (rejectionSignature.trim().length < 3) {
      toast.error("La signature électronique est obligatoire.");
      return;
    }

    try {
      setProcessing(true);

      const updatedRequest = isProgrammeAssistant
        ? await spaceRequestService.assistantReview(
            request.id,
            "REJECTED",
            rejectionComment.trim(),
            rejectionSignature.trim()
          )
        : await spaceRequestService.reject(
            request.id,
            rejectionComment.trim(),
            rejectionSignature.trim()
          );

      setRequest(updatedRequest);
      setRejectModalOpen(false);
      setRejectionComment("");
      setRejectionSignature("");

      toast.success(
        isProgrammeAssistant
          ? "Rejet recommandé au superviseur Programme"
          : "Demande rejetée",
        {
          description:
            isProgrammeAssistant
              ? "Le workflow reste au Programme jusqu'à la décision du superviseur."
              : "Le demandeur pourra consulter le motif du rejet.",
        }
      );

      await loadRequest();
      router.refresh();
    } catch (error) {
      console.error(
        "Programme rejection error:",
        isAxiosError(error)
          ? error.response?.data
          : error
      );

      toast.error(
        getErrorMessage(
          error,
          "Impossible de rejeter la demande."
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D1965B]" />

          <p className="mt-4 text-sm text-[#5C4033]/70">
            Chargement de la demande...
          </p>
        </div>
      </div>
    );
  }

  if (
    !Number.isInteger(requestId) ||
    requestId <= 0
  ) {
    return (
      <Card className="border-[#D1965B]/20 bg-white">
        <CardContent className="p-10 text-center">
          <FileText className="mx-auto h-12 w-12 text-[#D1965B]" />

          <h1 className="mt-4 text-xl font-bold text-[#5C4033]">
            Identifiant invalide
          </h1>

          <Button
            asChild
            className="mt-6 bg-[#D1965B] text-white hover:bg-[#B97D47]"
          >
            <Link href="/espace-membre/programme/demandes">
              Retour aux demandes
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card className="border-[#D1965B]/20 bg-white">
        <CardContent className="p-10 text-center">
          <FileText className="mx-auto h-12 w-12 text-[#D1965B]" />

          <h1 className="mt-4 text-xl font-bold text-[#5C4033]">
            Demande introuvable
          </h1>

          <p className="mt-2 text-sm text-[#5C4033]/70">
            Cette demande n&apos;existe pas
            ou vous n&apos;êtes pas autorisé
            à la consulter.
          </p>

          <Button
            asChild
            className="mt-6 bg-[#D1965B] text-white hover:bg-[#B97D47]"
          >
            <Link href="/espace-membre/programme/demandes">
              Retour aux demandes
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Link
              href="/espace-membre/programme"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#D1965B] hover:text-[#B97D47]"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux demandes
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#5C4033] sm:text-3xl">
                {request.eventName ||
                  request.title ||
                  "Demande d’espace"}
              </h1>

              <RequestStatusBadge
                status={
                  request.status as never
                }
              />
            </div>

            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#D1965B]">
              {request.reference}
            </p>
          </div>

          {canProcess && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setRejectModalOpen(true)
                }
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isProgrammeAssistant
                  ? "Recommander le rejet"
                  : "Rejeter"}
              </Button>

              <Button
                type="button"
                onClick={() =>
                  setValidateModalOpen(true)
                }
                className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isProgrammeAssistant
                  ? "Terminer le traitement"
                  : "Valider et continuer"}
              </Button>
            </div>
          )}
        </div>

        {!canProcess &&
          request.assignedDepartment !==
            "PROGRAMME" && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">
                Dossier transmis
              </p>

              <p className="mt-1 text-sm text-blue-800">
                Cette demande est actuellement
                traitée par{" "}
                <strong>
                  {departmentLabels[
                    request.assignedDepartment ||
                      request.currentDepartment
                  ] ||
                    request.assignedDepartment ||
                    request.currentDepartment}
                </strong>
                .
              </p>
            </div>
          )}

        {request.status === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-900">
              Demande rejetée
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-red-800">
              {request.rejectionComment ||
                "Aucun motif renseigné."}
            </p>
          </div>
        )}

        {[
          "assistant_validated",
          "assistant_rejected",
        ].includes(request.programmeReviewState || "") && (
          <div
            className={`rounded-xl border p-5 ${
              request.programmeReviewState === "assistant_validated"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p className="font-bold text-[#5C4033]">
              {request.programmeReviewState === "assistant_validated"
                ? "L’assistant confirme que le dossier est prêt"
                : "L’assistant recommande le rejet"}
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-[#5C4033]/75">
              {request.assistantComment ||
                "Aucun commentaire renseigné."}
            </p>

            {request.assistantSignature && (
              <p className="mt-3 font-serif text-xl italic text-[#5C4033]">
                Signé par {request.assistantSignature}
              </p>
            )}
          </div>
        )}

        {request.status === "completed" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-900">
              Traitement terminé
            </p>

            <p className="mt-1 text-sm text-green-800">
              La demande et la cotation ont
              été transmises au demandeur.
            </p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="border-[#D1965B]/20 bg-white">
              <CardContent className="space-y-7 p-6">
                <div>
                  <h2 className="text-lg font-bold text-[#5C4033]">
                    Informations de la demande
                  </h2>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#F3EEE5]/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                        <FileText className="h-4 w-4" />
                        Activité
                      </div>

                      <p className="mt-2 font-semibold text-[#5C4033]">
                        {request.eventName ||
                          request.title}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F3EEE5]/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                        <Calendar className="h-4 w-4" />
                        Date souhaitée
                      </div>

                      <p className="mt-2 font-semibold text-[#5C4033]">
                        {formatDate(
                          request.date ||
                            request.desiredDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F3EEE5]/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                        <Clock className="h-4 w-4" />
                        Date d&apos;envoi
                      </div>

                      <p className="mt-2 font-semibold text-[#5C4033]">
                        {formatDateTime(
                          request.submittedAt ||
                            request.createdAt
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F3EEE5]/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                        <Send className="h-4 w-4" />
                        Service actuel
                      </div>

                      <p className="mt-2 font-semibold text-[#5C4033]">
                        {departmentLabels[
                          request.assignedDepartment ||
                            request.currentDepartment
                        ] ||
                          request.assignedDepartment ||
                          request.currentDepartment ||
                          "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#5C4033]">
                    Description
                  </h2>

                  <div className="mt-3 whitespace-pre-wrap rounded-xl border border-[#D1965B]/20 bg-[#F3EEE5]/40 p-4 text-sm leading-7 text-[#5C4033]/80">
                    {request.description ||
                      "Aucune description renseignée."}
                  </div>
                </div>

                {request.electronicSignature && (
                  <div>
                    <h2 className="text-lg font-bold text-[#5C4033]">
                      Signature électronique
                    </h2>

                    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="font-serif text-2xl italic text-green-900">
                        {
                          request.electronicSignature
                        }
                      </p>

                      <p className="mt-2 text-xs text-green-700">
                        Signature électronique
                        du demandeur
                      </p>
                    </div>
                  </div>
                )}

                {request.paymentAmount !==
                  null &&
                  request.paymentAmount !==
                    undefined && (
                    <div>
                      <h2 className="text-lg font-bold text-[#5C4033]">
                        Cotation financière
                      </h2>

                      <div className="mt-3 rounded-xl border border-[#D1965B]/20 bg-[#D1965B]/10 p-5">
                        <p className="text-sm text-[#5C4033]/70">
                          Montant proposé
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#5C4033]">
                          {Number(
                            request.paymentAmount
                          ).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          USD
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            <RequestDocuments
              documents={documents}
              title="Documents revenus avec la demande"
              emptyMessage="Aucun document n'est associé à cette demande."
            />

            <Card className="border-[#D1965B]/20 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-[#D1965B]" />

                  <h2 className="text-lg font-bold text-[#5C4033]">
                    Historique du traitement
                  </h2>
                </div>

                {histories.length === 0 ? (
                  <p className="mt-5 text-sm text-[#5C4033]/60">
                    Aucun historique disponible.
                  </p>
                ) : (
                  <div className="mt-6 space-y-0">
                    {histories.map(
                      (history, index) => (
                        <div
                          key={history.id}
                          className="relative flex gap-4 pb-6 last:pb-0"
                        >
                          {index <
                            histories.length -
                              1 && (
                            <div className="absolute left-[11px] top-7 h-[calc(100%-20px)] w-px bg-[#D1965B]/30" />
                          )}

                          <div className="relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-4 border-white bg-[#D1965B]" />

                          <div className="min-w-0 flex-1 rounded-xl bg-[#F3EEE5]/60 p-4">
                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                              <p className="font-semibold text-[#5C4033]">
                                {history.action}
                              </p>

                              <p className="text-xs text-[#5C4033]/50">
                                {formatDateTime(
                                  history.performedAt
                                )}
                              </p>
                            </div>

                            <p className="mt-1 text-sm text-[#5C4033]/70">
                              {departmentLabels[
                                history.fromDepartment ||
                                  ""
                              ] ||
                                history.fromDepartment ||
                                "Départ"}{" "}
                              →{" "}
                              {departmentLabels[
                                history.toDepartment ||
                                  ""
                              ] ||
                                history.toDepartment ||
                                "Destination"}
                            </p>

                            {history.comment && (
                              <p className="mt-2 whitespace-pre-wrap text-sm text-[#5C4033]/80">
                                {
                                  history.comment
                                }
                              </p>
                            )}

                            {history.performedBy && (
                              <p className="mt-2 text-xs text-[#5C4033]/50">
                                Traité par{" "}
                                {[
                                  history
                                    .performedBy
                                    .firstName,
                                  history
                                    .performedBy
                                    .lastName,
                                ]
                                  .filter(Boolean)
                                  .join(" ") ||
                                  history
                                    .performedBy
                                    .email ||
                                  "Utilisateur"}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-[#D1965B]/20 bg-white">
              <CardContent className="p-6">
                <h2 className="font-bold text-[#5C4033]">
                  Demandeur
                </h2>

                <div className="mt-4 flex items-start gap-3">
                  <div className="rounded-full bg-[#D1965B]/10 p-3">
                    <User className="h-5 w-5 text-[#D1965B]" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#5C4033]">
                      {request.user
                        ?.username ||
                        [
                          request.user
                            ?.firstName,
                          request.user
                            ?.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") ||
                        "Demandeur"}
                    </p>

                    {request.user?.email && (
                      <a
                        href={`mailto:${request.user.email}`}
                        className="mt-2 flex items-center gap-2 break-all text-sm text-[#5C4033]/70 hover:text-[#D1965B]"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        {request.user.email}
                      </a>
                    )}

                    {request.user?.phone && (
                      <a
                        href={`tel:${request.user.phone}`}
                        className="mt-2 flex items-center gap-2 text-sm text-[#5C4033]/70 hover:text-[#D1965B]"
                      >
                        <Phone className="h-4 w-4" />
                        {request.user.phone}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#D1965B]/20 bg-white">
              <CardContent className="p-6">
                <h2 className="font-bold text-[#5C4033]">
                  État du traitement
                </h2>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#5C4033]/50">
                      Statut
                    </p>

                    <p className="mt-1 font-semibold text-[#5C4033]">
                      {statusLabels[
                        request.status
                      ] || request.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#5C4033]/50">
                      Étape actuelle
                    </p>

                    <p className="mt-1 text-sm text-[#5C4033]/75">
                      {request.currentStep ||
                        "Non renseignée"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {validateModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => {
              if (!processing) {
                setValidateModalOpen(
                  false
                );
              }
            }}
            aria-label="Fermer"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D1965B]/20 bg-[#F3EEE5] p-6">
              <div>
                <h2 className="text-xl font-bold text-[#5C4033]">
                  Valider la demande
                </h2>

                <p className="mt-1 text-sm text-[#5C4033]/70">
                  {isProgrammeAssistant
                    ? "Votre avis signé sera transmis au superviseur Programme."
                    : `Le dossier sera transmis au ${getNextDepartment(
                        request.status
                      )}.`}
                </p>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  setValidateModalOpen(
                    false
                  )
                }
                className="rounded-lg p-2 text-[#5C4033] hover:bg-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900">
                {isProgrammeAssistant
                  ? "Vous confirmez avoir terminé l'examen du dossier. Le superviseur Programme prendra la décision finale."
                  : request.status === "program_payment_review"
                  ? "Vous confirmez avoir vérifié la preuve de paiement. La date demandée sera définitivement confirmée et le processus sera clôturé."
                  : "Vous confirmez avoir examiné cette demande et autorisez sa transmission à l’étape suivante."}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="validationComment"
                  className="text-[#5C4033]"
                >
                  Commentaire
                </Label>

                <textarea
                  id="validationComment"
                  value={comment}
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                  disabled={processing}
                  rows={5}
                  placeholder="Ajoutez éventuellement une observation..."
                  className="w-full resize-none rounded-lg border border-[#D1965B]/30 bg-white px-3 py-3 text-sm text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="validationSignature"
                  className="text-[#5C4033]"
                >
                  Signature électronique *
                </Label>

                <Input
                  id="validationSignature"
                  value={validationSignature}
                  onChange={(event) =>
                    setValidationSignature(event.target.value)
                  }
                  disabled={processing}
                  placeholder="Saisissez votre nom complet"
                  autoComplete="name"
                  className="h-12 border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
                />

                <div className="min-h-20 rounded-xl border border-dashed border-[#D1965B]/40 bg-[#F3EEE5]/50 p-4">
                  <p className="font-serif text-2xl italic text-[#5C4033]">
                    {validationSignature.trim() ||
                      "Votre signature apparaîtra ici"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={processing}
                  onClick={() =>
                    {
                      setValidateModalOpen(false);
                      setComment("");
                      setValidationSignature("");
                    }
                  }
                  className="border-[#D1965B]/40 text-[#5C4033]"
                >
                  Annuler
                </Button>

                <Button
                  type="button"
                  disabled={
                    processing ||
                    validationSignature.trim().length < 3
                  }
                  onClick={() =>
                    void handleValidate()
                  }
                  className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transmission...
                    </>
                  ) : (
                    <>
                      <FileSignature className="mr-2 h-4 w-4" />
                      {isProgrammeAssistant
                        ? "Signer et transmettre au superviseur"
                        : getNextStepLabel(
                            request.status
                          )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => {
              if (!processing) {
                setRejectModalOpen(false);
              }
            }}
            aria-label="Fermer"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-red-200 bg-red-50 p-6">
              <div>
                <h2 className="text-xl font-bold text-red-900">
                  Rejeter la demande
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  Le motif sera communiqué au
                  demandeur.
                </p>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  setRejectModalOpen(false)
                }
                className="rounded-lg p-2 text-red-800 hover:bg-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                Cette opération arrêtera le
                traitement de la demande.
                Expliquez clairement la raison
                du rejet.
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rejectionComment"
                  className="text-[#5C4033]"
                >
                  Motif du rejet *
                </Label>

                <textarea
                  id="rejectionComment"
                  value={rejectionComment}
                  onChange={(event) =>
                    setRejectionComment(
                      event.target.value
                    )
                  }
                  disabled={processing}
                  rows={5}
                  placeholder="Précisez le motif du rejet..."
                  className="w-full resize-none rounded-lg border border-red-300 bg-white px-3 py-3 text-sm text-[#5C4033] outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />

                <p className="text-xs text-[#5C4033]/60">
                  Minimum 5 caractères.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rejectionSignature"
                  className="text-[#5C4033]"
                >
                  Signature électronique *
                </Label>

                <Input
                  id="rejectionSignature"
                  value={rejectionSignature}
                  onChange={(event) =>
                    setRejectionSignature(event.target.value)
                  }
                  disabled={processing}
                  placeholder="Saisissez votre nom complet"
                  autoComplete="name"
                  className="h-12 border-red-300 focus-visible:ring-red-400"
                />

                <div className="min-h-20 rounded-xl border border-dashed border-red-300 bg-red-50/50 p-4">
                  <p className="font-serif text-2xl italic text-red-900">
                    {rejectionSignature.trim() ||
                      "Votre signature apparaîtra ici"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={processing}
                  onClick={() =>
                    {
                      setRejectModalOpen(false);
                      setRejectionComment("");
                      setRejectionSignature("");
                    }
                  }
                  className="border-[#D1965B]/40 text-[#5C4033]"
                >
                  Annuler
                </Button>

                <Button
                  type="button"
                  disabled={
                    processing ||
                    rejectionComment.trim()
                      .length < 5 ||
                    rejectionSignature.trim().length < 3
                  }
                  onClick={() =>
                    void handleReject()
                  }
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejet...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Confirmer le rejet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}