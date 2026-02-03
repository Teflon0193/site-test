"use client";

import Image from "next/image";
import Link from "next/link";

interface StaticHeroProps {
  isLoading?: boolean;
}

export default function StaticHero({ isLoading = false }: StaticHeroProps) {
  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] lg:h-screen min-h-[600px] overflow-hidden bg-background">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full animate-in fade-in duration-1000">
          <Image
            src="/images/media/media1.jpg"
            alt="Centre Culturel Africain du Pacifique"
            fill
            className="object-cover object-center sm:object-[center_20%]"
            priority
            sizes="100vw"
            quality={90}
          />
          {/* Enhanced Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative h-full z-10 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 sm:mt-0">
          <div
            className="max-w-4xl animate-slide-up opacity-0"
            style={{ animationDelay: "0.3s" }}
          >

            {/* Massive Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] leading-[0.9] font-black tracking-tighter text-white mb-4 sm:mb-8 drop-shadow-2xl">
              Bienvenue <br />
              <span className="text-white bg-clip-text">
                au centre culturel et artistique pour les pays d&apos;afrique centrale          </span>
            </h1>

            {/* Styled Subtitle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="w-12 sm:w-20 h-1 bg-accent rounded-full" />
              <p className="text-lg sm:text-xl lg:text-2xl font-light italic text-white/90 max-w-xl leading-relaxed">
                Où la culture l&apos;art et  africaine prend vie
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agenda"
                className="group relative px-8 py-4 bg-accent text-black font-bold text-sm sm:text-base tracking-widest uppercase overflow-hidden transition-all hover:bg-white"
              >
                <span className="relative z-10">Voir l&apos;agenda</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="absolute bottom-8 right-4 sm:right-8 flex items-center gap-3 text-white/60 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                <div className="w-4 h-4 border-2 border-accent border-r-transparent rounded-full animate-spin" />
                <span className="text-xs tracking-wider uppercase">
                  Chargement
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
