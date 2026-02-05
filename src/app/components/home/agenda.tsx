"use client";

import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { getUpcomingEvents } from "@/services/eventService";
import { Event } from "@/types/events";
import { formatEventPeriod, formatTimePeriod } from "@/lib/dateUtils";

export default function QuickAgenda() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des prochains événements (limité à 3 pour l'accueil)
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEvents(3);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des prochains événements:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEvents();
  }, []);

  if (loading) return null; // Ou squelette si nécessaire, mais minimaliste pour l'instant

  return (
    <section className="py-10 lg:py-24 bg-white text-black relative border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Header Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-accent"></span>
                <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold">
                  Calendrier
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.85] tracking-tighter text-black mb-8">
                Agenda
              </h2>
              <p className="text-lg text-black/60 font-light max-w-sm mb-12">
                Ne manquez rien de nos expositions, concerts et rencontres
                culturelles.
              </p>
            </div>

            <Link
              href="/agenda"
              className="hidden lg:inline-flex items-center gap-3 group text-black hover:text-accent transition-colors duration-300"
            >
              <span className="uppercase tracking-[0.2em] text-sm font-bold">
                Tout voir
              </span>
              <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Events List Column */}
          <div className="lg:col-span-8">
            {events.length === 0 ? (
              <div className="border-t border-white/20 py-12 text-center text-black/50 italic font-serif text-xl">
                Aucun événement à venir pour le moment.
              </div>
            ) : (
              <div className="flex flex-col">
                {events.map((event) => {
                  const date = formatEventPeriod(
                    event.startDate,
                    event.endDate,
                  );
                  return (
                    <Link
                      key={event.id}
                      href={`/evenement/${event.slug}`}
                      className="group border-t border-white/10 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-primary hover:text-white transition-all duration-500 px-4 md:px-8 -mx-4 md:-mx-8 rounded-none relative overflow-hidden"
                    >
                      {/* Date */}
                      <div className="flex flex-row md:flex-col items-baseline md:items-start gap-2 md:gap-0 min-w-[100px]">
                        <span className="text-2xl md:text-4xl font-black leading-none group-hover:text-white transition-colors">
                          {date.dayMonth.day}
                        </span>
                        <span className="text-sm uppercase tracking-widest font-bold opacity-60">
                          {date.dayMonth.month}
                        </span>
                      </div>

                      {/* Sub-info / Category */}
                      <div className="w-32 hidden md:block pt-2">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] border border-current px-2 py-1 opacity-70 group-hover:opacity-50">
                          {event.category || "Événement"}
                        </span>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 pt-1">
                        <div className="md:hidden mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em] border border-white/40 px-2 py-1 opacity-70">
                            {event.category || "Événement"}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase leading-tight mb-2 group-hover:translate-x-2 transition-transform duration-300 text-black group-hover:text-white">
                          {event.title}
                        </h3>
                        <p className="text-black/60 group-hover:text-white/70 text-sm md:text-base font-serif italic">
                          {event.location} •{" "}
                          {formatTimePeriod(event.startTime, event.endTime)}
                        </p>
                      </div>

                      {/* Arrow Action */}
                      <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                          <FaArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mt-8 lg:hidden">
              <Link
                href="/agenda"
                className="inline-flex items-center gap-3 group text-black hover:text-accent transition-colors duration-300"
              >
                <span className="uppercase tracking-[0.2em] text-sm font-bold">
                  Voir tout l&apos;agenda
                </span>
                <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
