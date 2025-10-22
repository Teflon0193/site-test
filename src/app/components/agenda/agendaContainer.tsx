"use client";

import { useEventFilters } from "../../../hooks/useEventFilters";
import EventFilters from "./eventFilters";
import Calendar from "./calendar";

export default function AgendaContainer() {
  // Utilisation du hook personnalisé pour gérer les filtres
  const event = useEventFilters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      {/* Composant de filtres */}
      <EventFilters
        filters={event.filters}
        onFilterChange={event.updateFilter}
        onClearFilters={event.clearFilters}
        hasActiveFilters={event.hasActiveFilters}
        eventCount={event.filteredEvents.length}
      />

      {/* Composant de calendrier avec événements filtrés */}
      <Calendar filters={event} />
    </div>
  );
}
