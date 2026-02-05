"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight, FaCalendar } from "react-icons/fa";
import Link from "next/link";
import { getUpcomingEvents } from "@/services/eventService";
import { Event } from "@/types/events";
import { formatEventPeriod, formatTimePeriod } from "@/lib/dateUtils";

export default function QuickAgenda() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des prochains événements (limité à 5)
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEvents(5);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des prochains événements:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-background via-muted/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-secondary/10 to-secondary/20 px-6 py-3 mb-6 rounded-xl border border-secondary/20">
              <FaCalendar className="w-5 h-5 text-secondary mr-2" />
              <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
                Agenda Culturel
              </span>
            </div>
            <h2 className="text-2xl uppercase lg:text-4xl font-bold text-foreground mb-6 leading-tight drop-shadow-sm">
              Prochains Événements
            </h2>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Chargement des événements...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-background via-muted/5 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-secondary/10 to-secondary/20 px-6 py-3 mb-6 rounded-xl border border-secondary/20">
              <FaCalendar className="w-5 h-5 text-secondary mr-2" />
              <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
                Agenda Culturel
              </span>
            </div>
            <h2 className="text-2xl uppercase md:text-4xl font-bold text-foreground mb-6 leading-tight drop-shadow-sm">
              Prochains Événements
            </h2>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
              <p className="text-lg text-muted-foreground mb-8">
                Aucun événement programmé pour le moment.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Revenez bientôt pour découvrir notre programmation !
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary/10 to-secondary/20 px-6 py-3 mb-6 rounded-xl border border-secondary/20">
            <FaCalendar className="w-5 h-5 text-secondary mr-2" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
              Agenda Culturel
            </span>
          </div>
          <h2 className="text-2xl uppercase md:text-4xl font-bold text-foreground mb-6 leading-tight drop-shadow-sm">
            Prochains Événements
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Featured Event - Left Side */}
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
            <Link
              href={`/evenement/${events[0].slug}`}
              className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer h-80 w-80 sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem] hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 flex flex-col">
                {/* Top section with details - 60% sur mobile, 50% sur desktop */}
                <div className="h-3/5 sm:h-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center text-white">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-none mt-6 lg:mb-3 drop-shadow-lg">
                    {
                      formatEventPeriod(events[0].startDate, events[0].endDate)
                        .dayMonth.day
                    }
                  </div>
                  <div className="text-sm lg:text-base uppercase tracking-wide mb-4 lg:mb-6 drop-shadow-md">
                    {
                      formatEventPeriod(events[0].startDate, events[0].endDate)
                        .dayMonth.month
                    }
                  </div>
                  <div className="text-xs lg:text-sm uppercase tracking-wide opacity-90 mb-2 lg:mb-3">
                    {events[0].category || events[0].discipline}
                  </div>
                  <h3 className="text-lg uppercase lg:text-xl font-bold mb-3 lg:mb-4 drop-shadow-md">
                    {events[0].title}
                  </h3>
                  <div className="text-xs lg:text-sm opacity-90">
                    {events[0].location} -{" "}
                    {formatTimePeriod(events[0].startTime, events[0].endTime)}
                  </div>
                </div>

                {/* Bottom section with image - 40% sur mobile, 50% sur desktop */}
                <div className="h-2/5 sm:h-1/2 relative p-3 lg:p-4">
                  <div className="relative h-full overflow-hidden rounded-lg">
                    <Image
                      src={events[0].image || "/placeholder.svg"}
                      alt={events[0].title}
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Events Grid - Right Side */}
          {events.length > 1 && (
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 lg:h-[28rem]">
                {/* Top Left */}
                {events[1] && (
                  <Link
                    href={`/evenement/${events[1].slug}`}
                    className="sm:col-span-2 rounded-xl lg:col-span-4 bg-gradient-to-br from-white to-muted/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-48 sm:h-52 lg:h-52 border border-muted/20"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-1/2 p-4 sm:p-6">
                        <div className="text-2xl sm:text-3xl font-bold text-black leading-none mb-2">
                          {
                            formatEventPeriod(
                              events[1].startDate,
                              events[1].endDate
                            ).dayMonth.day
                          }
                        </div>
                        <div className="text-xs sm:text-sm uppercase tracking-wide text-black mb-2 sm:mb-3">
                          {
                            formatEventPeriod(
                              events[1].startDate,
                              events[1].endDate
                            ).dayMonth.month
                          }
                        </div>
                        <h3 className="text-sm uppercase sm:text-base font-bold text-black mb-2 sm:mb-3">
                          {events[1].title}
                        </h3>
                        <div className="text-xs sm:text-sm text-black">
                          {events[1].location} - {events[1].time}
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 relative p-3 sm:p-4">
                        <div className="relative h-full overflow-hidden rounded-lg">
                          <Image
                            src={events[1].image || "/placeholder.svg"}
                            alt={events[1].title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Top Right - Small square card */}
                {events[4] && (
                  <Link
                    href={`/evenement/${events[4].slug}`}
                    className="sm:col-span-1 lg:col-span-2 rounded-xl bg-gradient-to-br from-white to-muted/10 shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-48 sm:h-52 lg:h-52 border border-muted/20"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-black leading-none mb-2">
                      {
                        formatEventPeriod(
                          events[4].startDate,
                          events[4].endDate
                        ).dayMonth.day
                      }
                    </div>
                    <div className="text-xs sm:text-sm uppercase tracking-wide text-black/70 mb-2 sm:mb-3">
                      {
                        formatEventPeriod(
                          events[4].startDate,
                          events[4].endDate
                        ).dayMonth.month
                      }
                    </div>
                    <h3 className="text-sm uppercase sm:text-base font-bold text-black mb-2 sm:mb-3">
                      {events[4].title}
                    </h3>
                    <div className="text-xs sm:text-sm text-black/70">
                      {events[4].location} - {events[4].time}
                    </div>
                  </Link>
                )}

                {/* Bottom Left - Small square card */}
                {events[2] && (
                  <Link
                    href={`/evenement/${events[2].slug}`}
                    className="sm:col-span-1 lg:col-span-2 rounded-xl bg-gradient-to-br from-white to-muted/10 shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-48 sm:h-52 lg:h-52 border border-muted/20"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-black leading-none mb-2">
                      {
                        formatEventPeriod(
                          events[2].startDate,
                          events[2].endDate
                        ).dayMonth.day
                      }
                    </div>
                    <div className="text-xs sm:text-sm uppercase tracking-wide text-black/70 mb-2 sm:mb-3">
                      {
                        formatEventPeriod(
                          events[2].startDate,
                          events[2].endDate
                        ).dayMonth.month
                      }
                    </div>
                    <h3 className="text-sm uppercase sm:text-base font-bold text-black mb-2 sm:mb-3">
                      {events[2].title}
                    </h3>
                    <div className="text-xs sm:text-sm text-black/70">
                      {events[2].location} - {events[2].time}
                    </div>
                  </Link>
                )}

                {/* Bottom Right - Long rectangular card with image */}
                {events[3] && (
                  <Link
                    href={`/evenement/${events[3].slug}`}
                    className="sm:col-span-2 lg:col-span-4 rounded-xl bg-gradient-to-br from-white to-muted/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-48 sm:h-52 lg:h-52 border border-muted/20"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-1/2 p-4 sm:p-6">
                        <div className="text-2xl sm:text-3xl font-bold text-black leading-none mb-2">
                          {
                            formatEventPeriod(
                              events[3].startDate,
                              events[3].endDate
                            ).dayMonth.day
                          }
                        </div>
                        <div className="text-xs sm:text-sm uppercase tracking-wide text-black/70 mb-2 sm:mb-3">
                          {
                            formatEventPeriod(
                              events[3].startDate,
                              events[3].endDate
                            ).dayMonth.month
                          }
                        </div>
                        <h3 className="text-sm uppercase sm:text-base font-bold text-black mb-2 sm:mb-3">
                          {events[3].title}
                        </h3>
                        <div className="text-xs sm:text-sm text-black/70">
                          {events[3].location} - {events[3].time}
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 relative p-3 sm:p-4">
                        <div className="relative h-full overflow-hidden rounded-lg">
                          <Image
                            src={events[3].image || "/placeholder.svg"}
                            alt={events[3].title}
                            fill
                            className="object-cover transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link href="/agenda">
            <button className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent rounded-xl text-sm sm:text-base cursor-pointer text-black px-8 py-4 font-bold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
              Voir l&apos;agenda complet
              <FaArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
