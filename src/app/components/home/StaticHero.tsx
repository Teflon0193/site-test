"use client";

import Image from "next/image";
import Link from "next/link";

interface StaticHeroProps {
  isLoading?: boolean;
}

export default function StaticHero({ isLoading = false }: StaticHeroProps) {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] sm:h-[80vh] sm:min-h-[600px] lg:h-screen lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-muted/20 via-muted/10 to-muted/5">
      {/* Background*/}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/media/media1.jpg"
            alt="Centre Culturel Africain du Pacifique"
            fill
            className="object-cover object-center sm:object-[60%_center]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:from-black/80 sm:via-black/50 sm:to-black/20 lg:from-black/70 lg:via-black/40 lg:to-black/20" />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative h-full flex items-center justify-start z-30 pt-20 sm:pt-24 lg:pt-24 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
              Bienvenue au CCAPAC
            </h1>

            <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-6 leading-relaxed text-accent italic drop-shadow-md">
              Où la culture africaine prend vie
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 text-gray-200">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  Découvrez nos événements
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">Grand Tambour</span>
              </div>
            </div> */}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/agenda"
                className="bg-gradient-to-r from-accent to-accent/90 cursor-pointer text-black px-6 py-3 sm:px-8 sm:py-3 font-bold hover:from-accent/90 hover:to-accent transition-all duration-300 text-sm sm:text-base text-center rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
              >
                Voir l&apos;agenda
              </Link>
            </div>

            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="mt-6 sm:mt-8">
                <div className="flex items-center gap-3 text-gray-300 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="w-5 h-5 border-2 border-accent border-r-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base font-medium">
                    Chargement des événements...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
