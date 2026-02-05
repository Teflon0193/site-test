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
        className="relative overflow-hidden shadow-2xl mb-8 sm:mb-12 group border-b-4 border-accent"
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
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            priority={currentIndex === 0}
          />

          {/* Overlay avec informations */}
          <div className="absolute inset-x-0 bottom-0 bg-black/90 p-6 sm:p-8 lg:p-10 border-t border-accent">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="bg-accent text-black p-3 rounded-none w-fit shadow-none">
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-1">
                  {currentEspace.nom}
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-medium tracking-wide">
                  {currentEspace.capacite}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 hover:bg-black hover:text-accent transition-all duration-300 rounded-none backdrop-blur-sm"
          aria-label="Image précédente"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 hover:bg-black hover:text-accent transition-all duration-300 rounded-none backdrop-blur-sm"
          aria-label="Image suivante"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Navigation - Square */}
      <div className="flex justify-center gap-3 mb-8 sm:mb-12">
        {espaces.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
              index === currentIndex
                ? "bg-black scale-110"
                : "bg-zinc-300 hover:bg-zinc-400"
            }`}
            aria-label={`Aller à l'espace ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
