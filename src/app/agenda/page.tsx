import MainLayout from "@/app/components/layouts/MainLayout";
import AgendaContainer from "@/app/components/agenda/agendaContainer";
import Image from "next/image";

export default function AgendaPage() {
  return (
    <MainLayout>

      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/motif-luba.png"
            alt="Programmes CCAPAC"
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          {/* Gradient for text readability, but sharper */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-28">
          <span className="inline-block mb-6 px-4 py-1.5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase transform -skew-x-6 border border-white hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm">
            Au programme
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
            Agenda
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-[2px] w-12 bg-accent"></div>
          </div>
          <p className="text-xl sm:text-xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Vivez la culture, planifiez vos moments.
          </p>
        </div>
      </section>

      {/* Agenda avec filtres intégrés */}
      <AgendaContainer />
    </MainLayout>
  );
}
