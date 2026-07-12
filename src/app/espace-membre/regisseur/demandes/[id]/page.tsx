"use client";

import WorkflowRequestDetail from "@/components/space-requests/WorkflowRequestDetail";

export default function RegisseurRequestDetailPage() {
  return (
    <WorkflowRequestDetail
      role="REGISSEUR_GENERAL"
      title="Examen du Régisseur général"
      subtitle="Examinez le formulaire initial, ajoutez vos observations et signez avant la transmission à la Direction artistique."
      backHref="/espace-membre/regisseur/demandes"
    />
  );
}