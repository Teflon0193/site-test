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
import type { useEventFilters } from "../../../hooks/useEventFilters";

interface CalendarProps {
  filters: ReturnType<typeof useEventFilters>;
}

export default function Calendar({ filters }: CalendarProps) {
  const router = useRouter();
  const [visibleEvents, setVisibleEvents] = useState(6);

  const { filteredEvents } = filters;

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  const displayedEvents = filteredEvents.slice(0, visibleEvents);
  const hasMoreEvents = visibleEvents < filteredEvents.length;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 sm:p-16 max-w-lg mx-auto border border-muted/20 shadow-lg">
              <FaMagnifyingGlass className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Aucun événement trouvé
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Essayez de modifier vos critères de recherche pour découvrir nos
                événements
              </p>
            </div>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {displayedEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-muted/20 rounded-2xl hover:border-primary/50 overflow-hidden bg-gradient-to-br from-white to-muted/10"
                onClick={() => router.push(`/evenement/${event.slug}`)}
              >
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                      {event.discipline}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-muted/80 to-muted/60 text-foreground shadow-lg">
                      {event.public}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <CardHeader className="p-0 mb-5">
                    <CardTitle className="text-lg sm:text-xl font-bold uppercase text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                          <FaCalendar className="h-4 w-4 text-primary" />
                        </div>
                        <span className="line-clamp-1 font-medium">
                          {formatEventDateTime(event.startDate, event.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                          <FaClock className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">
                          {formatTimePeriod(event.startTime, event.endTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                          <FaMapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="line-clamp-1 font-medium">
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

        {filteredEvents.length > 0 && hasMoreEvents && (
          <div className="text-center mt-16 sm:mt-20">
            <button
              onClick={loadMoreEvents}
              className="justify-center cursor-pointer space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base hover:from-accent/90 hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl hover:scale-105"
            >
              Charger plus d&apos;événements
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
