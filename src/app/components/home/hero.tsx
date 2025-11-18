"use client";

import { useState, useEffect } from "react";
import { useHeroSlidesQuery } from "@/hooks/useHeroSlidesQuery";
import { HeroSlide } from "@/types/hero-slide";
import StaticHero from "./StaticHero";
import HeroSlider from "./HeroSlider";

export default function HeroSection() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const { data, isLoading, isError } = useHeroSlidesQuery();
  const [showSlider, setShowSlider] = useState(false);

  // Chargement des slides du hero
  useEffect(() => {
    if (data && !isError) {
      setHeroSlides(data);
      // Délai pour une transition fluide
      const timeout = setTimeout(() => {
        setShowSlider(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [data, isError]);

  // Gestion des cas d'erreur ou absence de contenu
  if (heroSlides.length === 0 && !isLoading) {
    return <StaticHero isLoading={isLoading} />;
  }

  return (
    <>
      {(!showSlider || isLoading) && <StaticHero isLoading={isLoading} />}

      {showSlider && heroSlides.length > 0 && (
        <HeroSlider slides={heroSlides} isVisible={showSlider} />
      )}
    </>
  );
}
