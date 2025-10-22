"use client";

import { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function VideoFocus() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Configuration vidéo - À personnaliser selon vos besoins
  const videoConfig = {
    // Option 1: Vidéo YouTube (remplacez par votre ID de vidéo)
    youtubeId: "dQw4w9WgXcQ", // Exemple - remplacez par votre vraie vidéo

    // Option 2: Vidéo locale
    localVideo: "/videos/grand-tambour-presentation.mp4",

    // Image de fallback
    posterImage: "/images/grand-tambour.jpg",

    // Titre et description
    title: "Grand Tambour",
    subtitle: "Découvrez notre patrimoine culturel",
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoError = () => {
    setHasVideoError(true);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] sm:h-[80vh] sm:min-h-[600px] lg:h-screen lg:min-h-[700px] overflow-hidden">
      {/* Background avec image ou vidéo locale */}
      <div className="absolute inset-0">
        {!hasVideoError ? (
          // Essayer d'abord la vidéo locale
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            poster={videoConfig.posterImage}
            onError={handleVideoError}
          >
            <source src={videoConfig.localVideo} type="video/mp4" />
            {/* Fallback: votre navigateur ne supporte pas la vidéo */}
          </video>
        ) : (
          // Fallback: image de fond si la vidéo ne fonctionne pas
          <div className="relative w-full h-full">
            <Image
              src={videoConfig.posterImage}
              alt="Grand Tambour"
              fill
              className="object-cover object-center sm:object-[60%_center]"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={90}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 sm:from-black/70 sm:via-black/40 sm:to-black/20"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
            {videoConfig.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 leading-relaxed drop-shadow-md">
            {videoConfig.subtitle}
          </p>

          {/* Bouton play pour vidéo YouTube */}
          <button
            onClick={handlePlayVideo}
            className="group inline-flex cursor-pointer items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-full border-2 border-primary hover:from-white/30 hover:to-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Lire la vidéo de présentation"
          >
            <FaPlay className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1 group-hover:scale-110 transition-transform duration-300" />
          </button>

          <p className="mt-4 text-sm sm:text-base text-white/70 drop-shadow-sm">
            Cliquez pour voir notre vidéo de présentation
          </p>
        </div>
      </div>

      {/* Modal YouTube Video */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video">
            {/* Bouton fermer */}
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70"
              aria-label="Fermer la vidéo"
            >
              <FaTimes className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* YouTube iframe */}
            <iframe
              className="w-full h-full rounded-2xl shadow-2xl"
              src={`https://www.youtube.com/embed/${videoConfig.youtubeId}?autoplay=1&mute=0&controls=1&rel=0`}
              title="Vidéo de présentation Grand Tambour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Clic pour fermer */}
          <div
            className="absolute inset-0 -z-10"
            onClick={handleCloseVideo}
            aria-label="Fermer la vidéo"
          ></div>
        </div>
      )}
    </section>
  );
}
