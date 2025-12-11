"use client";

import { useState } from "react";
import {
  HiCalendar,
  HiUsers,
  HiClock,
  HiLocationMarker,
  HiSearch,
  HiOutlineClipboardList,
} from "react-icons/hi";
import {
  formatEventDateTime,
  formatTimePeriod,
  formatRegistrationDate,
} from "@/lib/dateUtils";

import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { useEventsWithRegistrationsQuery } from "@/hooks/useEventsQuery";
import { EventWithRegistrations } from "@/types/events";

export function EventsPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: events = [],
    isLoading: loading,
    isError,
    error,
  } = useEventsWithRegistrationsQuery();

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRegistrations = events.reduce(
    (acc, curr) => acc + curr.registrationsCount,
    0
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Chargement des événements...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-3">
          <HiOutlineClipboardList className="h-6 w-6" />
        </div>
        <p className="text-destructive font-medium">
          {error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des événements"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline text-muted-foreground hover:text-foreground"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Gestion des Événements
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
            Consultez les détails de vos événements, suivez les inscriptions en
            temps réel et gérez la liste des participants.
          </p>
        </div>

        <div className="flex gap-3 sm:gap-6">
          <div className="bg-card border border-border/50 rounded-lg p-3 sm:p-4 text-center min-w-[100px] shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {events.length}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Événements
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-lg p-3 sm:p-4 text-center min-w-[100px] shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalRegistrations}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Inscrits
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sticky top-4 z-10 bg-background/80 backdrop-blur-md p-2 -mx-2 rounded-lg border border-transparent has-[:focus]:border-border/40 transition-all">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un événement par titre ou discipline..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background/50 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Future filter buttons can go here */}
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 rounded-xl border border-dashed border-muted">
          <div className="bg-muted/20 p-4 rounded-full mb-4">
            <HiCalendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-1">
            Aucun événement trouvé
          </p>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? "Essayez de modifier votre recherche."
              : "Il n'y a pas d'événements actifs pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="group border border-border/40 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardHeader className="p-5 sm:p-6 border-b border-border/10 bg-muted/5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors"
                      >
                        {event.discipline}
                      </Badge>
                      {event.registrationsCount > 0 && (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-border"
                        >
                          {event.registrationsCount} participant
                          {event.registrationsCount > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground/80 leading-relaxed max-w-3xl mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                        {event.description}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded">
                        <HiCalendar className="h-4 w-4 text-primary/70 shrink-0" />
                        <span>
                          {formatEventDateTime(event.startDate, event.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded">
                        <HiClock className="h-4 w-4 text-primary/70 shrink-0" />
                        <span>
                          {formatTimePeriod(event.startTime, event.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded">
                        <HiLocationMarker className="h-4 w-4 text-primary/70 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {event.registrationsCount > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={`event-${event.id}`}
                      className="border-0"
                    >
                      <AccordionTrigger className="px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/10  transition-colors data-[state=open]:text-primary data-[state=open]:bg-primary/5 border-b border-border/10">
                        <span className="flex items-center gap-2">
                          <HiUsers className="h-4 w-4" />
                          Voir la liste des participants
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 py-0">
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-muted/5">
                          {event.registrations.map(
                            (
                              registration: EventWithRegistrations["registrations"][number],
                              index: number
                            ) => (
                              <div
                                key={registration.id}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-background transition-colors border-b border-border/10 last:border-0`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-muted-foreground border border-border/50">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-foreground">
                                      {registration.userName}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80">
                                      {registration.userEmail}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0 w-full sm:w-auto">
                                  <div className="text-[10px] text-muted-foreground text-right hidden sm:block">
                                    <div className="opacity-70">Inscrit le</div>
                                    {formatRegistrationDate(
                                      registration.registeredAt
                                    )}
                                  </div>
                                  <Badge
                                    className={`
                                      text-[10px] font-medium px-2 py-0.5 min-w-[70px] justify-center tracking-wide uppercase
                                      ${
                                        registration.status === "CONFIRMED"
                                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                          : registration.status === "CANCELLED"
                                          ? "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
                                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                                      }
                                    `}
                                    variant="outline"
                                  >
                                    {registration.status === "CONFIRMED"
                                      ? "Confirmé"
                                      : registration.status === "CANCELLED"
                                      ? "Annulé"
                                      : "En attente"}
                                  </Badge>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <div className="px-6 py-4 text-sm text-muted-foreground italic bg-muted/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></span>
                    En attente des premières inscriptions...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
