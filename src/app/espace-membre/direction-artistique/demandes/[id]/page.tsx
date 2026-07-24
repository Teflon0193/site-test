"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileSignature,
  FileText,
  History,
  Loader2,
  Mail,
  Palette,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  Upload,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCcapacSpace,
} from "@/constants/spaces";
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

type DecisionMode =
  | "validate"
  | "reject"
  | null;

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

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

const statusLabels: Record<
  string,
  string
> = {
  draft: "Brouillon",
  program_review:
    "Examen par les Programmes",
  general_review:
    "Examen par le Régisseur général",
  artistic_review:
    "À traiter par la Direction artistique",
  communication_review:
    "Transmise à la Communication",
  awaiting_member_confirmation:
    "Confirmation du demandeur",
  program_review_after_confirmation:
    "Retour aux Programmes",
  legal_review:
    "Examen juridique",
  program_review_after_legal:
    "Retour juridique aux Programmes",
  finance_cotation:
    "Cotation financière",
  program_review_after_finance:
    "Retour des Finances",
  completed: "Terminée",
  rejected: "Rejetée",
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

function getDocumentUrl(
  value?: string | null
) {
  if (!value) {
    return null;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `${API_ORIGIN}${
    value.startsWith("/")
      ? value
      : `/${value}`
  }`;
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

function getDescriptionWithSpace(
  request: SpaceRequest
) {
  const description = String(
    request.description || ""
  ).trim();

  const alreadyContainsSpace =
    /^(espace demandé|espace souhaité|espace sollicité)\s*:/im.test(
      description
    );

  if (alreadyContainsSpace) {
    return description;
  }

  const requestedSpace =
    request.spaceId != null
      ? getCcapacSpace(
          Number(request.spaceId)
        )
      : undefined;

  const spaceLabel = requestedSpace
    ? requestedSpace.name
    : "Non renseigné";

  return [
    description ||
      "Aucune description renseignée.",
    `Espace demandé : ${spaceLabel}`,
  ].join("\n");
}

function StatusPill({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "artistic_review"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : status === "rejected"
        ? "border-red-200 bg-red-50 text-red-700"
        : status === "completed"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />

      {statusLabels[status] || status}
    </span>
  );
}

export default function ArtisticRequestDetailPage() {
  const params = useParams<{
    id: string;
  }>();

  const router = useRouter();

  const requestId = Number(params.id);

  const [request, setRequest] =
    useState<SpaceRequest | null>(null);

  const [history, setHistory] =
    useState<ValidationHistory[]>([]);

  const [documents, setDocuments] =
    useState<SpaceRequestDocument[]>([]);

  const [opinionFile, setOpinionFile] =
    useState<File | null>(null);

  const [uploadingOpinion, setUploadingOpinion] =
    useState(false);

  const [
    generatingOrientation,
    setGeneratingOrientation,
  ] = useState(false);

  const [
    orientationRecommendations,
    setOrientationRecommendations,
  ] = useState(
    "Le projet présente une intention artistique cohérente avec la mission du CCAPAC - Grand Tambour. Il favorise l’accès du public à une proposition culturelle lisible, structurée et respectueuse des expressions artistiques d’Afrique centrale."
  );

  const [
    artisticDirectorName,
    setArtisticDirectorName,
  ] = useState("");

  const [
    orientationDecision,
    setOrientationDecision,
  ] = useState<
    | "FAVORABLE"
    | "FAVORABLE_WITH_CONDITIONS"
    | "UNFAVORABLE"
  >("FAVORABLE");

  const [
    orientationConditions,
    setOrientationConditions,
  ] = useState(
    "Respecter la capacité d’accueil, les horaires autorisés, les consignes de sécurité, la charte visuelle du CCAPAC et soumettre les supports de communication avant leur diffusion."
  );

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [
    decisionMode,
    setDecisionMode,
  ] = useState<DecisionMode>(null);

  const [comment, setComment] =
    useState("");

  const [signature, setSignature] =
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
        setHistory(historyData);
        setDocuments(documentData);
      } catch (error) {
        console.error(
          "Artistic request error:",
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

  const canProcess =
    request?.status ===
      "artistic_review" &&
    request.assignedDepartment ===
      "DIRECTION_ARTISTIQUE";

  const documentUrl =
    getDocumentUrl(
      request?.document?.url
    );

  const artisticOpinion = documents.find(
    (document) =>
      document.type === "ARTISTIC_OPINION"
  );

  const handleOpinionFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setOpinionFile(null);
      return;
    }

    const validExtension = [".pdf", ".doc", ".docx"].some(
      (extension) => file.name.toLowerCase().endsWith(extension)
    );

    if (!validExtension) {
      event.target.value = "";
      setOpinionFile(null);
      toast.error("Seuls les fichiers PDF, DOC et DOCX sont autorisés.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      setOpinionFile(null);
      toast.error("Le document ne doit pas dépasser 10 Mo.");
      return;
    }

    setOpinionFile(file);
  };

  const handleUploadOpinion = async () => {
    if (!request || !opinionFile || uploadingOpinion) {
      return;
    }

    try {
      setUploadingOpinion(true);

      await spaceRequestService.uploadDocument(
        request.id,
        "ARTISTIC_OPINION",
        opinionFile
      );

      setOpinionFile(null);
      toast.success("Avis artistique ajouté avec succès.");
      await loadRequest();
    } catch (error) {
      console.error(
        "Artistic opinion upload error:",
        isAxiosError(error) ? error.response?.data : error
      );

      toast.error(
        getErrorMessage(error, "Impossible d'ajouter l'avis artistique.")
      );
    } finally {
      setUploadingOpinion(false);
    }
  };

  const handleGenerateOrientation =
    async () => {
      if (
        !request ||
        !canProcess ||
        generatingOrientation ||
        uploadingOpinion
      ) {
        return;
      }

      const recommendations =
        orientationRecommendations.trim();

      const directorName =
        artisticDirectorName.trim();

      if (directorName.length < 3) {
        toast.error(
          "Saisissez le nom complet du Directeur artistique."
        );
        return;
      }

      if (
        recommendations.length < 10
      ) {
        toast.error(
          "Ajoutez des orientations artistiques avant de générer le document."
        );
        return;
      }

      const decisionLabel =
        orientationDecision ===
        "FAVORABLE"
          ? "Favorable"
          : orientationDecision ===
              "FAVORABLE_WITH_CONDITIONS"
            ? "Favorable sous réserves"
            : "Défavorable";

      try {
        setGeneratingOrientation(true);

        const { jsPDF } =
          await import("jspdf");

        const pdf = new jsPDF({
          unit: "mm",
          format: "a4",
        });

        const pageWidth =
          pdf.internal.pageSize.getWidth();
        const pageHeight =
          pdf.internal.pageSize.getHeight();
        const margin = 18;
        const contentWidth =
          pageWidth - margin * 2;
        let y = 18;

        const ensureSpace = (
          height = 12
        ) => {
          if (
            y + height <=
            pageHeight - 20
          ) {
            return;
          }

          pdf.addPage();
          y = 18;
        };

        const addWrappedText = (
          value: string,
          options?: {
            size?: number;
            bold?: boolean;
            color?: [
              number,
              number,
              number,
            ];
            gap?: number;
          }
        ) => {
          const size =
            options?.size || 10;

          /*
           * La police et sa taille doivent être
           * configurées AVANT splitTextToSize.
           * Sinon jsPDF calcule la largeur avec
           * l'ancienne taille de police et le texte
           * peut dépasser la page.
           */
          pdf.setFontSize(size);
          pdf.setFont(
            "helvetica",
            options?.bold
              ? "bold"
              : "normal"
          );

          const lines =
            pdf.splitTextToSize(
              value || "Non renseigné",
              contentWidth
            ) as string[];

          const lineHeight =
            size * 0.48;

          const color =
            options?.color ||
            ([92, 64, 51] as [
              number,
              number,
              number,
            ]);

          pdf.setTextColor(
            color[0],
            color[1],
            color[2]
          );

          /*
           * Écriture ligne par ligne pour permettre
           * un saut de page au milieu d'un long
           * paragraphe.
           */
          lines.forEach((line) => {
            ensureSpace(lineHeight);

            pdf.text(
              line,
              margin,
              y,
              {
                maxWidth: contentWidth,
              }
            );

            y += lineHeight;
          });

          y += options?.gap || 3;
        };

        const addField = (
          label: string,
          value?: string | null
        ) => {
          ensureSpace(15);

          pdf.setFontSize(8);
          pdf.setFont(
            "helvetica",
            "bold"
          );
          pdf.setTextColor(
            209,
            150,
            91
          );
          pdf.text(
            label.toUpperCase(),
            margin,
            y
          );
          y += 5;

          addWrappedText(
            value?.trim() ||
              "Non renseigné",
            {
              size: 10,
              gap: 5,
            }
          );
        };

        pdf.setFillColor(
          209,
          150,
          91
        );
        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          35,
          4,
          4,
          "F"
        );

        pdf.setTextColor(
          255,
          255,
          255
        );
        pdf.setFont(
          "helvetica",
          "bold"
        );
        pdf.setFontSize(18);
        pdf.text(
          "ORIENTATION ARTISTIQUE",
          margin + 8,
          y + 13
        );

        pdf.setFontSize(10);
        pdf.setFont(
          "helvetica",
          "normal"
        );
        pdf.text(
          "Direction artistique — CCAPAC",
          margin + 8,
          y + 23
        );
        y += 45;

        addField(
          "Référence du dossier",
          request.reference
        );

        addField(
          "Activité / événement",
          request.eventName ||
            request.title
        );

        addField(
          "Demandeur",
          fullName
        );

        addField(
          "Adresse email",
          request.user?.email
        );

        addField(
          "Date souhaitée",
          formatDate(
            request.date ||
              request.desiredDate
          )
        );

        const requestedSpace =
          request.spaceId
            ? getCcapacSpace(
                request.spaceId
              )
            : null;

        addField(
          "Espace sollicité",
          requestedSpace
            ? `${requestedSpace.name} — ${requestedSpace.capacityLabel}`
            : "Non renseigné"
        );

        addField(
          "Responsable artistique",
          directorName
        );

        addField(
          "Présentation du projet",
          request.description
        );

        addField(
          "Intention et ligne artistique",
          "Le projet est invité à proposer une expérience culturelle cohérente avec la mission du CCAPAC - Grand Tambour : créer, grandir, éduquer et célébrer les expressions artistiques d’Afrique centrale. La démarche devra conjuguer exigence artistique, accessibilité des publics, respect des identités culturelles et qualité de présentation."
        );

        addField(
          "Principes directeurs",
          "Cohérence : relier le thème, les œuvres, la scénographie, les supports et la médiation. Ancrage : valoriser les patrimoines, les récits et les pratiques contemporaines d’Afrique centrale. Ouverture : favoriser le dialogue entre artistes, disciplines, générations et publics. Sobriété : employer des dispositifs élégants, fonctionnels, sûrs et compatibles avec le lieu."
        );

        addField(
          "Orientations de mise en espace",
          "Prévoir une entrée identifiable et une circulation intuitive. Privilégier une scénographie claire et modulable. Employer une lumière maîtrisée, calibrer le son au volume de la salle et conserver une identité visuelle cohérente. Les logos, crédits, partenaires et mentions du CCAPAC doivent rester lisibles."
        );

        addField(
          "Points de vigilance",
          "Respecter la capacité d’accueil, les horaires autorisés et les consignes de sécurité. Obtenir les autorisations relatives aux droits d’auteur, droits voisins, images, musiques et captations. Soumettre à validation tout affichage portant l’identité du CCAPAC avant diffusion."
        );

        ensureSpace(28);
        pdf.setFillColor(
          248,
          245,
          239
        );

        /*
         * Même règle pour le bloc des
         * recommandations : définir la police avant
         * de calculer le retour automatique à la ligne.
         */
        pdf.setFontSize(10);
        pdf.setFont(
          "helvetica",
          "normal"
        );

        const recommendationLines =
          pdf.splitTextToSize(
            recommendations,
            contentWidth - 16
          ) as string[];

        const recommendationHeight =
          Math.max(
            28,
            recommendationLines.length *
              5 +
              20
          );

        ensureSpace(
          recommendationHeight
        );

        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          recommendationHeight,
          4,
          4,
          "F"
        );

        pdf.setFontSize(11);
        pdf.setFont(
          "helvetica",
          "bold"
        );
        pdf.setTextColor(
          92,
          64,
          51
        );
        pdf.text(
          "ORIENTATIONS ET RECOMMANDATIONS",
          margin + 8,
          y + 10
        );

        pdf.setFontSize(10);
        pdf.setFont(
          "helvetica",
          "normal"
        );
        pdf.text(
          recommendationLines,
          margin + 8,
          y + 19
        );
        y +=
          recommendationHeight + 8;

        addField(
          "Décision proposée",
          decisionLabel
        );

        addField(
          "Motivation de la décision",
          recommendations
        );

        addField(
          "Réserves / conditions",
          orientationConditions.trim() ||
            "Aucune réserve particulière."
        );

        addField(
          "Recommandations opérationnelles - avant",
          "Valider le plan d’implantation, les visuels, la fiche technique, le conducteur et la liste des intervenants."
        );

        addField(
          "Recommandations opérationnelles - pendant",
          "Veiller à la qualité d’accueil, au respect du conducteur, aux niveaux sonores et à la cohérence visuelle."
        );

        addField(
          "Recommandations opérationnelles - après",
          "Assurer le démontage, la remise en état, le bilan artistique et la transmission des éléments de documentation."
        );

        addWrappedText(
          "Le porteur du projet est tenu de respecter les orientations artistiques, les conditions techniques, les règles de sécurité et les dispositions communiquées par le CCAPAC.",
          {
            size: 9,
            gap: 7,
          }
        );

        addField(
          "Date de génération",
          new Date().toLocaleString(
            "fr-FR"
          )
        );

        addField(
          "Nom complet du Directeur artistique",
          directorName
        );

        addField(
          "Signature électronique",
          directorName
        );

        const pageCount =
          pdf.getNumberOfPages();

        for (
          let page = 1;
          page <= pageCount;
          page += 1
        ) {
          pdf.setPage(page);
          pdf.setFontSize(8);
          pdf.setTextColor(
            140,
            120,
            110
          );
          pdf.text(
            `CCAPAC — Orientation artistique — Page ${page}/${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            {
              align: "center",
            }
          );
        }

        const safeReference =
          request.reference.replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
          );

        const generatedFile =
          new File(
            [pdf.output("blob")],
            `Orientation_artistique_${safeReference}.pdf`,
            {
              type: "application/pdf",
            }
          );

        await spaceRequestService.uploadDocument(
          request.id,
          "ARTISTIC_OPINION",
          generatedFile
        );

        setSignature(directorName);

        toast.success(
          "Document d’orientation artistique généré et joint au dossier."
        );

        await loadRequest();
      } catch (error) {
        console.error(
          "Artistic orientation generation error:",
          isAxiosError(error)
            ? error.response?.data
            : error
        );

        toast.error(
          getErrorMessage(
            error,
            "Impossible de générer le document d’orientation artistique."
          )
        );
      } finally {
        setGeneratingOrientation(
          false
        );
      }
    };

  const fullName =
    request?.user?.username ||
    [
      request?.user?.firstName,
      request?.user?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Demandeur";

  const resetDecision = () => {
    if (processing) {
      return;
    }

    setDecisionMode(null);
    setComment("");
    setSignature("");
  };

  const openValidation = () => {
    setComment("");
    setSignature(
      artisticDirectorName.trim()
    );
    setDecisionMode("validate");
  };

  const openRejection = () => {
    setComment("");
    setSignature("");
    setDecisionMode("reject");
  };

  const handleValidate = async () => {
    if (
      !request ||
      !canProcess ||
      processing
    ) {
      return;
    }

    if (!artisticOpinion) {
      toast.error(
        "Ajoutez l'avis artistique avant de signer et transmettre la demande."
      );
      return;
    }

    const cleanSignature =
      signature.trim();

    if (cleanSignature.length < 3) {
      toast.error(
        "La signature électronique est obligatoire."
      );
      return;
    }

    try {
      setProcessing(true);

      await spaceRequestService.validate(
        request.id,
        comment.trim() ||
          "Avis artistique favorable",
        cleanSignature
      );

      toast.success(
        "Avis artistique validé",
        {
          description:
            "Le dossier a été transmis au Service Communication.",
        }
      );

      resetDecision();

      await loadRequest();
      router.refresh();
    } catch (error) {
      console.error(
        "Artistic validation error:",
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
    if (
      !request ||
      !canProcess ||
      processing
    ) {
      return;
    }

    const reason = comment.trim();

    const cleanSignature =
      signature.trim();

    if (reason.length < 5) {
      toast.error(
        "Le motif du rejet doit contenir au moins 5 caractères."
      );
      return;
    }

    if (cleanSignature.length < 3) {
      toast.error(
        "La signature électronique est obligatoire."
      );
      return;
    }

    try {
      setProcessing(true);

      await spaceRequestService.reject(
        request.id,
        reason,
        cleanSignature
      );

      toast.success(
        "Demande rejetée",
        {
          description:
            "Le demandeur pourra consulter le motif.",
        }
      );

      resetDecision();

      await loadRequest();
      router.refresh();
    } catch (error) {
      console.error(
        "Artistic rejection error:",
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
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D1965B]" />

          <p className="mt-4 text-sm text-[#5C4033]/70">
            Chargement du dossier...
          </p>
        </div>
      </div>
    );
  }

  if (
    !Number.isInteger(requestId) ||
    requestId <= 0 ||
    !request
  ) {
    return (
      <div className="mx-auto max-w-xl py-16">
        <Card className="border-[#D1965B]/20 bg-white">
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-[#D1965B]" />

            <h1 className="mt-4 text-xl font-bold text-[#5C4033]">
              Demande introuvable
            </h1>

            <p className="mt-2 text-sm text-[#5C4033]/65">
              Cette demande n&apos;existe pas
              ou vous ne pouvez pas la
              consulter.
            </p>

            <Button
              asChild
              className="mt-6 bg-[#D1965B] text-white hover:bg-[#B97D47]"
            >
              <Link href="/espace-membre/direction-artistique/demandes">
                Retour aux demandes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1500px] space-y-6">
        <Link
          href="/espace-membre/direction-artistique/demandes"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#D1965B] transition hover:text-[#B97D47]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux demandes
        </Link>

        <section className="overflow-hidden rounded-2xl bg-[#D1965B] shadow-sm">
          <div className="flex flex-col justify-between gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/15 p-3 text-white">
                <Palette className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                  {request.reference}
                </p>

                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  {request.eventName ||
                    request.title ||
                    "Demande d’espace"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                  Évaluation de la cohérence
                  artistique et transmission
                  au Service Communication.
                </p>
              </div>
            </div>

            <StatusPill
              status={request.status}
            />
          </div>
        </section>

        {request.status === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-900">
              Demande rejetée
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-800">
              {request.rejectionComment ||
                "Aucun motif renseigné."}
            </p>
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-[#D1965B]/15 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="border-b border-[#D1965B]/15 px-6 py-5">
                  <h2 className="text-lg font-bold text-[#5C4033]">
                    Informations du dossier
                  </h2>

                  <p className="mt-1 text-sm text-[#5C4033]/60">
                    Coordonnées, date souhaitée
                    et contenu de la demande.
                  </p>
                </div>

                <div className="space-y-7 p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-[#D1965B]/10 bg-[#F8F5EF] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5C4033]/50">
                        <User className="h-4 w-4 text-[#D1965B]" />
                        Demandeur
                      </div>

                      <p className="mt-3 font-semibold text-[#5C4033]">
                        {fullName}
                      </p>

                      {request.user?.email && (
                        <a
                          href={`mailto:${request.user.email}`}
                          className="mt-2 flex items-center gap-2 break-all text-sm text-[#5C4033]/65 hover:text-[#D1965B]"
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          {request.user.email}
                        </a>
                      )}

                      {request.user?.phone && (
                        <a
                          href={`tel:${request.user.phone}`}
                          className="mt-2 flex items-center gap-2 text-sm text-[#5C4033]/65 hover:text-[#D1965B]"
                        >
                          <Phone className="h-4 w-4" />
                          {request.user.phone}
                        </a>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#D1965B]/10 bg-[#F8F5EF] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5C4033]/50">
                        <CalendarDays className="h-4 w-4 text-[#D1965B]" />
                        Date souhaitée
                      </div>

                      <p className="mt-3 font-semibold text-[#5C4033]">
                        {formatDate(
                          request.date ||
                            request.desiredDate
                        )}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-sm text-[#5C4033]/60">
                        <Clock3 className="h-4 w-4" />

                        Envoyée le{" "}
                        {formatDateTime(
                          request.submittedAt ||
                            request.createdAt
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#5C4033]">
                      Description
                    </h3>

                    <div className="mt-3 whitespace-pre-wrap rounded-xl border border-[#D1965B]/10 bg-[#F8F5EF] p-5 text-sm leading-7 text-[#5C4033]/75">
                      {getDescriptionWithSpace(
                        request
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#5C4033]">
                      Document joint
                    </h3>

                    {request.document &&
                    documentUrl ? (
                      <div className="mt-3 flex flex-col justify-between gap-4 rounded-xl border border-[#D1965B]/15 bg-white p-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl bg-[#D1965B]/10 p-3">
                            <FileText className="h-6 w-6 text-[#D1965B]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-[#5C4033]">
                              {
                                request.document
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#5C4033]/50">
                              {request.document
                                .size
                                ? `${(
                                    request
                                      .document
                                      .size /
                                    1024 /
                                    1024
                                  ).toFixed(
                                    2
                                  )} Mo`
                                : "Document de la demande"}
                            </p>
                          </div>
                        </div>

                        <Button
                          asChild
                          variant="outline"
                          className="shrink-0 border-[#D1965B]/30 text-[#5C4033] hover:bg-[#F3EEE5]"
                        >
                          <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              request.document
                                .name
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#5C4033]/60">
                        Aucun document disponible.
                      </p>
                    )}
                  </div>

                  {request.electronicSignature && (
                    <div>
                      <h3 className="font-semibold text-[#5C4033]">
                        Signature du demandeur
                      </h3>

                      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4">
                        <p className="font-serif text-2xl italic text-green-900">
                          {
                            request.electronicSignature
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-[#D1965B]/15 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 border-b border-[#D1965B]/15 px-6 py-5">
                  <History className="h-5 w-5 text-[#D1965B]" />

                  <div>
                    <h2 className="text-lg font-bold text-[#5C4033]">
                      Historique du traitement
                    </h2>

                    <p className="text-sm text-[#5C4033]/55">
                      Décisions et signatures
                      enregistrées.
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {history.length === 0 ? (
                    <p className="text-sm text-[#5C4033]/60">
                      Aucun historique disponible.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {history.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-[#D1965B]/10 bg-[#F8F5EF] p-4"
                          >
                            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                              <div>
                                <p className="font-semibold text-[#5C4033]">
                                  {
                                    item.action
                                  }
                                </p>

                                <p className="mt-1 text-sm text-[#5C4033]/60">
                                  {departmentLabels[
                                    item.fromDepartment ||
                                      ""
                                  ] ||
                                    item.fromDepartment ||
                                    "Départ"}{" "}
                                  →{" "}
                                  {departmentLabels[
                                    item.toDepartment ||
                                      ""
                                  ] ||
                                    item.toDepartment ||
                                    "Destination"}
                                </p>
                              </div>

                              <p className="shrink-0 text-xs text-[#5C4033]/45">
                                {formatDateTime(
                                  item.performedAt
                                )}
                              </p>
                            </div>

                            {item.comment && (
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5C4033]/75">
                                {
                                  item.comment
                                }
                              </p>
                            )}

                            {item.electronicSignature && (
                              <div className="mt-3 border-t border-[#D1965B]/10 pt-3">
                                <p className="text-xs text-[#5C4033]/45">
                                  Signature électronique
                                </p>

                                <p className="mt-1 font-serif text-xl italic text-[#5C4033]">
                                  {
                                    item.electronicSignature
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6">
            {canProcess && (
              <Card className="overflow-hidden border-[#D1965B]/15 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#D1965B]/10 p-2.5">
                      <Upload className="h-5 w-5 text-[#D1965B]" />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#5C4033]">
                        Avis artistique
                      </h2>

                      <p className="text-xs text-[#5C4033]/55">
                        Document obligatoire avant validation
                      </p>
                    </div>
                  </div>

                  {artisticOpinion && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Avis artistique ajouté
                      </p>

                      <p className="mt-2 break-words text-xs text-green-700">
                        {artisticOpinion.name}
                      </p>

                      <Button
                        asChild
                        variant="outline"
                        className="mt-3 w-full border-green-300 bg-white text-green-800 hover:bg-green-100"
                      >
                        <a
                          href={getDocumentUrl(artisticOpinion.url) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={artisticOpinion.name}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Consulter l’avis
                        </a>
                      </Button>

                      <Button
                        type="button"
                        onClick={() => {
                          document
                            .getElementById(
                              "orientationGenerator"
                            )
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });

                          window.setTimeout(
                            () => {
                              document
                                .getElementById(
                                  "artisticDirectorName"
                                )
                                ?.focus();
                            },
                            450
                          );
                        }}
                        className="mt-2 w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Régénérer le document
                      </Button>
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                      <div
                        id="orientationGenerator"
                        className="scroll-mt-6 rounded-xl border border-[#D1965B]/20 bg-[#F8F5EF] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-[#D1965B]/10 p-2">
                            <Sparkles className="h-5 w-5 text-[#D1965B]" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#5C4033]">
                              Génération automatique
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#5C4033]/60">
                              Le PDF sera préparé à partir des informations de la demande et joint automatiquement au dossier.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label
                            htmlFor="artisticDirectorName"
                            className="text-sm text-[#5C4033]"
                          >
                            Nom complet du Directeur artistique *
                          </Label>

                          <Input
                            id="artisticDirectorName"
                            value={
                              artisticDirectorName
                            }
                            onChange={(event) =>
                              setArtisticDirectorName(
                                event.target.value
                              )
                            }
                            disabled={
                              generatingOrientation ||
                              uploadingOpinion
                            }
                            placeholder="Nom et prénom du responsable"
                            autoComplete="name"
                            className="border-[#D1965B]/25 bg-white focus-visible:ring-[#D1965B]"
                          />
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label
                            htmlFor="orientationDecision"
                            className="text-sm text-[#5C4033]"
                          >
                            Décision proposée *
                          </Label>

                          <select
                            id="orientationDecision"
                            value={
                              orientationDecision
                            }
                            onChange={(event) =>
                              setOrientationDecision(
                                event.target.value as
                                  | "FAVORABLE"
                                  | "FAVORABLE_WITH_CONDITIONS"
                                  | "UNFAVORABLE"
                              )
                            }
                            disabled={
                              generatingOrientation ||
                              uploadingOpinion
                            }
                            className="h-11 w-full rounded-xl border border-[#D1965B]/25 bg-white px-3 text-sm text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/10 disabled:opacity-60"
                          >
                            <option value="FAVORABLE">
                              Favorable
                            </option>

                            <option value="FAVORABLE_WITH_CONDITIONS">
                              Favorable sous réserves
                            </option>

                            <option value="UNFAVORABLE">
                              Défavorable
                            </option>
                          </select>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label
                            htmlFor="orientationRecommendations"
                            className="text-sm text-[#5C4033]"
                          >
                            Motivation et orientations *
                          </Label>

                          <textarea
                            id="orientationRecommendations"
                            value={
                              orientationRecommendations
                            }
                            onChange={(event) =>
                              setOrientationRecommendations(
                                event.target.value
                              )
                            }
                            rows={6}
                            disabled={
                              generatingOrientation ||
                              uploadingOpinion
                            }
                            placeholder="Précisez la ligne artistique, les recommandations et les conditions à respecter..."
                            className="w-full resize-y rounded-xl border border-[#D1965B]/25 bg-white px-3 py-3 text-sm leading-6 text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/10 disabled:opacity-60"
                          />
                        </div>

                        <div className="mt-4 space-y-2">
                          <Label
                            htmlFor="orientationConditions"
                            className="text-sm text-[#5C4033]"
                          >
                            Réserves et conditions
                          </Label>

                          <textarea
                            id="orientationConditions"
                            value={
                              orientationConditions
                            }
                            onChange={(event) =>
                              setOrientationConditions(
                                event.target.value
                              )
                            }
                            rows={5}
                            disabled={
                              generatingOrientation ||
                              uploadingOpinion
                            }
                            placeholder="Indiquez les conditions à respecter..."
                            className="w-full resize-y rounded-xl border border-[#D1965B]/25 bg-white px-3 py-3 text-sm leading-6 text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/10 disabled:opacity-60"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={() =>
                            void handleGenerateOrientation()
                          }
                          disabled={
                            generatingOrientation ||
                            uploadingOpinion ||
                            artisticDirectorName.trim()
                              .length < 3 ||
                            orientationRecommendations.trim()
                              .length < 10
                          }
                          className="mt-3 w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                        >
                          {generatingOrientation ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}

                          {generatingOrientation
                            ? artisticOpinion
                              ? "Régénération et remplacement..."
                              : "Génération et ajout..."
                            : artisticOpinion
                              ? "Régénérer et remplacer le document"
                              : "Générer et joindre le document"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 py-1">
                        <span className="h-px flex-1 bg-[#D1965B]/15" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C4033]/45">
                          ou importer un document
                        </span>
                        <span className="h-px flex-1 bg-[#D1965B]/15" />
                      </div>

                      <label
                        htmlFor="artisticOpinionFile"
                        className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#D1965B]/30 bg-[#F8F5EF] p-6 text-center transition hover:border-[#D1965B]"
                      >
                        <Upload className="h-7 w-7 text-[#D1965B]" />

                        <p className="mt-3 break-all text-sm font-medium text-[#5C4033]">
                          {opinionFile
                            ? opinionFile.name
                            : "Choisir l'avis artistique"}
                        </p>

                        <p className="mt-1 text-xs text-[#5C4033]/50">
                          PDF, DOC ou DOCX — maximum 10 Mo
                        </p>

                        <input
                          id="artisticOpinionFile"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleOpinionFileChange}
                          disabled={uploadingOpinion}
                          className="sr-only"
                        />
                      </label>

                      <Button
                        type="button"
                        onClick={() => void handleUploadOpinion()}
                        disabled={!opinionFile || uploadingOpinion}
                        className="w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                      >
                        {uploadingOpinion ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}

                        {uploadingOpinion
                          ? "Ajout en cours..."
                          : "Ajouter l'avis artistique"}
                      </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden border-[#D1965B]/15 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="border-b border-[#D1965B]/15 bg-[#F8F5EF] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#D1965B]/10 p-2.5">
                      <Palette className="h-5 w-5 text-[#D1965B]" />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#5C4033]">
                        Décision artistique
                      </h2>

                      <p className="text-xs text-[#5C4033]/55">
                        Avis et signature obligatoire
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {canProcess ? (
                    decisionMode === null ? (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm font-semibold text-amber-900">
                            Action requise
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-800">
                            Examinez le dossier,
                            puis choisissez de le
                            valider ou de le
                            rejeter.
                          </p>
                        </div>

                        <Button
                          type="button"
                          onClick={openValidation}
                          className="w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Donner un avis favorable
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={openRejection}
                          className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejeter la demande
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div
                          className={`rounded-xl border p-4 ${
                            decisionMode ===
                            "validate"
                              ? "border-green-200 bg-green-50 text-green-900"
                              : "border-red-200 bg-red-50 text-red-900"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {decisionMode ===
                                "validate"
                                  ? "Avis favorable"
                                  : "Rejet de la demande"}
                              </p>

                              <p className="mt-1 text-xs leading-5 opacity-80">
                                {decisionMode ===
                                "validate"
                                  ? "Le dossier sera transmis à la Communication."
                                  : "Le traitement du dossier sera arrêté."}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={
                                resetDecision
                              }
                              disabled={
                                processing
                              }
                              className="rounded-lg p-1.5 hover:bg-white/70"
                              aria-label="Annuler la décision"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="artisticComment"
                            className="text-[#5C4033]"
                          >
                            {decisionMode ===
                            "reject"
                              ? "Motif du rejet *"
                              : "Commentaire artistique"}
                          </Label>

                          <textarea
                            id="artisticComment"
                            value={comment}
                            onChange={(
                              event
                            ) =>
                              setComment(
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              processing
                            }
                            rows={5}
                            placeholder={
                              decisionMode ===
                              "reject"
                                ? "Expliquez clairement le motif du rejet..."
                                : "Ajoutez votre avis sur la cohérence artistique..."
                            }
                            className={`w-full resize-none rounded-xl border bg-white px-3 py-3 text-sm text-[#5C4033] outline-none transition focus:ring-2 ${
                              decisionMode ===
                              "reject"
                                ? "border-red-200 focus:border-red-400 focus:ring-red-100"
                                : "border-[#D1965B]/25 focus:border-[#D1965B] focus:ring-[#D1965B]/10"
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="artisticSignature"
                            className="text-[#5C4033]"
                          >
                            Signature électronique *
                          </Label>

                          <Input
                            id="artisticSignature"
                            value={signature}
                            onChange={(
                              event
                            ) =>
                              setSignature(
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              processing
                            }
                            placeholder="Votre nom complet"
                            autoComplete="name"
                            className="h-11 border-[#D1965B]/25 focus-visible:ring-[#D1965B]"
                          />

                          <div className="min-h-20 rounded-xl border border-dashed border-[#D1965B]/30 bg-[#F8F5EF] p-4">
                            <p className="font-serif text-xl italic text-[#5C4033]">
                              {signature.trim() ||
                                "Votre signature apparaîtra ici"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <Button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              decisionMode ===
                              "validate"
                                ? void handleValidate()
                                : void handleReject()
                            }
                            className={
                              decisionMode ===
                              "validate"
                                ? "bg-[#D1965B] text-white hover:bg-[#B97D47]"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }
                          >
                            {processing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Traitement...
                              </>
                            ) : decisionMode ===
                              "validate" ? (
                              <>
                                <FileSignature className="mr-2 h-4 w-4" />
                                Signer et transmettre
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Signer et rejeter
                              </>
                            )}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            onClick={
                              resetDecision
                            }
                            disabled={
                              processing
                            }
                            className="text-[#5C4033]/65"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-900">
                        Dossier déjà transmis
                      </p>

                      <p className="mt-1 text-sm leading-6 text-blue-800">
                        Le dossier est actuellement
                        assigné à{" "}
                        <strong>
                          {departmentLabels[
                            request.assignedDepartment ||
                              request.currentDepartment
                          ] ||
                            request.assignedDepartment ||
                            request.currentDepartment ||
                            "un autre service"}
                        </strong>
                        .
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#D1965B]/15 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5C4033]/45">
                  Étape actuelle
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-[#5C4033]">
                  {request.currentStep ||
                    statusLabels[
                      request.status
                    ] ||
                    request.status}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}