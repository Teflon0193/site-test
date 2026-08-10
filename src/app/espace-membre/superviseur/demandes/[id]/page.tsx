"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  History,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import type {
  SpaceRequest,
  SpaceRequestDocument,
  ValidationHistory,
} from "@/services/spaceRequestService";
import {
  getDocumentDownloadUrl,
  supervisorService,
} from "../../supervisorService";

const spaces: Record<number, string> = {
  1: "Grand théâtre",
  2: "Petit théâtre",
  3: "Salle de danse",
  4: "Hall",
  5: "Atrium",
  6: "Cafétéria",
  7: "Salle de musique 1",
  8: "Salle de musique 2",
  9: "Parking",
  10: "Esplanade principale",
  11: "Esplanade secondaire 1",
  12: "Esplanade secondaire 2",
};

const documentLabels: Record<string, string> = {
  INITIAL_REQUEST: "Formulaire initial",
  ARTISTIC_OPINION: "Charte institutionnelle",
  LEGAL_DOCUMENT: "Protocole d’accord",
  FINANCE_QUOTE: "Cotation financière",
  PAYMENT_PROOF: "Preuve de paiement",
};

const departmentLabels: Record<string, string> = {
  MEMBER: "Membre",
  PROGRAMME: "Service des Programmes",
  REGISSEUR_GENERAL: "Régisseur général",
  DIRECTION_ARTISTIQUE: "Direction artistique",
  COMMUNICATION: "Communication",
  COMMUNICATION_REGISSEUR:
    "Communication et Régisseur général",
  JURIDIQUE: "Service juridique",
  FINANCE: "Service des Finances",
};

function formatDate(value?: string | null) {
  if (!value) return "Non renseignée";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Non renseignée";
  }

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour:
      value.includes("T") || value.includes(" ")
        ? "2-digit"
        : undefined,
    minute:
      value.includes("T") || value.includes(" ")
        ? "2-digit"
        : undefined,
  });
}

function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Une erreur est survenue."
    );
  }

  return error instanceof Error
    ? error.message
    : "Une erreur est survenue.";
}

export default function SupervisorRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const requestId = Number(params.id);

  const [request, setRequest] =
    useState<SpaceRequest | null>(null);
  const [documents, setDocuments] = useState<
    SpaceRequestDocument[]
  >([]);
  const [history, setHistory] = useState<
    ValidationHistory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (
      !Number.isInteger(requestId) ||
      requestId <= 0
    ) {
      toast.error("Identifiant de demande invalide.");
      router.replace("/espace-membre/superviseur");
      return;
    }

    try {
      setLoading(true);

      const [requestData, documentData, historyData] =
        await Promise.all([
          supervisorService.getRequest(requestId),
          supervisorService.getRequestDocuments(
            requestId
          ),
          supervisorService.getRequestHistory(requestId),
        ]);

      setRequest(requestData);
      setDocuments(documentData);
      setHistory(historyData);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [requestId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const deleteRequest = async () => {
    if (!request || deleting) return;

    const accepted = window.confirm(
      `Supprimer définitivement la demande ${request.reference} ?\n\nCette action supprimera également ses documents et son historique. Elle est irréversible.`
    );

    if (!accepted) return;

    try {
      setDeleting(true);
      await supervisorService.deleteRequest(request.id);
      toast.success("Demande supprimée définitivement.");
      router.replace("/espace-membre/superviseur");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D1965B] border-t-transparent" />
          <p className="mt-4 text-sm text-[#5C4033]/60">
            Chargement de la demande...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <p className="font-semibold text-[#5C4033]">
          Demande introuvable.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/espace-membre/superviseur">
            Retour au tableau de bord
          </Link>
        </Button>
      </div>
    );
  }

  const department =
    request.assignedDepartment ||
    request.currentDepartment;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Button
          asChild
          variant="outline"
          className="w-fit border-[#D1965B]/30 text-[#5C4033]"
        >
          <Link href="/espace-membre/superviseur">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux demandes
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => void deleteRequest()}
          disabled={deleting}
          className="w-fit border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting
            ? "Suppression..."
            : "Supprimer définitivement"}
        </Button>
      </div>

      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/75">
              {request.reference}
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {request.eventName || request.title}
            </h1>
            <p className="mt-3 text-white/85">
              {request.currentStep ||
                "Étape actuelle non renseignée"}
            </p>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#D1965B]/15 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#5C4033]">
              Informations de la demande
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F8F5EF] p-4">
                <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                  <User className="h-4 w-4 text-[#D1965B]" />
                  Demandeur
                </div>
                <p className="mt-2 font-semibold text-[#5C4033]">
                  {request.user?.username || "Non renseigné"}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F5EF] p-4">
                <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                  <CalendarDays className="h-4 w-4 text-[#D1965B]" />
                  Date souhaitée
                </div>
                <p className="mt-2 font-semibold text-[#5C4033]">
                  {formatDate(
                    request.desiredDate || request.date
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F5EF] p-4">
                <div className="flex items-center gap-2 text-sm text-[#5C4033]/60">
                  <MapPin className="h-4 w-4 text-[#D1965B]" />
                  Espace demandé
                </div>
                <p className="mt-2 font-semibold text-[#5C4033]">
                  {request.spaceId
                    ? spaces[request.spaceId] ||
                      `Espace ${request.spaceId}`
                    : "Non renseigné"}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F5EF] p-4">
                <p className="text-sm text-[#5C4033]/60">
                  Département actuel
                </p>
                <p className="mt-2 font-semibold text-[#5C4033]">
                  {departmentLabels[department] ||
                    department ||
                    "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-[#D1965B]/15 p-4 text-sm text-[#5C4033]/75">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D1965B]" />
                {request.user?.email || "Email non renseigné"}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D1965B]" />
                {request.user?.phone ||
                  "Téléphone non renseigné"}
              </p>
            </div>

            {request.description && (
              <div className="mt-5">
                <h3 className="font-semibold text-[#5C4033]">
                  Description
                </h3>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-[#F8F5EF] p-4 text-sm leading-6 text-[#5C4033]/75">
                  {request.description}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#D1965B]/15 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-[#D1965B]" />
              <h2 className="text-xl font-bold text-[#5C4033]">
                Historique du traitement
              </h2>
            </div>

            {history.length === 0 ? (
              <p className="mt-5 text-sm text-[#5C4033]/60">
                Aucun historique disponible.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {history.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[#D1965B]/15 p-4"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <p className="font-semibold text-[#5C4033]">
                        {item.action.replaceAll("_", " ")}
                      </p>
                      <time className="text-xs text-[#5C4033]/50">
                        {formatDate(item.performedAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-[#5C4033]/60">
                      {departmentLabels[
                        item.fromDepartment || ""
                      ] ||
                        item.fromDepartment ||
                        "-"}
                      {" → "}
                      {departmentLabels[
                        item.toDepartment || ""
                      ] ||
                        item.toDepartment ||
                        "-"}
                    </p>
                    {item.comment && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-[#5C4033]/75">
                        {item.comment}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="h-fit rounded-2xl border border-[#D1965B]/15 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#D1965B]" />
            <h2 className="text-xl font-bold text-[#5C4033]">
              Documents du dossier
            </h2>
          </div>

          {documents.length === 0 ? (
            <p className="mt-5 text-sm text-[#5C4033]/60">
              Aucun document disponible.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {documents.map((document, index) => (
                <article
                  key={
                    document.id ||
                    `${document.url}-${index}`
                  }
                  className="rounded-xl border border-[#D1965B]/15 bg-[#F8F5EF] p-4"
                >
                  <p className="text-sm font-semibold text-[#5C4033]">
                    {documentLabels[
                      document.type || ""
                    ] || "Document"}
                  </p>
                  <p className="mt-1 break-all text-xs text-[#5C4033]/60">
                    {document.name}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-3 w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                  >
                    <a
                      href={getDocumentDownloadUrl(
                        document.url
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Consulter
                    </a>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}