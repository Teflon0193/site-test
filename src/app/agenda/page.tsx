import MainLayout from "@/app/components/layouts/MainLayout";
import AgendaContainer from "@/app/components/agenda/agendaContainer";
import Image from "next/image";

export default function AgendaPage() {
  return (
    <MainLayout>
      {/* Page Header */}
      <section className="relative h-[30vh] min-h-[250px] sm:h-[35vh] sm:min-h-[300px] md:h-[40vh] md:min-h-[350px] lg:h-[45vh] lg:min-h-[400px] mt-16 sm:mt-20 md:mt-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
        <Image
          src="/motif-luba.png"
          alt="Agenda CCAPAC"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-balance drop-shadow-lg">
            Agenda
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-4xl mx-auto text-balance text-white/90 leading-relaxed drop-shadow-md px-2">
            Découvrez nos événements culturels et artistiques. Filtrez par mois,
            discipline ou public pour trouver les activités qui vous
            intéressent.
          </p>
        </div>
      </section>

      {/* Agenda avec filtres intégrés */}
      <AgendaContainer />
    </MainLayout>
  );
}
