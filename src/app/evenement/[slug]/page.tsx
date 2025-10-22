"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
// import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { FaArrowLeft, FaCalendar, FaClock, FaMapPin } from "react-icons/fa6";
import Header from "@/app/components/home/header";
import Footer from "@/app/components/home/footer";
import { getEventBySlug } from "@/services/eventService";
import { Event } from "@/types/events";
import {
  formatEventDateTime,
  formatTimePeriod,
  formatEventDateShort,
  isEventOngoing,
} from "@/lib/dateUtils";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const slug = params.slug as string;
        const eventData = await getEventBySlug(slug);
        setEvent(eventData[0]);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] mt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] mt-28">
          <div className="text-center">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Événement non trouvé
              </h1>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
                L&apos;événement que vous recherchez n&apos;existe pas ou a été
                supprimé.
              </p>
              <Button
                onClick={() => router.push("/agenda")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Retour à l&apos;agenda
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Header />

      <section className="relative h-[55vh] min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] mt-20 sm:mt-24 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center sm:object-[60%_center]"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 sm:from-black/80 sm:via-black/40 sm:to-black/20" />

        {/* Back Button */}
        <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-20 mt-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/agenda")}
            className="bg-gradient-to-r from-accent/95 to-accent/90 rounded-xl border-white/30 cursor-pointer hover:from-accent hover:to-accent/90 text-foreground shadow-lg transition-all duration-30 backdrop-blur-sm"
          >
            <FaArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-black" />
            <span className="hidden sm:inline text-black font-semibold">
              Retour à l&apos;agenda
            </span>
            <span className="sm:hidden text-black font-semibold">Retour</span>
          </Button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-16 text-white z-10 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-sm font-semibold rounded-xl shadow-lg">
                {event.discipline}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/60 text-white bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold rounded-xl shadow-lg"
              >
                {event.public}
              </Badge>
              {event.category && (
                <Badge
                  variant="outline"
                  className="border-white/60 text-white bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold rounded-xl shadow-lg"
                >
                  {event.category}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-balance drop-shadow-lg">
              {event.title}
            </h1>

            {event.slogan && (
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 sm:mb-8 italic text-pretty font-light max-w-4xl drop-shadow-md">
                &ldquo;{event.slogan}&rdquo;
              </p>
            )}

            {/* Quick Info Mobile */}
            <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-300 sm:hidden">
              <div className="flex items-center gap-2">
                <FaCalendar className="h-4 w-4" />
                <span>
                  {formatEventDateShort(event.startDate, event.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="h-4 w-4" />
                <span>{formatTimePeriod(event.startTime, event.endTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Event Meta Information */}
          <div className="hidden sm:block mb-12 lg:mb-16">
            <div className="bg-gradient-to-br from-white to-muted/10 rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-xl border border-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div className="flex items-start gap-4 lg:gap-5 text-center md:text-left p-4 rounded-xl">
                  <div className="p-3 lg:p-4 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaCalendar className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm uppercase lg:text-base text-muted-foreground mb-2 font-semibold">
                      {event.endDate ? "Période" : "Date"}
                    </div>
                    <div className="font-bold text-sm lg:text-base text-foreground leading-tight">
                      {formatEventDateTime(event.startDate, event.endDate)}
                    </div>
                    {isEventOngoing(event.startDate, event.endDate) && (
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/30 text-xs lg:text-sm rounded-full"
                      >
                        En cours
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 lg:gap-5 text-center md:text-left p-4 rounded-xl">
                  <div className="p-3 lg:p-4 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaClock className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm uppercase lg:text-base text-muted-foreground mb-2 font-semibold">
                      {event.endTime ? "Horaires" : "Heure"}
                    </div>
                    <div className="font-bold text-sm lg:text-base text-foreground">
                      {formatTimePeriod(event.startTime, event.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 lg:gap-5 text-center md:text-left p-4 rounded-xl">
                  <div className="p-3 lg:p-4 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                    <FaMapPin className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm uppercase lg:text-base text-muted-foreground mb-2 font-semibold">
                      Lieu
                    </div>
                    <div className="font-bold text-sm lg:text-base text-foreground">
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Event Description */}
            <section className="mb-12 lg:mb-16">
              <div className="bg-gradient-to-br from-white to-muted/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-muted/20">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-6 lg:mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 lg:h-10 bg-gradient-to-b from-primary to-primary/80 rounded-full"></div>
                  Description
                </h2>
                <div className="prose prose-lg lg:prose-xl max-w-none">
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground/90">
                    {event.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Sections Grid */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
              {event.objective && (
                <section className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8 lg:p-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-4 lg:mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 lg:h-10 bg-primary rounded-full"></div>
                    Objectif
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                    {event.objective}
                  </p>
                </section>
              )}

              {event.targetAudience && (
                <section className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 sm:p-8 lg:p-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-4 lg:mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 lg:h-10 bg-secondary rounded-full"></div>
                    Public Visé
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                    {event.targetAudience}
                  </p>
                </section>
              )}

              {event.impact && (
                <section className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 sm:p-8 lg:p-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mb-4 lg:mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 lg:h-10 bg-accent rounded-full"></div>
                    Impact Attendu
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                    {event.impact}
                  </p>
                </section>
              )}

              {event.requirements && (
                <section className="bg-gradient-to-br from-muted/20 to-muted/30 p-6 sm:p-8 lg:p-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 lg:h-10 bg-foreground rounded-full"></div>
                    Prérequis & Matériel
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                    {event.requirements}
                  </p>
                </section>
              )}
            </div> */}

            {/* Practical Information */}
            {/* {(event.capacity ||
              event.organizer ||
              event.contact ||
              event.accessibility) && (
              <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6 sm:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-6 lg:mb-8 text-center">
                  Informations Pratiques
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {event.capacity && (
                    <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 text-center border border-white/20">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                        {event.capacity}
                      </div>
                      <div className="text-sm lg:text-base text-muted-foreground font-medium">
                        Capacité
                      </div>
                    </div>
                  )}

                  {event.organizer && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20 sm:col-span-2 lg:col-span-1">
                      <div className="text-lg sm:text-xl font-bold text-foreground mb-2 leading-tight">
                        {event.organizer}
                      </div>
                      <div className="text-sm lg:text-base text-muted-foreground font-medium">
                        Organisateur
                      </div>
                    </div>
                  )}

                  {event.contact && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20 sm:col-span-2 lg:col-span-1">
                      <div className="text-lg sm:text-xl font-bold text-foreground mb-2 leading-tight break-words">
                        {event.contact}
                      </div>
                      <div className="text-sm lg:text-base text-muted-foreground font-medium">
                        Contact
                      </div>
                    </div>
                  )}

                  {event.accessibility && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20 sm:col-span-2 lg:col-span-1">
                      <div className="text-lg sm:text-xl font-bold text-foreground mb-2 leading-tight">
                        {event.accessibility}
                      </div>
                      <div className="text-sm lg:text-base text-muted-foreground font-medium">
                        Accessibilité
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )} */}
          </div>
        </div>
      </article>

      {/* Floating Action Button */}
      {/* <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          onClick={() => {
            // Action pour réserver ou contacter
            if (event.contact) {
              window.open(`mailto:${event.contact}`, "_blank");
            }
          }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </Button>
      </div> */}

      <Footer />
    </div>
  );
}
