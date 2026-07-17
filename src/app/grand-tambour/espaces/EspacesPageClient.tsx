"use client";

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { espaces } from "@/data/espaces";
import EspaceSlider from "@/app/components/grand-tambour/EspaceSlider";
import EspaceCaracteristiques from "@/app/components/grand-tambour/EspaceCaracteristiques";
import EspaceCard from "@/app/components/grand-tambour/EspaceCard";

export default function EspacesPageClient() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentEspace = espaces[currentSlide];

  return (
    <>
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

      {/* Slider */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EspaceSlider
            espaces={espaces}
            currentIndex={currentSlide}
            onSlideChange={setCurrentSlide}
          />

          <div className="max-w-5xl mx-auto">
            <EspaceCaracteristiques
              caracteristiques={currentEspace.caracteristiques}
            />
          </div>
        </div>
      </section>

      {/* Tous les espaces */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-muted/5 via-background to-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="uppercase text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Découvrez nos espaces
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Chaque espace du Grand Tambour a été conçu pour répondre aux
                besoins spécifiques de la création artistique et culturelle.
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

      {/* ===========================
          DEMANDE D'ESPACE
      ============================ */}
      <section className="py-20 bg-gradient-to-br from-[#F8F5EF] via-white to-[#F3EEE5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#E7DDCF]">

            <div className="grid lg:grid-cols-2">

              {/* LEFT */}
              <div className="bg-[#D1965B] text-white p-10 lg:p-14 flex flex-col justify-center">

                <span className="uppercase tracking-[5px] text-sm font-semibold opacity-80">
                  Réservation d&apos;espace
                </span>

                <h2 className="text-3xl lg:text-4xl font-bold mt-5 mb-6 leading-tight">
                  Organisez votre prochain événement au Grand Tambour
                </h2>

                <p className="text-lg leading-8 text-white/90">
                  Après avoir découvert nos espaces, vous pouvez effectuer une
                  demande de réservation directement depuis votre espace membre.
                  Votre dossier sera ensuite traité par les différents services
                  du Centre Culturel et Artistique.
                </p>

              </div>

              {/* RIGHT */}
              <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">

                <h3 className="text-2xl font-bold text-[#5C4033] mb-8">
                  Depuis votre espace membre vous pourrez :
                </h3>

                <div className="space-y-5 mb-10">

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#D1965B] mt-2"></div>
                    <p className="text-gray-700">
                      Déposer une demande de réservation d&apos;un espace.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#D1965B] mt-2"></div>
                    <p className="text-gray-700">
                      Suivre l&apos;évolution de votre dossier étape par étape.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#D1965B] mt-2"></div>
                    <p className="text-gray-700">
                      Recevoir les notifications des services Programmes,
                      Juridique et Finance.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#D1965B] mt-2"></div>
                    <p className="text-gray-700">
                      Consulter l&apos;historique complet de toutes vos demandes.
                    </p>
                  </div>

                </div>

                <Link
                  href="/auth/login"
                  className="w-full sm:w-fit bg-[#D1965B] hover:bg-[#B8834A] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-center"
                >
                  Faire une demande de réservation
                </Link>

                <p className="text-sm text-gray-500 mt-6">
                  Vous n&apos;avez pas encore de compte ?
                  <br />
                  Créez gratuitement votre espace membre pour déposer votre première demande de réservation 
                  et suivre son traitement en toute simplicité.
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}