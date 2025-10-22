"use client";

import Header from "@/app/components/home/header";
import Footer from "@/app/components/home/footer";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosCafe } from "react-icons/io";
import { FaTheaterMasks, FaCamera } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function EspacesGrandTambour() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const espaces = [
    {
      id: 1,
      nom: "Grand Théâtre",
      capacite: "2000 places",
      caracteristiques: [
        "Grandes représentations",
        "Festivals",
        "Cérémonies nationales",
        "Concerts majeurs",
      ],
      image: "/images/espace3.jpg",
      icon: FaTheaterMasks,
    },
    {
      id: 2,
      nom: "Petit Théâtre",
      capacite: "800 places",
      caracteristiques: [
        "Pièces contemporaines",
        "Débats",
        "Projections",
        "Performances",
      ],
      image: "/images/espace5.jpg",
      icon: FaTheaterMasks,
    },
    {
      id: 3,
      nom: "Cafétéria culturelle",
      capacite: "100m²",
      caracteristiques: [
        "Espace de convivialité",
        "Restauration",
        "Petits concerts",
        "Lectures",
      ],
      image: "/images/espace1.jpg",
      icon: IoIosCafe,
    },
    {
      id: 4,
      nom: "Résidence d'artistes",
      capacite: "100 personnes",
      caracteristiques: [
        "Hébergement",
        "Ateliers de création",
        "Échanges internationaux",
      ],
      image: "/images/espace2.jpg",
      icon: FaBuildingUser,
    },
    {
      id: 5,
      nom: "Pôle média",
      capacite: "150 personnes",
      caracteristiques: [
        "Production TV, radio, podcasts, éditions",
        "Plateforme de diffusion des créations congolaises et africaines",
      ],
      image: "/images/espace4.jpg",
      icon: FaCamera,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % espaces.length);
  }, [espaces.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + espaces.length) % espaces.length);
  }, [espaces.length]);

  // Gestion du swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const currentEspace = espaces[currentSlide];
  const IconComponent = currentEspace.icon;

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
          {/* Slider Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Image Slider */}
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl mb-8 sm:mb-12 group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="aspect-[16/9] sm:aspect-[10/5] relative">
                <Image
                  src={currentEspace.image || "/images/grand-tambour.jpg"}
                  width={1000}
                  height={1000}
                  alt={currentEspace.nom}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />

                {/* Overlay avec informations */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-3 sm:p-4 rounded-2xl w-fit shadow-lg">
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {currentEspace.nom}
                        </h2>
                        <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium">
                          {currentEspace.capacite}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 sm:p-4 rounded-full hover:bg-white/30 transition-all duration-300 touch-manipulation shadow-lg group-hover:opacity-100 opacity-0 sm:opacity-100"
                aria-label="Image précédente"
              >
                <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 sm:p-4 rounded-full hover:bg-white/30 transition-all duration-300 touch-manipulation shadow-lg group-hover:opacity-100 opacity-0 sm:opacity-100"
                aria-label="Image suivante"
              >
                <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              {espaces.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 touch-manipulation ${
                    index === currentSlide
                      ? "bg-primary scale-125 shadow-lg"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-110"
                  }`}
                  aria-label={`Aller à l'espace ${index + 1}`}
                />
              ))}
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto">
              {/* Caractéristiques */}
              <div className="bg-gradient-to-br from-white to-muted/20 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-muted/20">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">
                  Utilisation de l&apos;espace
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {currentEspace.caracteristiques.map((carac, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 justify-center sm:justify-start lg:justify-center bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 rounded-xl p-4 sm:p-3 lg:p-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/80 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></div>
                      <span className="text-sm sm:text-base text-foreground text-center sm:text-left lg:text-center font-medium">
                        {carac}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              {espaces.map((espace, index) => {
                const IconComponent = espace.icon;
                return (
                  <div
                    key={espace.id}
                    className="group bg-gradient-to-br from-white to-muted/10 p-6 sm:p-8 rounded-2xl shadow-xl  border border-muted/20 cursor-pointer"
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mx-auto">
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {espace.nom}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        {espace.caracteristiques.map((carac, idx) => (
                          <span key={idx}>
                            {carac}
                            {idx < espace.caracteristiques.length - 1 &&
                              ","}{" "}
                          </span>
                        ))}
                        .
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
