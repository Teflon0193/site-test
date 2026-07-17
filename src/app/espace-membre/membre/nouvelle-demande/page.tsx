"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Download,
  FileSignature,
  FileText,
  Info,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpaceSelect from "@/components/space-requests/SpaceSelect";
import {
  spaceRequestService,
  type SpaceRequest,
} from "@/services/spaceRequestService";

type RequestFormData = {
  fullName: string;
  email: string;
  phone: string;
  eventName: string;
  space: number;
  desiredDate: string;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
];

const FORM_DOCUMENT_NAME =
  "DIRECTION DES PROGRAMMES Fiche de renseignement.doc";

const FORM_DOCUMENT_URL =
  "/documents/DIRECTION%20DES%20PROGRAMMES%20Fiche%20de%20renseignement.doc";

function getLocalDateValue() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(
  value: string
) {
  if (!value) {
    return "";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
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

export default function NewRequestPage() {
  const router = useRouter();

  const minimumDate =
    getLocalDateValue();

  const [loading, setLoading] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [uploadedFile, setUploadedFile] =
    useState<File | null>(null);

  const [
    createdRequest,
    setCreatedRequest,
  ] = useState<SpaceRequest | null>(null);

  const [
    signatureModalOpen,
    setSignatureModalOpen,
  ] = useState(false);

  const [signature, setSignature] =
    useState("");

  const [confirmed, setConfirmed] =
    useState(false);

  const [formData, setFormData] =
    useState<RequestFormData>({
      fullName: "",
      email: "",
      phone: "",
      eventName: "",
      space: 0,
      desiredDate: "",
    });

  const updateField = (
    field: keyof RequestFormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleDownloadForm = async () => {
    if (downloading) {
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(
        FORM_DOCUMENT_URL,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Le formulaire est introuvable."
        );
      }

      const fileBlob =
        await response.blob();

      const fileUrl =
        URL.createObjectURL(fileBlob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href = fileUrl;

      downloadLink.download =
        FORM_DOCUMENT_NAME;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(fileUrl);

      toast.success(
        "Formulaire téléchargé."
      );
    } catch (error) {
      console.error(
        "Download form error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Impossible de télécharger le formulaire."
        )
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setUploadedFile(null);
      return;
    }

    const fileName =
      file.name.toLowerCase();

    const validExtension =
      ALLOWED_EXTENSIONS.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!validExtension) {
      event.target.value = "";
      setUploadedFile(null);

      toast.error(
        "Veuillez sélectionner un fichier PDF, DOC ou DOCX."
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setUploadedFile(null);

      toast.error(
        "Le fichier ne doit pas dépasser 10 Mo."
      );

      return;
    }

    setUploadedFile(file);

    toast.success(
      "Fichier sélectionné",
      {
        description: `${file.name} — ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} Mo`,
      }
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading || submitting) {
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error(
        "Veuillez saisir votre nom complet."
      );
      return;
    }

    if (!formData.email.trim()) {
      toast.error(
        "Veuillez saisir votre adresse email."
      );
      return;
    }

    if (!formData.eventName.trim()) {
      toast.error(
        "Veuillez saisir le nom de l’événement."
      );
      return;
    }

    if (!formData.space) {
      toast.error(
        "Veuillez sélectionner l’espace souhaité."
      );
      return;
    }

    if (!formData.desiredDate) {
      toast.error(
        "Veuillez sélectionner la date souhaitée pour l’occupation."
      );
      return;
    }

    const selectedDate = new Date(
      `${formData.desiredDate}T00:00:00`
    );

    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      toast.error(
        "La date sélectionnée est invalide."
      );
      return;
    }

    if (selectedDate < currentDate) {
      toast.error(
        "La date d’occupation ne peut pas être antérieure à aujourd’hui."
      );
      return;
    }

    if (!uploadedFile) {
      toast.error(
        "Veuillez ajouter le formulaire rempli."
      );
      return;
    }

    try {
      setLoading(true);

      const request =
        await spaceRequestService.create(
          {
            fullName:
              formData.fullName.trim(),

            email: formData.email
              .trim()
              .toLowerCase(),

            phone:
              formData.phone.trim(),

            eventName:
              formData.eventName.trim(),

            space: formData.space,

            date:
              formData.desiredDate,

            startTime: "09:00",
            endTime: "17:00",
            participants: 1,

            description: [
              `Demandeur : ${formData.fullName.trim()}`,

              `Email : ${formData.email
                .trim()
                .toLowerCase()}`,

              formData.phone.trim()
                ? `Téléphone : ${formData.phone.trim()}`
                : null,

              `Date souhaitée : ${formatSelectedDate(
                formData.desiredDate
              )}`,

              `Document : ${uploadedFile.name}`,
            ]
              .filter(Boolean)
              .join("\n"),
          },
          uploadedFile
        );

      setCreatedRequest(request);

      setSignature(
        formData.fullName.trim()
      );

      setConfirmed(false);

      setSignatureModalOpen(true);

      toast.success(
        "Demande enregistrée",
        {
          description:
            "Confirmez les informations et signez pour envoyer la demande.",
        }
      );
    } catch (error) {
      console.error(
        "Erreur de création :",
        isAxiosError(error)
          ? error.response?.data
          : error
      );

      toast.error(
        getErrorMessage(
          error,
          "Impossible de créer la demande."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignAndSend = async () => {
    if (submitting) {
      return;
    }

    if (!createdRequest) {
      toast.error(
        "La demande n’a pas encore été créée."
      );
      return;
    }

    const cleanSignature =
      signature.trim();

    if (cleanSignature.length < 3) {
      toast.error(
        "Veuillez saisir votre nom complet comme signature."
      );
      return;
    }

    if (!confirmed) {
      toast.error(
        "Veuillez confirmer l’exactitude des informations."
      );
      return;
    }

    try {
      setSubmitting(true);

      await spaceRequestService.submit(
        createdRequest.id,
        cleanSignature
      );

      setSignatureModalOpen(false);

      toast.success(
        "Demande signée et envoyée",
        {
          description:
            "Votre dossier a été transmis au Service des Programmes.",
        }
      );

      router.replace(
        `/espace-membre/membre/demandes/${createdRequest.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Erreur de signature :",
        isAxiosError(error)
          ? error.response?.data
          : error
      );

      toast.error(
        getErrorMessage(
          error,
          "Impossible de signer et d’envoyer la demande."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeSignatureModal = () => {
    if (submitting) {
      return;
    }

    setSignatureModalOpen(false);

    if (createdRequest) {
      toast.info(
        "Votre demande reste enregistrée comme brouillon.",
        {
          description:
            "Vous pourrez la signer depuis Mes demandes.",
        }
      );

      router.replace(
        `/espace-membre/membre/demandes/${createdRequest.id}`
      );

      router.refresh();
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="mb-5">
          <Link
            href="/espace-membre/membre"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D1965B] hover:text-[#B97D47]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>

        <Card className="overflow-hidden border-0 bg-white shadow-lg">
          <div className="border-b border-[#D1965B]/20 bg-gradient-to-r from-[#D1965B]/10 via-[#D1965B]/5 to-transparent px-5 pb-6 pt-8 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-[#D1965B]/10 p-3">
                <FileText className="h-8 w-8 text-[#D1965B]" />
              </div>

              <div>
                <CardTitle className="text-2xl font-bold text-[#5C4033] sm:text-3xl">
                  Demande d&apos;occupation
                  d&apos;espace
                </CardTitle>

                <p className="mt-1 text-sm text-[#5C4033]/70">
                  Formulaire de demande
                  d&apos;utilisation des espaces
                  du CCAPAC – Grand Tambour
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#D1965B]/10 px-3 py-1 text-xs font-medium text-[#D1965B]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D1965B]" />
                    Formulaire officiel
                  </span>

                  <span className="text-xs text-[#5C4033]/60">
                    Traitement entre 3 jours
                    et 1 semaine
                  </span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="space-y-8 p-5 sm:p-8">
            <section className="rounded-xl border border-[#D1965B]/20 bg-[#F3EEE5]/60 p-5">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Download className="h-5 w-5 text-[#D1965B]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#5C4033]">
                      Télécharger le formulaire
                    </h2>

                    <p className="mt-1 text-sm text-[#5C4033]/70">
                      Téléchargez le document,
                      remplissez-le, puis
                      ajoutez-le à votre demande.
                    </p>

                    <p className="mt-2 break-all text-xs font-medium text-[#D1965B]">
                      {FORM_DOCUMENT_NAME}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={
                    handleDownloadForm
                  }
                  disabled={
                    downloading ||
                    loading ||
                    submitting
                  }
                  className="shrink-0 bg-[#D1965B] text-white hover:bg-[#B97D47]"
                >
                  {downloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}

                  {downloading
                    ? "Téléchargement..."
                    : "Télécharger"}
                </Button>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              <section className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#5C4033]">
                    Informations du demandeur
                  </h2>

                  <p className="text-sm text-[#5C4033]/60">
                    Renseignez vos coordonnées
                    et la date à laquelle vous
                    souhaitez occuper
                    l&apos;espace.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-[#5C4033]"
                    >
                      Nom complet *
                    </Label>

                    <Input
                      id="fullName"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={(event) =>
                        updateField(
                          "fullName",
                          event.target.value
                        )
                      }
                      placeholder="Votre nom complet"
                      autoComplete="name"
                      required
                      disabled={
                        loading ||
                        submitting ||
                        Boolean(
                          createdRequest
                        )
                      }
                      className="border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#5C4033]"
                    >
                      Adresse email *
                    </Label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={
                        formData.email
                      }
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="nom@exemple.com"
                      autoComplete="email"
                      required
                      disabled={
                        loading ||
                        submitting ||
                        Boolean(
                          createdRequest
                        )
                      }
                      className="border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[#5C4033]"
                    >
                      Téléphone
                    </Label>

                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={
                        formData.phone
                      }
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="+243..."
                      autoComplete="tel"
                      disabled={
                        loading ||
                        submitting ||
                        Boolean(
                          createdRequest
                        )
                      }
                      className="border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="eventName"
                      className="text-[#5C4033]"
                    >
                      Nom de l&apos;événement *
                    </Label>

                    <Input
                      id="eventName"
                      name="eventName"
                      value={
                        formData.eventName
                      }
                      onChange={(event) =>
                        updateField(
                          "eventName",
                          event.target.value
                        )
                      }
                      placeholder="Intitulé de l’activité"
                      required
                      disabled={
                        loading ||
                        submitting ||
                        Boolean(
                          createdRequest
                        )
                      }
                      className="border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
                    />
                  </div>

                  <div>
                    <SpaceSelect
                      value={formData.space}
                      onChange={(space) =>
                        setFormData((current) => ({
                          ...current,
                          space,
                        }))
                      }
                      disabled={
                        loading ||
                        submitting ||
                        Boolean(createdRequest)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="desiredDate"
                      className="text-[#5C4033]"
                    >
                      Date souhaitée
                      d&apos;occupation *
                    </Label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#D1965B]" />

                      <Input
                        id="desiredDate"
                        name="desiredDate"
                        type="date"
                        value={
                          formData.desiredDate
                        }
                        min={minimumDate}
                        onChange={(event) =>
                          updateField(
                            "desiredDate",
                            event.target.value
                          )
                        }
                        required
                        disabled={
                          loading ||
                          submitting ||
                          Boolean(
                            createdRequest
                          )
                        }
                        className="border-[#D1965B]/30 pl-11 focus-visible:ring-[#D1965B]"
                      />
                    </div>

                    {formData.desiredDate ? (
                      <div className="rounded-lg border border-[#D1965B]/20 bg-[#F3EEE5]/50 px-4 py-3">
                        <p className="flex items-center gap-2 text-sm font-medium text-[#5C4033]">
                          <CheckCircle className="h-4 w-4 text-green-600" />

                          Date choisie :{" "}
                          {formatSelectedDate(
                            formData.desiredDate
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#5C4033]/60">
                        Choisissez la date à
                        laquelle vous souhaitez
                        occuper l&apos;espace.
                      </p>
                    )}

                    <p className="text-xs text-[#5C4033]/60">
                      Si la date demandée est
                      déjà occupée, une autre
                      date disponible vous sera
                      proposée.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#5C4033]">
                    Formulaire rempli
                  </h2>

                  <p className="text-sm text-[#5C4033]/60">
                    Ajoutez le formulaire que
                    vous venez de compléter.
                  </p>
                </div>

                <label
                  htmlFor="document"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1965B]/40 bg-[#F3EEE5]/40 px-5 py-10 text-center transition hover:border-[#D1965B] hover:bg-[#D1965B]/5"
                >
                  {uploadedFile ? (
                    <>
                      <CheckCircle className="h-10 w-10 text-green-600" />

                      <p className="mt-3 max-w-full truncate font-semibold text-[#5C4033]">
                        {uploadedFile.name}
                      </p>

                      <p className="mt-1 text-sm text-[#5C4033]/60">
                        {(
                          uploadedFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        Mo
                      </p>

                      {!createdRequest && (
                        <p className="mt-3 text-xs font-medium text-[#D1965B]">
                          Cliquez pour changer
                          le fichier
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-[#D1965B]/10 p-4 transition group-hover:bg-[#D1965B]/20">
                        <Upload className="h-8 w-8 text-[#D1965B]" />
                      </div>

                      <p className="mt-4 font-semibold text-[#5C4033]">
                        Ajouter le formulaire
                        rempli
                      </p>

                      <p className="mt-1 text-sm text-[#5C4033]/60">
                        PDF, DOC ou DOCX —
                        maximum 10 Mo
                      </p>
                    </>
                  )}

                  <input
                    id="document"
                    name="document"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={
                      handleFileChange
                    }
                    disabled={
                      loading ||
                      submitting ||
                      Boolean(
                        createdRequest
                      )
                    }
                    className="sr-only"
                  />
                </label>
              </section>

              <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <div className="space-y-2 text-sm text-amber-900">
                    <p className="font-semibold">
                      Important
                    </p>

                    <p>
                      Le présent formulaire
                      constitue un document
                      précontractuel et un
                      engagement sur
                      l&apos;honneur. Toute
                      autorisation
                      d&apos;utilisation est
                      soumise à la validation
                      du CCAPAC – Grand
                      Tambour.
                    </p>

                    <p>
                      La durée du processus de
                      traitement est comprise
                      entre 3 jours et 1
                      semaine.
                    </p>

                    <p>
                      Si la date demandée est
                      déjà occupée, vous serez
                      reprogrammé pour une
                      autre date disponible.
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#D1965B]/20 pt-6 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={
                    loading || submitting
                  }
                  className="border-[#D1965B]/40 text-[#5C4033] hover:bg-[#F3EEE5]"
                >
                  <Link href="/espace-membre/membre">
                    Annuler
                  </Link>
                </Button>

                {createdRequest ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setSignatureModalOpen(
                        true
                      )
                    }
                    disabled={submitting}
                    className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                  >
                    <FileSignature className="mr-2 h-4 w-4" />
                    Confirmer et signer
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      loading || submitting
                    }
                    className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer la demande
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {signatureModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signature-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={
              closeSignatureModal
            }
            aria-label="Fermer la fenêtre"
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D1965B]/20 bg-[#F3EEE5] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#D1965B]/15 p-3">
                  <FileSignature className="h-7 w-7 text-[#D1965B]" />
                </div>

                <div>
                  <h2
                    id="signature-title"
                    className="text-xl font-bold text-[#5C4033] sm:text-2xl"
                  >
                    Signature électronique
                  </h2>

                  <p className="mt-1 text-sm text-[#5C4033]/70">
                    Dernière étape avant
                    l&apos;envoi au Service
                    des Programmes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={
                  closeSignatureModal
                }
                className="rounded-lg p-2 text-[#5C4033] transition hover:bg-white disabled:opacity-50"
                aria-label="Fermer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-150px)] space-y-6 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
                En signant cette demande,
                vous certifiez sur
                l&apos;honneur que les
                informations, la date choisie
                et le document transmis sont
                exacts. Cette signature
                constitue votre engagement
                électronique.
              </div>

              <div className="grid gap-3 rounded-xl border border-[#D1965B]/20 bg-[#F3EEE5]/50 p-4 text-sm">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <span className="text-[#5C4033]/60">
                    Demandeur
                  </span>

                  <span className="font-semibold text-[#5C4033]">
                    {formData.fullName}
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <span className="text-[#5C4033]/60">
                    Événement
                  </span>

                  <span className="font-semibold text-[#5C4033]">
                    {formData.eventName}
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <span className="text-[#5C4033]/60">
                    Date souhaitée
                  </span>

                  <span className="font-semibold text-[#5C4033]">
                    {formatSelectedDate(
                      formData.desiredDate
                    )}
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <span className="text-[#5C4033]/60">
                    Document
                  </span>

                  <span className="break-all font-semibold text-[#5C4033]">
                    {uploadedFile?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="electronicSignature"
                  className="text-base font-semibold text-[#5C4033]"
                >
                  Votre nom complet *
                </Label>

                <Input
                  id="electronicSignature"
                  value={signature}
                  onChange={(event) =>
                    setSignature(
                      event.target.value
                    )
                  }
                  placeholder="Saisissez votre nom complet"
                  disabled={submitting}
                  autoComplete="name"
                  className="h-12 border-[#D1965B]/30 text-base focus-visible:ring-[#D1965B]"
                />

                <div className="min-h-24 rounded-xl border border-dashed border-[#D1965B]/40 bg-[#F3EEE5]/50 p-5">
                  <p className="font-serif text-2xl italic text-[#5C4033] sm:text-3xl">
                    {signature.trim() ||
                      "Votre signature apparaîtra ici"}
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-[#D1965B]/20 p-5">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) =>
                    setConfirmed(
                      event.target.checked
                    )
                  }
                  disabled={submitting}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#D1965B]"
                />

                <span className="text-sm leading-7 text-[#5C4033]/75">
                  Je confirme avoir vérifié
                  toutes les informations,
                  notamment la date souhaitée,
                  et j&apos;accepte que mon nom
                  constitue ma signature
                  électronique.
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#D1965B]/20 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={
                    closeSignatureModal
                  }
                  className="border-[#D1965B]/40 text-[#5C4033]"
                >
                  Annuler
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    void handleSignAndSend()
                  }
                  disabled={
                    submitting ||
                    signature.trim().length <
                      3 ||
                    !confirmed
                  }
                  className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Signer et envoyer
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