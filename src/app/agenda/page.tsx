import Header from "@/app/components/home/header";
import Footer from "@/app/components/home/footer";
import AgendaContainer from "@/app/components/agenda/agendaContainer";
import Image from "next/image";

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Page Header */}
      <section className="relative lg:h-[45vh] h-[35vh] lg:mt-10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
        <Image
          src="/motif-luba.png"
          alt="Agenda CCAPAC"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <h1 className="uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance drop-shadow-lg">
            Agenda
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl max-w-4xl mx-auto text-balance text-white/90 leading-relaxed drop-shadow-md">
            Découvrez nos événements culturels et artistiques. Filtrez par mois,
            discipline ou public pour trouver les activités qui vous
            intéressent.
          </p>
        </div>
      </section>

      {/* Agenda avec filtres intégrés */}
      <AgendaContainer />

      <Footer />
    </div>
  );
}
