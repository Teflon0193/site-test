import MainLayout from "@/app/components/layouts/MainLayout";
import AgendaContainer from "@/app/components/agenda/agendaContainer";
import Image from "next/image";

export default function AgendaPage() {
  return (
    <MainLayout transparentHeader={false}>
      <section className="relative h-[40vh] min-h-[350px] md:h-[50vh] overflow-hidden border-b-2 border-black bg-white group/hero">
        {/* Slanted Image Suite Background */}
        <div className="absolute inset-0 flex w-[120%] -ml-[10%] z-10">
          <div
            className="relative flex-1 h-full overflow-hidden border-r-2 border-black transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event1.jpg"
              alt="CCAPAC Event 1"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 scale-110 group-hover/hero:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-x-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event2.jpg"
              alt="CCAPAC Event 2"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-75 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-l-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event3.jpg"
              alt="CCAPAC Event 3"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-150 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
        </div>

        {/* Text Overlay & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:to-white/5 z-20" />

        <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col justify-end pb-12 md:pb-16 relative z-30 pointer-events-none">
          <div className="max-w-3xl bg-white/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent p-8 lg:p-0 border-2 lg:border-0 border-black animate-slide-up">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              AGENDA & ÉVÉNEMENTS
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-black uppercase leading-[0.8] mb-6 drop-shadow-sm">
              AGENDA
            </h1>
            <div className="w-24 h-3 bg-primary"></div>

          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-28 right-12 w-32 h-32 border-t-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
      </section>

      {/* Agenda avec filtres intégrés */}
      <AgendaContainer />
    </MainLayout>
  );
}
