import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { FaArrowLeft, FaCalendar, FaClock, FaMapPin } from "react-icons/fa6";
import MainLayout from "@/app/components/layouts/MainLayout";
import { getEventBySlug } from "@/services/eventService";
import { Event } from "@/types/events";
import {
  formatEventDateTime,
  formatTimePeriod,
  formatEventDateShort,
  isEventOngoing,
} from "@/lib/dateUtils";
import RegisterButton from "@/app/components/events/RegisterButton";
import EventRegistrationStatus from "@/app/components/events/EventRegistrationStatus";
import { getUser } from "@/lib/auth-server";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const events = await getEventBySlug(slug);
  const event: Event | null = events[0] ?? null;
  const user = await getUser();

  if (!event) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] mt-16 sm:mt-20 md:mt-24 px-4">
          <div className="text-center w-full">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Événement non trouvé
              </h1>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                L&apos;événement que vous recherchez n&apos;existe pas ou a été
                supprimé.
              </p>
              <Link href="/agenda" className="inline-block">
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5">
                  <FaArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Retour à l&apos;agenda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <EventRegistrationStatus />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
        <section className="relative h-[40vh] min-h-[300px] sm:h-[45vh] sm:min-h-[400px] md:h-[50vh] md:min-h-[500px] lg:h-[55vh] lg:min-h-[600px] xl:min-h-[700px] mt-16 sm:mt-20 md:mt-24 overflow-hidden">
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
          <div className="absolute top-3 sm:top-4 md:top-6 lg:top-28 left-3 sm:left-4 md:left-6 lg:left-8 z-20">
            <Link href="/agenda" className="inline-block">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-accent/95 to-accent/90 rounded-lg border-white/30 cursor-pointer hover:from-accent hover:to-accent/90 text-foreground shadow-lg transition-all duration-300 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2"
              >
                <FaArrowLeft className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-black" />
                <span className="hidden sm:inline text-black font-semibold text-xs sm:text-sm">
                  Retour à l&apos;agenda
                </span>
                <span className="sm:hidden text-black font-semibold text-xs">
                  Retour
                </span>
              </Button>
            </Link>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-16 text-white z-10 mb-12 sm:mb-16 md:mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6">
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg">
                  {event.discipline}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/60 text-white bg-white/20 backdrop-blur-md px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg"
                >
                  {event.public}
                </Badge>
                {event.category && (
                  <Badge
                    variant="outline"
                    className="border-white/60 text-white bg-white/20 backdrop-blur-md px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg"
                  >
                    {event.category}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight text-balance drop-shadow-lg">
                {event.title}
              </h1>

              {event.slogan && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-3 sm:mb-4 md:mb-6 lg:mb-8 italic text-pretty font-light max-w-4xl drop-shadow-md line-clamp-2 sm:line-clamp-3">
                  &ldquo;{event.slogan}&rdquo;
                </p>
              )}

              {/* Quick Info Mobile */}
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base text-gray-300 sm:hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FaCalendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">
                    {formatEventDateShort(event.startDate, event.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FaClock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">
                    {formatTimePeriod(event.startTime, event.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FaMapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <article className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Event Meta Information */}
            <div className="hidden sm:block mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <div className="bg-gradient-to-br from-white to-muted/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 transition-all duration-500 hover:shadow-xl border border-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 text-center md:text-left p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="p-2.5 sm:p-3 lg:p-4 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <FaCalendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm uppercase lg:text-base text-muted-foreground mb-1.5 sm:mb-2 font-semibold">
                        {event.endDate ? "Période" : "Date"}
                      </div>
                      <div className="font-bold text-xs sm:text-sm lg:text-base text-foreground leading-tight break-words">
                        {formatEventDateTime(event.startDate, event.endDate)}
                      </div>
                      {isEventOngoing(event.startDate, event.endDate) && (
                        <Badge
                          variant="secondary"
                          className="mt-1.5 sm:mt-2 bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/30 text-[10px] sm:text-xs lg:text-sm rounded-full"
                        >
                          En cours
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 text-center md:text-left p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="p-2.5 sm:p-3 lg:p-4 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <FaClock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm uppercase lg:text-base text-muted-foreground mb-1.5 sm:mb-2 font-semibold">
                        {event.endTime ? "Horaires" : "Heure"}
                      </div>
                      <div className="font-bold text-xs sm:text-sm lg:text-base text-foreground break-words">
                        {formatTimePeriod(event.startTime, event.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 text-center md:text-left p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="p-2.5 sm:p-3 lg:p-4 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <FaMapPin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm uppercase lg:text-base text-muted-foreground mb-1.5 sm:mb-2 font-semibold">
                        Lieu
                      </div>
                      <div className="font-bold text-xs sm:text-sm lg:text-base text-foreground break-words">
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Event Description */}
              <section className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <div className="bg-gradient-to-br from-white to-muted/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-lg border border-muted/20">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 lg:h-10 bg-gradient-to-b from-primary to-primary/80 rounded-full flex-shrink-0"></div>
                    <span>Description</span>
                  </h2>
                  <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-foreground/90">
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

        {/* Floating Action Button - Affiché uniquement si l'inscription est ouverte */}
        {event.isRegistrationOpen && (
          <RegisterButton
            eventId={event.id.toString()}
            eventTitle={event.title}
            eventSlug={event.slug}
            isRegistrationOpen={event.isRegistrationOpen}
            user={
              user ? { id: user.id, emailVerified: user.emailVerified } : null
            }
          />
        )}
      </div>
    </MainLayout>
  );
}
