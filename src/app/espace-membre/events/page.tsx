"use client";

import AgendaContainer from "../../components/agenda/agendaContainer";
export default function EventsPage() {
  return (
    <div className="min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Événements</h1>
      <p className="text-muted-foreground mt-2">
        Découvrez et inscrivez-vous aux événements du centre
      </p>
      <AgendaContainer />
    </div>
  );
}
