import MainLayout from "@/app/components/layouts/MainLayout";
import Image from "next/image";
import { departments } from "@/data/departments";
import { missions } from "@/data/missions";
import DepartmentAccordion from "@/app/components/grand-tambour/DepartmentAccordion";

export default function EquipeGouvernancePage() {
  return (
    <MainLayout>
      <main className="pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/motif-luba.png"
              alt="Équipe & Gouvernance"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            {/* Gradient for text readability, but sharper */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20">
            <span className="inline-block mb-6 px-4 py-1.5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase transform -skew-x-6 border border-white hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm">
              Notre Organisation
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
              Équipe & Gouvernance
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-accent"></div>
              <div className="h-[2px] w-12 bg-accent"></div>
            </div>
            <p className="text-xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
              Découvrez les visages et les structures qui portent la vision du
              CCAPAC au quotidien.
            </p>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-24 bg-white border-b border-black/5">
          <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-20">
              <span className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase text-accent mb-4 block">
                Structure Opérationnelle
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black leading-none">
                Notre <br /> Organisation
              </h2>
            </div>
            <div className="border-t-2 border-black">
              <DepartmentAccordion departments={departments} />
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 lg:py-32 bg-zinc-50 text-black">
          <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-start">
                <div>
                  <span className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase text-accent mb-4 block">
                    Notre Engagement
                  </span>
                  <h2 className="text-4xl md:text-6xl text-black font-black uppercase tracking-tighter leading-none">
                    Au Service de <br />
                    <span className="text-black">la Culture</span>
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-xl sm:text-2xl text-black font-medium leading-tight tracking-tight border-l-4 border-accent pl-8 py-2">
                    L&apos;équipe du CCAPAC s&apos;engage au quotidien à
                    promouvoir la culture, soutenir la création artistique et
                    offrir une expérience inclusive.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-2 sm:border-l-2 border-black overflow-hidden sm:overflow-visible border-l-2">
                {missions.map((mission) => (
                  <div
                    key={mission.title}
                    className="group p-8 sm:p-10 border-r-2 border-b-2 border-black hover:bg-primary hover:text-white transition-all duration-500 flex flex-col"
                  >
                    <div className="mt-auto">
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-white transition-colors leading-none">
                        {mission.title}
                      </h3>
                      <p className="text-zinc-500 font-medium leading-snug group-hover:text-white transition-colors text-sm">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
