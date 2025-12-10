import MainLayout from "@/app/components/layouts/MainLayout";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { departments } from "@/data/departments";
import { missions } from "@/data/missions";
import DepartmentAccordion from "@/app/components/grand-tambour/DepartmentAccordion";
import MissionCard from "@/app/components/grand-tambour/MissionCard";

export default function EquipeGouvernancePage() {
  return (
    <MainLayout>
      <main className="pt-5">
        {/* Hero Section */}
        <section className="relative lg:h-[50vh] h-[40vh] lg:mt-12 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
          <Image
            src="/motif-luba.png"
            alt="Equipe CCAPAC"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <Link
              href="/grand-tambour/presentation"
              className="inline-flex items-center gap-2 text-white/90 hover:text-accent mb-6 sm:mb-8 transition-all duration-300 text-sm sm:text-base bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour à la présentation
            </Link>
            <h1 className="uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight text-balance drop-shadow-lg">
              L&apos;Équipe du CCAPAC
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto text-pretty leading-relaxed drop-shadow-md">
              Découvrez l&apos;équipe passionnée qui donne vie au Centre
              Culturel et Artistique pour l&apos;Afrique Centrale
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DepartmentAccordion departments={departments} />
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-muted/10 via-muted/5 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="uppercase text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Notre Engagement
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12 max-w-4xl mx-auto text-pretty">
                L&apos;équipe du CCAPAC s&apos;engage quotidiennement à
                promouvoir la culture africaine et congolaise, à soutenir la
                création artistique locale et à offrir au public des expériences
                culturelles enrichissantes et accessibles à tous.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
                {missions.map((mission) => (
                  <MissionCard
                    key={mission.title}
                    title={mission.title}
                    description={mission.description}
                    imageSrc={mission.imageSrc}
                    imageAlt={mission.imageAlt}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
