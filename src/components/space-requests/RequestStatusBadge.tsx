interface RequestStatusBadgeProps {
  status: string;
}

type StatusConfig = {
  label: string;
  className: string;
};

const statusConfig: Record<
  string,
  StatusConfig
> = {
  draft: {
    label: "Brouillon",
    className:
      "border-gray-200 bg-gray-100 text-gray-700",
  },

  submitted: {
    label: "Demande soumise",
    className:
      "border-blue-200 bg-blue-100 text-blue-700",
  },

  program_review: {
    label: "En attente du Programme",
    className:
      "border-blue-200 bg-blue-100 text-blue-700",
  },

  general_review: {
    label: "En attente du Régisseur général",
    className:
      "border-purple-200 bg-purple-100 text-purple-700",
  },

  artistic_review: {
    label: "En attente de la Direction artistique",
    className:
      "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700",
  },

  communication_review: {
    label: "En attente de Communication",
    className:
      "border-cyan-200 bg-cyan-100 text-cyan-700",
  },

  awaiting_member_confirmation: {
    label: "Confirmation du membre requise",
    className:
      "border-amber-200 bg-amber-100 text-amber-700",
  },

  program_review_after_confirmation: {
    label: "Retour au Programme",
    className:
      "border-blue-200 bg-blue-100 text-blue-700",
  },

  legal_review: {
    label: "En attente du service Juridique",
    className:
      "border-indigo-200 bg-indigo-100 text-indigo-700",
  },

  program_review_after_legal: {
    label: "Retour du Juridique au Programme",
    className:
      "border-blue-200 bg-blue-100 text-blue-700",
  },

  finance_cotation: {
    label: "En attente de cotation",
    className:
      "border-emerald-200 bg-emerald-100 text-emerald-700",
  },

  program_review_after_finance: {
    label: "Cotation retournée au Programme",
    className:
      "border-orange-200 bg-orange-100 text-orange-700",
  },

  completed: {
    label: "Traitement terminé",
    className:
      "border-green-200 bg-green-100 text-green-700",
  },

  rejected: {
    label: "Demande refusée",
    className:
      "border-red-200 bg-red-100 text-red-700",
  },
};

function formatUnknownStatus(
  status: string
): string {
  if (!status) {
    return "Statut inconnu";
  }

  const formatted = status
    .replaceAll("_", " ")
    .trim();

  return (
    formatted.charAt(0).toUpperCase() +
    formatted.slice(1)
  );
}

export default function RequestStatusBadge({
  status,
}: RequestStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: formatUnknownStatus(status),
    className:
      "border-gray-200 bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex max-w-full rounded-full border px-3 py-1 text-center text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}