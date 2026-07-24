"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpaceSelect from "@/components/space-requests/SpaceSelect";
import { getCcapacSpace } from "@/constants/spaces";
import {
  spaceRequestService,
  type BookedCalendarEvent,
} from "@/services/spaceRequestService";

type CompatibleCalendarEvent = BookedCalendarEvent & {
  space_id?: number | string | null;
  space?: number | string | { id?: number | string | null } | null;
};

function getBookedSpaceId(
  event: BookedCalendarEvent
): number | null {
  const compatibleEvent = event as CompatibleCalendarEvent;
  const rawSpace =
    compatibleEvent.spaceId ??
    compatibleEvent.space_id ??
    compatibleEvent.space;
  const rawId =
    typeof rawSpace === "object" && rawSpace !== null
      ? rawSpace.id
      : rawSpace;
  const normalizedId = Number(rawId);

  return Number.isInteger(normalizedId) && normalizedId > 0
    ? normalizedId
    : null;
}

type FormValues = {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  applicantRole: string;
  organizationName: string;
  legalStatus: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationEmail: string;
  statutoryDirector: string;
  registrationNumber: string;
  eventName: string;
  eventDescription: string;
  otherObjective: string;
  desiredDate: string;
  setupStart: string;
  setupEnd: string;
  activityStart: string;
  activityEnd: string;
  teardownStart: string;
  teardownEnd: string;
  totalDays: string;
  participants: string;
  audienceProfile: string;
  operationalName: string;
  operationalPhone: string;
  operationalEmail: string;
  operationalOtherRole: string;
  technicalEquipment: "" | "yes" | "no";
  technicalNeeds: string;
  technicalSheet: "" | "attached" | "later";
  technicalStaff: string;
  securityAgents: string;
  publicStaff: string;
  emergencyPlan: string;
  insuranceSubscribed: "" | "yes" | "no";
  insuranceType: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insuranceStart: string;
  insuranceEnd: string;
  previousAuthorization: "" | "yes" | "no";
  previousAuthorizationDetails: string;
  catererUsed: "" | "yes" | "no";
  catererName: string;
  foodSales: "" | "yes" | "no";
  productSales: "" | "yes" | "no";
  otherServices: string;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const objectives = [
  "Culturel / artistique",
  "Éducatif / pédagogique",
  "Institutionnel",
  "Citoyen / mémoriel",
  "Professionnel / corporatif",
];

const disciplines = [
  "Littérature et arts de l’oralité",
  "Musique",
  "Danse",
  "Théâtre et arts dramatiques",
  "Cinéma et audiovisuel",
  "Arts plastiques et visuels",
  "Photographie",
  "Architecture et urbanisme",
  "Mode et design vestimentaire",
  "Métiers d’art et artisanat",
  "Patrimoine culturel matériel",
  "Patrimoine culturel immatériel",
  "Arts culinaires et gastronomie congolaise",
  "Arts numériques et nouvelles technologies",
];

const operationalRoles = [
  "Coordinateur général",
  "Responsable technique",
  "Responsable sécurité / flux",
];

const initialValues: FormValues = {
  fullName: "",
  address: "",
  phone: "",
  email: "",
  applicantRole: "",
  organizationName: "",
  legalStatus: "",
  organizationAddress: "",
  organizationPhone: "",
  organizationEmail: "",
  statutoryDirector: "",
  registrationNumber: "",
  eventName: "",
  eventDescription: "",
  otherObjective: "",
  desiredDate: "",
  setupStart: "",
  setupEnd: "",
  activityStart: "",
  activityEnd: "",
  teardownStart: "",
  teardownEnd: "",
  totalDays: "",
  participants: "",
  audienceProfile: "",
  operationalName: "",
  operationalPhone: "",
  operationalEmail: "",
  operationalOtherRole: "",
  technicalEquipment: "",
  technicalNeeds: "",
  technicalSheet: "",
  technicalStaff: "",
  securityAgents: "",
  publicStaff: "",
  emergencyPlan: "",
  insuranceSubscribed: "",
  insuranceType: "",
  insuranceCompany: "",
  insurancePolicyNumber: "",
  insuranceStart: "",
  insuranceEnd: "",
  previousAuthorization: "",
  previousAuthorizationDetails: "",
  catererUsed: "",
  catererName: "",
  foodSales: "",
  productSales: "",
  otherServices: "",
};

function localDateValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "Non renseigné";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function errorMessage(error: unknown) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ERR_NETWORK"
        ? "Impossible de contacter le serveur."
        : "Impossible d’envoyer la demande.")
    );
  }

  return error instanceof Error
    ? error.message
    : "Impossible d’envoyer la demande.";
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#D1965B]/15 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-[#D1965B]/15 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D1965B] text-sm font-bold text-white">
          {number}
        </span>
        <h2 className="text-lg font-bold text-[#5C4033]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[#5C4033]">
        {label}{required ? " *" : ""}
      </Label>
      <Input
        type={type}
        value={value}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border-[#D1965B]/30 focus-visible:ring-[#D1965B]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required = false,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[#5C4033]">
        {label}{required ? " *" : ""}
      </Label>
      <textarea
        value={value}
        required={required}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-md border border-[#D1965B]/30 bg-white px-3 py-2 text-sm text-[#5C4033] outline-none focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20"
      />
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "" | "yes" | "no";
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[#5C4033]">
        {label}
      </legend>
      <div className="flex gap-5">
        {[
          ["yes", "Oui"],
          ["no", "Non"],
        ].map(([option, text]) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-[#5C4033]/80"
          >
            <input
              type="radio"
              checked={value === option}
              onChange={() => onChange(option as "yes" | "no")}
              className="accent-[#D1965B]"
            />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function NewRequestPage() {
  const router = useRouter();
  const minimumDate = useMemo(localDateValue, []);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [space, setSpace] = useState(0);
  const [bookedEvents, setBookedEvents] = useState<
    BookedCalendarEvent[]
  >([]);
  const [loadingAvailability, setLoadingAvailability] =
    useState(true);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedOperationalRoles, setSelectedOperationalRoles] = useState<string[]>([]);
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState(false);
  const [acceptedDeclarations, setAcceptedDeclarations] = useState(false);
  const [signature, setSignature] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      try {
        setLoadingAvailability(true);
        const data =
          await spaceRequestService.getBookedCalendarEvents();

        if (active) {
          setBookedEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Availability loading error:", error);

        if (active) {
          setBookedEvents([]);
          toast.error(
            "Impossible de vérifier les espaces déjà réservés."
          );
        }
      } finally {
        if (active) {
          setLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      active = false;
    };
  }, []);

  const unavailableSpaceIds = useMemo(() => {
    if (!values.desiredDate) {
      return [];
    }

    return Array.from(
      new Set(
        bookedEvents
          .filter(
            (event) =>
              event.date?.slice(0, 10) === values.desiredDate
          )
          .map(getBookedSpaceId)
          .filter((spaceId): spaceId is number => spaceId !== null)
      )
    );
  }, [bookedEvents, values.desiredDate]);

  useEffect(() => {
    if (space && unavailableSpaceIds.includes(space)) {
      setSpace(0);
      toast.warning(
        "L’espace sélectionné est déjà réservé pour cette date. Choisissez un autre espace."
      );
    }
  }, [space, unavailableSpaceIds]);

  const setField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggle = (
    value: string,
    selected: string[],
    setter: (values: string[]) => void
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const validateForm = () => {
    if (!values.fullName.trim()) return "Le nom complet est obligatoire.";
    if (!values.email.trim()) return "L’adresse email est obligatoire.";
    if (!values.phone.trim()) return "Le téléphone est obligatoire.";
    if (!values.eventName.trim()) return "L’intitulé de l’activité est obligatoire.";
    if (!values.eventDescription.trim()) return "La description de l’activité est obligatoire.";
    if (!values.desiredDate) return "La date souhaitée est obligatoire.";
    if (!space) return "Sélectionnez l’espace souhaité.";
    if (unavailableSpaceIds.includes(space)) {
      return "Cet espace est déjà réservé pour la date sélectionnée.";
    }
    if (!values.participants.trim()) return "Le nombre de participants est obligatoire.";
    if (!authorizedRepresentative) return "Vous devez certifier être habilité à introduire la demande.";
    if (!acceptedDeclarations) return "Vous devez accepter les déclarations et engagements.";
    return null;
  };

  const generatePdf = async (electronicSignature = "") => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const ensureSpace = (height = 12) => {
      if (y + height <= pageHeight - 18) return;
      pdf.addPage();
      y = 18;
    };

    const addWrapped = (
      text: string,
      options?: { bold?: boolean; size?: number; color?: [number, number, number] }
    ) => {
      const size = options?.size || 9.5;
      pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
      pdf.setFontSize(size);
      const color = options?.color || [92, 64, 51];
      pdf.setTextColor(color[0], color[1], color[2]);
      const lines = pdf.splitTextToSize(text || "Non renseigné", contentWidth);
      ensureSpace(lines.length * 5 + 2);
      pdf.text(lines, margin, y);
      y += lines.length * 5 + 2;
    };

    const section = (title: string) => {
      ensureSpace(14);
      y += 2;
      pdf.setFillColor(209, 150, 91);
      pdf.roundedRect(margin, y - 5, contentWidth, 9, 1.5, 1.5, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(title, margin + 3, y + 1);
      y += 9;
    };

    const field = (label: string, value: string) => {
      addWrapped(`${label} : ${value || "Non renseigné"}`);
    };

    pdf.setFillColor(209, 150, 91);
    pdf.rect(0, 0, pageWidth, 38, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("CCAPAC – GRAND TAMBOUR", margin, 16);
    pdf.setFontSize(11);
    pdf.text("FORMULAIRE DE DEMANDE D’UTILISATION DES SALLES ET ESPACES", margin, 27);
    y = 47;

    addWrapped(
      "IMPORTANT : Le présent formulaire constitue un document précontractuel et un engagement sur l’honneur. Toute autorisation est soumise à la validation du CCAPAC–Grand Tambour et à la signature d’un accord d’occupation temporaire.",
      { bold: true, size: 9, color: [120, 70, 25] }
    );

    section("I. IDENTIFICATION DU SOLLICITANT");
    field("Nom complet", values.fullName);
    field("Adresse", values.address);
    field("Téléphone", values.phone);
    field("Email", values.email);
    field("Fonction / qualité", values.applicantRole);
    field("Habilité à engager le sollicitant", authorizedRepresentative ? "Oui" : "Non");

    section("II. IDENTITÉ ET STATUT JURIDIQUE DE L’ORGANISATION");
    field("Dénomination sociale", values.organizationName);
    field("Statut juridique", values.legalStatus);
    field("Adresse du siège", values.organizationAddress);
    field("Téléphone", values.organizationPhone);
    field("Email", values.organizationEmail);
    field("Dirigeant statutaire", values.statutoryDirector);
    field("Numéro d’enregistrement / RCCM", values.registrationNumber);

    section("III. OBJET DE LA DEMANDE");
    field("Intitulé", values.eventName);
    field("Description", values.eventDescription);
    field("Objectifs", [...selectedObjectives, values.otherObjective].filter(Boolean).join(", "));

    section("IV. CALENDRIER PRÉVISIONNEL");
    field("Date souhaitée", formatDate(values.desiredDate));
    field("Montage", `${formatDate(values.setupStart)} au ${formatDate(values.setupEnd)}`);
    field("Activités", `${formatDate(values.activityStart)} au ${formatDate(values.activityEnd)}`);
    field("Démontage", `${formatDate(values.teardownStart)} au ${formatDate(values.teardownEnd)}`);
    field("Nombre total de jours", values.totalDays);

    section("V. ESPACE ET PUBLIC ATTENDU");
    field(
      "Espace sollicité",
      getCcapacSpace(space)?.name || String(space)
    );
    field("Participants estimés", values.participants);
    field("Profil du public", values.audienceProfile);

    section("VI. RESPONSABLE OPÉRATIONNEL");
    field("Nom", values.operationalName);
    field("Téléphone", values.operationalPhone);
    field("Email", values.operationalEmail);
    field("Fonction", [...selectedOperationalRoles, values.operationalOtherRole].filter(Boolean).join(", "));

    section("VII. FICHE TECHNIQUE");
    field("Équipements techniques", values.technicalEquipment === "yes" ? "Oui" : "Non");
    field("Besoins", values.technicalNeeds);
    field("Fiche technique", values.technicalSheet === "attached" ? "Jointe" : values.technicalSheet === "later" ? "À fournir" : "Non renseigné");
    field("Intervenants techniques", values.technicalStaff);

    section("VIII. SÉCURITÉ, ORGANISATION ET FLUX");
    field("Agents de sécurité", values.securityAgents);
    field("Salariés / bénévoles", values.publicStaff);
    field("Gestion des flux et urgences", values.emergencyPlan);

    section("IX. ASSURANCES");
    field("Assurance souscrite", values.insuranceSubscribed === "yes" ? "Oui" : "Non");
    field("Type", values.insuranceType);
    field("Compagnie", values.insuranceCompany);
    field("Numéro de police", values.insurancePolicyNumber);
    field("Validité", `${formatDate(values.insuranceStart)} au ${formatDate(values.insuranceEnd)}`);

    section("X. ANTÉCÉDENTS AVEC LE CCAPAC");
    field("Autorisation antérieure", values.previousAuthorization === "yes" ? "Oui" : "Non");
    field("Détails", values.previousAuthorizationDetails);

    section("XI À XVII. DÉCLARATIONS, COMMUNICATION ET DISCIPLINES");
    field("Disciplines", selectedDisciplines.join(", "));
    field("Traiteur", values.catererUsed === "yes" ? `Oui – ${values.catererName}` : "Non");
    field("Vente de nourriture / boissons", values.foodSales === "yes" ? "Oui" : "Non");
    field("Vente de produits", values.productSales === "yes" ? "Oui" : "Non");
    field("Autres services", values.otherServices);
    addWrapped(
      "Le sollicitant reconnaît les règles relatives à la propriété intellectuelle, au droit à l’image, à la communication, aux droits du CCAPAC–Grand Tambour, à la responsabilité civile et au droit congolais. Il certifie l’exactitude des informations et s’engage à respecter le règlement intérieur et les normes de sécurité.",
      { size: 9 }
    );

    section("XVIII. SIGNATURE ÉLECTRONIQUE");
    field("Mention", "Lu et approuvé");
    field("Nom du sollicitant", electronicSignature || "Signature à confirmer avant l’envoi");
    field("Date", new Date().toLocaleDateString("fr-FR"));

    const pages = pdf.getNumberOfPages();
    for (let index = 1; index <= pages; index += 1) {
      pdf.setPage(index);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(140, 120, 110);
      pdf.text(`CCAPAC – Formulaire d’occupation · Page ${index}/${pages}`, margin, pageHeight - 8);
    }

    return pdf.output("blob");
  };

  const handlePreview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setGenerating(true);
      const blob = await generatePdf();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setSignature(values.fullName.trim());
      setConfirmed(false);
      setPreviewOpen(true);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Impossible de générer le PDF.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSignAndSend = async () => {
    const cleanSignature = signature.trim();
    if (cleanSignature.length < 3) {
      toast.error("Saisissez votre nom complet comme signature.");
      return;
    }
    if (!confirmed) {
      toast.error("Confirmez l’exactitude des informations.");
      return;
    }

    try {
      setSending(true);
      const signedBlob = await generatePdf(cleanSignature);
      const pdfFile = new File(
        [signedBlob],
        `Fiche-demande-CCAPAC-${Date.now()}.pdf`,
        { type: "application/pdf" }
      );

      const request = await spaceRequestService.create(
        {
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          eventName: values.eventName.trim(),
          space,
          date: values.desiredDate,
          participants: Number(values.participants) || 1,
          description: [
            `Demandeur : ${values.fullName.trim()}`,
            `Email : ${values.email.trim().toLowerCase()}`,
            `Téléphone : ${values.phone.trim()}`,
            `Date souhaitée : ${formatDate(values.desiredDate)}`,
          ].join("\n"),
        },
        pdfFile
      );

      await spaceRequestService.submit(request.id, cleanSignature);

      toast.success("Demande signée et transmise au Service des Programmes.");
      router.replace(`/espace-membre/membre/demandes/${request.id}`);
    } catch (error) {
      console.error("Request submission error:", error);
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  const checkboxList = (
    options: string[],
    selected: string[],
    setter: (values: string[]) => void
  ) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D1965B]/15 bg-[#FBF9F5] p-3 text-sm text-[#5C4033]"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option, selected, setter)}
            className="mt-0.5 accent-[#D1965B]"
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-10 text-[#5C4033]">
      <Link
        href="/espace-membre/membre"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#D1965B] hover:text-[#B97D47]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l’accueil
      </Link>

      <header className="rounded-3xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/75">
          Demande d’occupation
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Formulaire en ligne
        </h1>
        <p className="mt-3 max-w-3xl text-white/90">
          Remplissez les renseignements ci-dessous. Vous pourrez prévisualiser le document PDF avant de le signer et de l’envoyer.
        </p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        <strong>Important :</strong> ce formulaire constitue un document précontractuel et un engagement sur l’honneur. Le traitement dure généralement entre 3 jours et 1 semaine. Si la date demandée est occupée, une autre date disponible pourra être proposée.
      </div>

      <form onSubmit={handlePreview} className="space-y-6">
        <Section number="I" title="Identification du sollicitant">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Noms, post-nom et prénom" value={values.fullName} onChange={(value) => setField("fullName", value)} required />
            <Field label="Fonction / qualité" value={values.applicantRole} onChange={(value) => setField("applicantRole", value)} />
            <Field label="Adresse complète" value={values.address} onChange={(value) => setField("address", value)} />
            <Field label="Téléphone" value={values.phone} onChange={(value) => setField("phone", value)} required />
            <Field label="Email" type="email" value={values.email} onChange={(value) => setField("email", value)} required />
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-xl bg-[#F3EEE5]/70 p-4 text-sm">
            <input type="checkbox" checked={authorizedRepresentative} onChange={(event) => setAuthorizedRepresentative(event.target.checked)} className="mt-1 accent-[#D1965B]" />
            Je certifie être habilité à engager juridiquement la personne physique ou morale concernée.
          </label>
        </Section>

        <Section number="II" title="Organisation (le cas échéant)">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Dénomination sociale" value={values.organizationName} onChange={(value) => setField("organizationName", value)} />
            <Field label="Statut juridique" value={values.legalStatus} onChange={(value) => setField("legalStatus", value)} placeholder="ASBL, entreprise, établissement public..." />
            <Field label="Adresse du siège" value={values.organizationAddress} onChange={(value) => setField("organizationAddress", value)} />
            <Field label="Téléphone" value={values.organizationPhone} onChange={(value) => setField("organizationPhone", value)} />
            <Field label="Email" type="email" value={values.organizationEmail} onChange={(value) => setField("organizationEmail", value)} />
            <Field label="Dirigeant statutaire" value={values.statutoryDirector} onChange={(value) => setField("statutoryDirector", value)} />
            <Field label="Numéro d’enregistrement / RCCM" value={values.registrationNumber} onChange={(value) => setField("registrationNumber", value)} />
          </div>
        </Section>

        <Section number="III" title="Objet de la demande">
          <div className="space-y-5">
            <Field label="Intitulé de l’activité / événement" value={values.eventName} onChange={(value) => setField("eventName", value)} required />
            <TextAreaField label="Description synthétique, programme et finalité" value={values.eventDescription} onChange={(value) => setField("eventDescription", value)} required />
            <div>
              <Label className="mb-3 block text-[#5C4033]">Objectifs principaux</Label>
              {checkboxList(objectives, selectedObjectives, setSelectedObjectives)}
            </div>
            <Field label="Autre objectif" value={values.otherObjective} onChange={(value) => setField("otherObjective", value)} />
          </div>
        </Section>

        <Section number="IV" title="Calendrier prévisionnel d’occupation">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Date souhaitée principale" type="date" min={minimumDate} value={values.desiredDate} onChange={(value) => setField("desiredDate", value)} required />
            <Field label="Nombre total de jours" type="number" value={values.totalDays} onChange={(value) => setField("totalDays", value)} />
            <Field label="Montage – début" type="date" value={values.setupStart} onChange={(value) => setField("setupStart", value)} />
            <Field label="Montage – fin" type="date" value={values.setupEnd} onChange={(value) => setField("setupEnd", value)} />
            <Field label="Activité – début" type="date" value={values.activityStart} onChange={(value) => setField("activityStart", value)} />
            <Field label="Activité – fin" type="date" value={values.activityEnd} onChange={(value) => setField("activityEnd", value)} />
            <Field label="Démontage – début" type="date" value={values.teardownStart} onChange={(value) => setField("teardownStart", value)} />
            <Field label="Démontage – fin" type="date" value={values.teardownEnd} onChange={(value) => setField("teardownEnd", value)} />
          </div>
        </Section>

        <Section number="V" title="Salle / espace sollicité et public attendu">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <SpaceSelect
                value={space}
                onChange={setSpace}
                disabled={!values.desiredDate || loadingAvailability}
                unavailableSpaceIds={unavailableSpaceIds}
              />

              {!values.desiredDate && (
                <p className="mt-2 text-xs text-[#5C4033]/60">
                  Sélectionnez d’abord la date souhaitée pour afficher les espaces disponibles.
                </p>
              )}

              {loadingAvailability && (
                <p className="mt-2 text-xs font-medium text-[#D1965B]">
                  Vérification des disponibilités…
                </p>
              )}
            </div>
            <Field label="Nombre estimé de participants" type="number" value={values.participants} onChange={(value) => setField("participants", value)} required />
            <div className="md:col-span-2">
              <TextAreaField label="Profil du public" value={values.audienceProfile} onChange={(value) => setField("audienceProfile", value)} rows={3} />
            </div>
          </div>
        </Section>

        <Section number="VI" title="Responsable opérationnel">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nom complet" value={values.operationalName} onChange={(value) => setField("operationalName", value)} />
            <Field label="Téléphone pendant l’événement" value={values.operationalPhone} onChange={(value) => setField("operationalPhone", value)} />
            <Field label="Email" type="email" value={values.operationalEmail} onChange={(value) => setField("operationalEmail", value)} />
            <Field label="Autre fonction" value={values.operationalOtherRole} onChange={(value) => setField("operationalOtherRole", value)} />
          </div>
          <div className="mt-5">{checkboxList(operationalRoles, selectedOperationalRoles, setSelectedOperationalRoles)}</div>
        </Section>

        <Section number="VII" title="Fiche technique – besoins matériels">
          <div className="space-y-5">
            <YesNo label="Utilisation d’équipements techniques ?" value={values.technicalEquipment} onChange={(value) => setField("technicalEquipment", value)} />
            <TextAreaField label="Besoins en son, lumière, projection, scène ou autres" value={values.technicalNeeds} onChange={(value) => setField("technicalNeeds", value)} />
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Fiche technique détaillée</legend>
              <div className="flex flex-wrap gap-5 text-sm">
                <label className="flex gap-2"><input type="radio" checked={values.technicalSheet === "attached"} onChange={() => setField("technicalSheet", "attached")} className="accent-[#D1965B]" /> Jointe</label>
                <label className="flex gap-2"><input type="radio" checked={values.technicalSheet === "later"} onChange={() => setField("technicalSheet", "later")} className="accent-[#D1965B]" /> À fournir avant validation</label>
              </div>
            </fieldset>
            <TextAreaField label="Intervenants techniques internes / externes" value={values.technicalStaff} onChange={(value) => setField("technicalStaff", value)} rows={3} />
          </div>
        </Section>

        <Section number="VIII" title="Sécurité, organisation et flux">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nombre d’agents de sécurité" type="number" value={values.securityAgents} onChange={(value) => setField("securityAgents", value)} />
            <Field label="Salariés / bénévoles encadrant le public" type="number" value={values.publicStaff} onChange={(value) => setField("publicStaff", value)} />
            <div className="md:col-span-2"><TextAreaField label="Dispositif de gestion des flux et d’urgence" value={values.emergencyPlan} onChange={(value) => setField("emergencyPlan", value)} /></div>
          </div>
        </Section>

        <Section number="IX" title="Assurances">
          <div className="space-y-5">
            <YesNo label="Une assurance responsabilité civile a-t-elle été souscrite ?" value={values.insuranceSubscribed} onChange={(value) => setField("insuranceSubscribed", value)} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Type d’assurance" value={values.insuranceType} onChange={(value) => setField("insuranceType", value)} />
              <Field label="Compagnie d’assurance" value={values.insuranceCompany} onChange={(value) => setField("insuranceCompany", value)} />
              <Field label="Numéro de police" value={values.insurancePolicyNumber} onChange={(value) => setField("insurancePolicyNumber", value)} />
              <Field label="Date d’effet" type="date" value={values.insuranceStart} onChange={(value) => setField("insuranceStart", value)} />
              <Field label="Date d’échéance" type="date" value={values.insuranceEnd} onChange={(value) => setField("insuranceEnd", value)} />
            </div>
          </div>
        </Section>

        <Section number="X" title="Antécédents avec le CCAPAC–Grand Tambour">
          <div className="space-y-5">
            <YesNo label="Avez-vous déjà bénéficié d’une autorisation ?" value={values.previousAuthorization} onChange={(value) => setField("previousAuthorization", value)} />
            <TextAreaField label="Date, événement et espaces utilisés" value={values.previousAuthorizationDetails} onChange={(value) => setField("previousAuthorizationDetails", value)} rows={3} />
          </div>
        </Section>

        <Section number="XI–XIII" title="Propriété intellectuelle, communication et disciplines">
          <p className="mb-5 text-sm leading-6 text-[#5C4033]/70">
            Toute captation, diffusion ou utilisation de l’image, du logo ou des espaces du CCAPAC–Grand Tambour est soumise à autorisation préalable. Sélectionnez les disciplines concernées.
          </p>
          {checkboxList(disciplines, selectedDisciplines, setSelectedDisciplines)}
        </Section>

        <Section number="XIV" title="Prestations annexes, ventes et services">
          <div className="space-y-5">
            <YesNo label="Utilisation d’un traiteur ?" value={values.catererUsed} onChange={(value) => setField("catererUsed", value)} />
            <Field label="Nom du traiteur" value={values.catererName} onChange={(value) => setField("catererName", value)} />
            <YesNo label="Vente de boissons ou nourriture ?" value={values.foodSales} onChange={(value) => setField("foodSales", value)} />
            <YesNo label="Vente de produits ou marchandises ?" value={values.productSales} onChange={(value) => setField("productSales", value)} />
            <Field label="Autres services" value={values.otherServices} onChange={(value) => setField("otherServices", value)} />
          </div>
        </Section>

        <Section number="XV–XVII" title="Droits, responsabilités et engagements">
          <div className="space-y-4 text-sm leading-6 text-[#5C4033]/75">
            <p>Le CCAPAC–Grand Tambour conserve la priorité d’utilisation de ses espaces et peut refuser, suspendre ou annuler une demande en cas de non-conformité ou de risque.</p>
            <p>Le sollicitant assume la responsabilité civile des dommages causés, s’engage à respecter le règlement intérieur, les normes de sécurité et à signaler tout changement important.</p>
            <p>Le formulaire et l’accord subséquent sont régis par le droit congolais.</p>
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <input type="checkbox" checked={acceptedDeclarations} onChange={(event) => setAcceptedDeclarations(event.target.checked)} className="mt-1 accent-emerald-600" />
            Je certifie l’exactitude des informations et j’accepte l’ensemble des déclarations, responsabilités et engagements.
          </label>
        </Section>

        <div className="sticky bottom-4 z-20 rounded-2xl border border-[#D1965B]/20 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex sm:items-center sm:justify-between">
          <div className="mb-3 flex items-center gap-3 sm:mb-0">
            <FileText className="h-6 w-6 text-[#D1965B]" />
            <div>
              <p className="font-semibold">Votre formulaire sera généré en PDF</p>
              <p className="text-xs text-[#5C4033]/60">Vous pourrez le vérifier avant l’envoi.</p>
            </div>
          </div>
          <Button type="submit" disabled={generating} className="w-full bg-[#D1965B] text-white hover:bg-[#B97D47] sm:w-auto">
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            {generating ? "Génération..." : "Générer et voir le PDF"}
          </Button>
        </div>
      </form>

      {previewOpen && previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6">
          <div className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#D1965B]/15 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">Prévisualisation du formulaire PDF</h2>
                <p className="text-xs text-[#5C4033]/60">Vérifiez les informations avant de signer.</p>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-lg p-2 hover:bg-[#F3EEE5]" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </header>

            <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_340px]">
              <iframe title="Aperçu du formulaire PDF" src={previewUrl} className="h-[52vh] w-full bg-gray-100 lg:h-[75vh]" />

              <aside className="overflow-y-auto border-t border-[#D1965B]/15 p-5 lg:border-l lg:border-t-0">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  En signant, vous certifiez sur l’honneur que les informations du PDF sont exactes.
                </div>

                <div className="mt-5 space-y-2">
                  <Label>Signature électronique *</Label>
                  <Input value={signature} onChange={(event) => setSignature(event.target.value)} placeholder="Votre nom complet" className="border-[#D1965B]/30" />
                  <div className="rounded-xl border border-dashed border-[#D1965B]/30 bg-[#FBF9F5] p-4 font-serif text-xl italic">{signature || "Votre signature apparaîtra ici"}</div>
                </div>

                <label className="mt-5 flex items-start gap-3 rounded-xl border border-[#D1965B]/15 p-4 text-sm">
                  <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 accent-[#D1965B]" />
                  J’ai vérifié le PDF et j’accepte que mon nom constitue ma signature électronique.
                </label>

                <Button type="button" onClick={handleSignAndSend} disabled={sending} className="mt-5 w-full bg-[#D1965B] text-white hover:bg-[#B97D47]">
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {sending ? "Envoi en cours..." : "Signer et envoyer"}
                </Button>

                <Button type="button" variant="outline" onClick={() => setPreviewOpen(false)} disabled={sending} className="mt-3 w-full border-[#D1965B]/30">
                  Modifier les informations
                </Button>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}