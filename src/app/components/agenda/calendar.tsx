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
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  const displayedEvents = sortedEvents.slice(0, visibleEvents);
  const hasMoreEvents = visibleEvents < sortedEvents.length;

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {sortedEvents.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 md:p-12 lg:p-16 max-w-lg mx-auto shadow-none">
              <FaMagnifyingGlass className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-zinc-300 mx-auto mb-4 sm:mb-5 md:mb-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-black mb-2 sm:mb-3 md:mb-4 tracking-tight">
                Aucun événement trouvé
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm md:text-base leading-relaxed px-2 font-medium">
                Essayez de modifier vos critères de recherche pour découvrir nos
                événements
              </p>
            </div>
          </div>
        )}

        {sortedEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {displayedEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer border-zinc-200 rounded-none overflow-hidden bg-white hover:border-black transition-all duration-300 shadow-none hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => router.push(`/evenement/${event.slug}`)}
              >
                <div className="relative h-64 sm:h-72 overflow-hidden border-b border-zinc-100">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-2 items-start">
                      <Badge className="bg-black text-white hover:bg-black border-none rounded-none text-[10px] sm:text-xs px-3 py-1 uppercase font-bold tracking-wider shadow-none">
                        {event.discipline}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-zinc-300 text-zinc-500 rounded-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                    >
                      {event.public}
                    </Badge>
                  </div>

                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-xl sm:text-2xl md:text-2xl font-black uppercase text-black group-hover:text-black transition-colors leading-[0.9] tracking-tight line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm text-zinc-600">
                        <FaCalendar className="h-4 w-4 mt-0.5 text-black" />
                        <span className="font-bold uppercase tracking-wide">
                          {formatEventDateTime(event.startDate, event.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <FaClock className="h-4 w-4 text-black" />
                        <span className="font-medium">
                          {formatTimePeriod(event.startTime, event.endTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <FaMapPin className="h-4 w-4 text-black" />
                        <span className="font-medium line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between text-black font-bold text-xs uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                      <span>Voir les détails</span>
                      <div className="h-px w-8 bg-black group-hover:w-12 transition-all duration-300" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {sortedEvents.length > 0 && hasMoreEvents && (
          <div className="text-center mt-16 sm:mt-20">
            <button
              onClick={loadMoreEvents}
              className="justify-center cursor-pointer bg-black text-white px-8 sm:px-10 py-4 font-black text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none border-2 border-transparent hover:border-black"
            >
              Plus d&apos;événements
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
