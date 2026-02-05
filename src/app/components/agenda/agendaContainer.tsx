"use client";

import { useEventFilters } from "../../../hooks/useEventFilters";
import EventFilters from "./eventFilters";
import Calendar from "./calendar";

export default function AgendaContainer() {
  const event = useEventFilters();

  return (
    <div className="min-h-screen bg-white">
      <EventFilters
        filters={event.filters}
        onFilterChange={event.updateFilter}
        onClearFilters={event.clearFilters}
        hasActiveFilters={event.hasActiveFilters}
        eventCount={event.filteredEvents.length}
      />

      <Calendar events={event.filteredEvents} />
    </div>
  );
}
