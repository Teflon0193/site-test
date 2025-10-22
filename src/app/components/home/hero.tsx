"use client";

import { useState, useEffect } from "react";
import { getHeroSlides } from "@/services/heroSlideService";
import { HeroSlide } from "@/types/hero-slide";
import StaticHero from "./StaticHero";
import HeroSlider from "./HeroSlider";

export default function HeroSection() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false);

  // Chargement des slides du hero
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const slides = await getHeroSlides();
        setHeroSlides(slides);
      } catch (error) {
        console.error("Erreur lors du chargement des slides du hero:", error);
      } finally {
        setLoading(false);
        // Délai pour une transition fluide
        setTimeout(() => {
          setShowSlider(true);
        }, 300);
      }
    };

    loadHeroSlides();
  }, []);

  // Gestion des cas d'erreur ou absence de contenu
  if (heroSlides.length === 0 && !loading) {
    return <StaticHero isLoading={loading} />;
  }

  return (
    <>
      {(!showSlider || loading) && <StaticHero isLoading={loading} />}

      {showSlider && heroSlides.length > 0 && (
        <HeroSlider slides={heroSlides} isVisible={showSlider} />
      )}
    </>
  );
}
