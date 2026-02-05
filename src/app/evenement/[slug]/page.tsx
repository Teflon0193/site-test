import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FaArrowLeft} from "react-icons/fa6";
import MainLayout from "@/app/components/layouts/MainLayout";
import { getEventBySlug } from "@/services/eventService";
import { Event } from "@/types/events";
import {
  formatEventDateTime,
  formatTimePeriod,
  // isEventOngoing,
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
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover object-center opacity-60"
              priority
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20">
            <Link
              href="/agenda"
              className="inline-block mb-6 px-4 py-1.5 text-white/80 hover:text-white text-xs font-black tracking-[0.2em] uppercase transition-colors duration-300 hover:underline decoration-accent decoration-2 underline-offset-4"
            >
              <FaArrowLeft className="inline mr-2 w-3 h-3" />
              Retour à l&apos;agenda
            </Link>
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase transform -skew-x-6 border border-white hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm">
                {event.discipline}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl text-balance">
              {event.title}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-accent"></div>
              <div className="h-[2px] w-12 bg-accent"></div>
            </div>
          </div>
        </section>

        <article className="py-16 md:py-24 bg-primary text-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Event Meta Information */}
            <div className="mb-16 border-t border-white">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex items-start gap-6 p-8 border-r border-white/10">
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-white mb-2">
                      {event.endDate ? "Période" : "Date"}
                    </span>
                    <span className="text-lg font-black text-white uppercase tracking-tight">
                      {formatEventDateTime(event.startDate, event.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 border-r border-white/10">
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-white mb-2">
                      Horaires
                    </span>
                    <span className="text-lg font-black text-white uppercase tracking-tight">
                      {formatTimePeriod(event.startTime, event.endTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8">
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-white mb-2">
                      Lieu
                    </span>
                    <span className="text-lg text-white font-black uppercase tracking-tight">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Event Description */}
              <section className="mb-24">
                <div className="border-l-8 border-white pl-8 mb-12">
                  <h2 className="text-3xl sm:text-4xl text-white font-black uppercase tracking-tighter">
                    Description de <br />
                    <span className="text-white">
                      l&apos;événement
                    </span>
                  </h2>
                </div>

                <div className="bg-zinc-50 p-8 md:p-12 border border-black/5 shadow-[24px_24px_0px_0px_rgba(0,0,0,0.02)]">
                  <div className="prose prose-lg max-w-none text-zinc-700 leading-relaxed font-medium">
                    {event.description}
                  </div>
                </div>
              </section>
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
