"use client";

import { useState } from "react";
import Header from "@/app/components/home/header";
import Footer from "@/app/components/home/footer";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { espaces } from "@/data/espaces";
import EspaceSlider from "@/app/components/grand-tambour/EspaceSlider";
import EspaceCaracteristiques from "@/app/components/grand-tambour/EspaceCaracteristiques";
import EspaceCard from "@/app/components/grand-tambour/EspaceCard";

export default function EspacesGrandTambour() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentEspace = espaces[currentSlide];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-br from-muted/5 via-background to-muted/10 border-b border-muted/20 mt-20 sm:mt-24 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
          <Link
            href="/grand-tambour/presentation"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 sm:mb-14 transition-all duration-300 text-sm sm:text-base bg-white/50 hover:bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            Retour à la présentation
          </Link>

          <div className="max-w-4xl">
            <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight drop-shadow-sm">
              Les Espaces du Grand Tambour
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Le Grand Tambour est un espace pluridisciplinaire, innovant et
              inclusif, articulé autour de plusieurs pôles.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EspaceSlider
            espaces={espaces}
            currentIndex={currentSlide}
            onSlideChange={setCurrentSlide}
          />

          {/* Content Section */}
          <div className="max-w-5xl mx-auto">
            <EspaceCaracteristiques
              caracteristiques={currentEspace.caracteristiques}
            />
          </div>
        </div>
      </section>

      {/* Section Informations supplémentaires */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-muted/5 via-background to-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="uppercase text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Découvrez nos espaces
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Chaque espace du Grand Tambour a été conçu pour répondre aux
                besoins spécifiques de la création artistique et culturelle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {espaces.map((espace, index) => (
                <EspaceCard
                  key={espace.id}
                  espace={espace}
                  index={index}
                  onSelect={setCurrentSlide}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
