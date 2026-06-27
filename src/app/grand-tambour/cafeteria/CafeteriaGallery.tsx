"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  "/images/cafeteria/ER8A0780.jpg",
  "/images/cafeteria/ER8A0783.jpg",
  "/images/cafeteria/ER8A0817.jpg",
  "/images/cafeteria/ER8A0820.jpg",
  "/images/cafeteria/ER8A0824.jpg",
  "/images/cafeteria/ER8A0829.jpg",
];

export default function CafeteriaGallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Avance d'environ une carte (largeur visible × 0,8).
    const amount = Math.round(scroller.clientWidth * 0.8);
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <>
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold uppercase text-primary sm:text-4xl">
            Un cadre inspirant
          </h2>
          <p className="mt-2 text-sm text-primary/70 sm:text-base">
            Chaque recoin de notre cafétéria raconte une histoire.
          </p>
        </div>
        <div className="hidden gap-4 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Image précédente"
            className="grid h-12 w-12 place-items-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Image suivante"
            className="grid h-12 w-12 place-items-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:px-6 lg:px-8"
      >
        {galleryImages.map((src, index) => (
          <div
            key={src}
            className="relative h-[440px] w-[330px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-lg sm:h-[520px] sm:w-[420px]"
          >
            <Image
              src={src}
              alt={`Cadre de la Cafétéria ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="420px"
            />
          </div>
        ))}
      </div>
    </>
  );
}
