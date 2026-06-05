"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Espace } from "@/data/espaces";
import { getEspaceIcon } from "@/lib/iconUtils";

interface EspaceSliderProps {
  espaces: Espace[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

export default function EspaceSlider({
  espaces,
  currentIndex,
  onSlideChange,
}: EspaceSliderProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = useCallback(() => {
    onSlideChange((currentIndex + 1) % espaces.length);
  }, [currentIndex, espaces.length, onSlideChange]);

  const prevSlide = useCallback(() => {
    onSlideChange((currentIndex - 1 + espaces.length) % espaces.length);
  }, [currentIndex, espaces.length, onSlideChange]);

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

  const currentEspace = espaces[currentIndex];
  const IconComponent = getEspaceIcon(currentEspace.iconName);

  return (
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
            priority={currentIndex === 0}
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
            onClick={() => onSlideChange(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? "bg-primary scale-125 shadow-lg"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-110"
            }`}
            aria-label={`Aller à l'espace ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
