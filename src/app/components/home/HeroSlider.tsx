import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { HeroSlide } from "@/types/hero-slide";

interface HeroSliderProps {
  slides: HeroSlide[];
  isVisible: boolean;
}

export default function HeroSlider({ slides, isVisible }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play du slider
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Navigation du slider
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

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

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative w-full h-[85vh] sm:h-[90vh] lg:h-screen min-h-[600px] overflow-hidden bg-background transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 z-0">
                <div
                  className={`relative w-full h-full transform transition-transform duration-[10s] ease-out ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    className="object-cover object-center sm:object-[center_20%]"
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    quality={90}
                  />
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />
                </div>
              </div>

              {/* Content Container */}
              <div className="relative h-full z-10 flex items-center">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 sm:mt-20">
                  <div
                    className={`max-w-4xl transition-all duration-1000 delay-300 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20"
                    }`}
                  >

                    {/* Massive Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[4rem] leading-[0.9] font-black tracking-tighter text-white mb-6 sm:mb-4 drop-shadow-2xl">
                      {slide.title}
                    </h1>

                    {/* Styled Subtitle */}
                    {slide.subtitle && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <div className="w-12 sm:w-20 h-1 bg-accent rounded-full" />
                        <p className="text-xl sm:text-2xl lg:text-3xl font-light italic text-white/90 max-w-xl leading-relaxed">
                          {slide.subtitle}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={slide.buttonLink}
                        className="group relative px-8 py-4 bg-accent text-black font-bold text-sm sm:text-base tracking-widest uppercase overflow-hidden transition-all hover:bg-white"
                      >
                        <span className="relative z-10">
                          {slide.buttonText}
                        </span>
                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          {/* Navigation Arrows Removed */}

          {/* Indicators (Bars) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-4 z-40">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 transition-all duration-300 ${
                  index === currentSlide
                    ? "w-12 bg-accent"
                    : "w-6 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
