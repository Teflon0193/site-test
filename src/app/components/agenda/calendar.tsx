"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatEventDateTime, formatTimePeriod } from "@/lib/dateUtils";
import {
  FaCalendar,
  FaClock,
  FaMapPin,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import Image from "next/image";
import type { Event } from "@/types/events";

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const router = useRouter();
  const [visibleEvents, setVisibleEvents] = useState(6);

  // Trie les événements du plus récent au plus ancien
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  const displayedEvents = sortedEvents.slice(0, visibleEvents);
  const hasMoreEvents = visibleEvents < sortedEvents.length;

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        {sortedEvents.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 max-w-lg mx-auto border border-muted/20 shadow-lg">
              <FaMagnifyingGlass className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-muted-foreground mx-auto mb-4 sm:mb-5 md:mb-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Aucun événement trouvé
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed px-2">
                Essayez de modifier vos critères de recherche pour découvrir nos
                événements
              </p>
            </div>
          </div>
        )}

        {sortedEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {displayedEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg border-muted/30 rounded-xl hover:border-primary/40 overflow-hidden bg-white"
                onClick={() => router.push(`/evenement/${event.slug}`)}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
                  <div className="absolute inset-0 bg-[url('/motif-lub.png')] bg-center bg-cover opacity-[0.04]" />
                  <div className="absolute inset-3 sm:inset-4">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-contain object-center"
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex flex-col gap-1.5 sm:gap-2">
                    <Badge className="bg-primary text-primary-foreground shadow-sm text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
                      <span className="truncate max-w-[80px] sm:max-w-none">
                        {event.discipline}
                      </span>
                    </Badge>
                    <Badge className="bg-white/90 text-foreground shadow-sm text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
                      <span className="truncate max-w-[80px] sm:max-w-none">
                        {event.public}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                  <CardHeader className="p-0 mb-3 sm:mb-4 md:mb-5">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="space-y-2.5 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <FaCalendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary" />
                        </div>
                        <span className="line-clamp-1 font-medium truncate">
                          {formatEventDateTime(event.startDate, event.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <FaClock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary" />
                        </div>
                        <span className="font-medium truncate">
                          {formatTimePeriod(event.startTime, event.endTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <FaMapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary" />
                        </div>
                        <span className="line-clamp-1 font-medium truncate">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {sortedEvents.length > 0 && hasMoreEvents && (
          <div className="text-center mt-12 sm:mt-14 md:mt-16 lg:mt-20">
            <button
              onClick={loadMoreEvents}
              className="justify-center cursor-pointer space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 font-bold text-xs sm:text-sm md:text-base hover:from-accent/90 hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl hover:scale-105"
            >
              Charger plus d&apos;événements
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
