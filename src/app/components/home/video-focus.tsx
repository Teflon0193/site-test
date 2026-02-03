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
    youtubeId: "6snOnJ-AlwY", // Exemple - remplacez par votre vraie vidéo

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
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-black group">
      {/* Background avec image ou vidéo locale */}
      <div className="absolute inset-0 transition-transform duration-[20s] ease-linear group-hover:scale-105">
        {!hasVideoError ? (
          // Essayer d'abord la vidéo locale
          <video
            className="w-full h-full object-cover opacity-60"
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
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
          </div>
        )}
        {/* Overlay sophistiqué */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-[url('/pattern-grid.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6">
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/30 backdrop-blur-md text-white text-xs font-bold tracking-[0.3em] uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              Focus Vidéo
            </div> */}

            <h1 className="text-3xl sm:text-3xl md:text-[4rem] leading-[0.8] font-black text-white tracking-tighter uppercase drop-shadow-2xl">
              {videoConfig.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light italic tracking-wide max-w-2xl mx-auto border-t border-white/20 pt-6 mt-6">
              {videoConfig.subtitle}
            </p>
          </div>

          {/* Bouton play - Design Sharp */}
          <button
            onClick={handlePlayVideo}
            className="group/btn relative inline-flex items-center gap-4 px-8 py-5 bg-white text-black hover:bg-accent transition-all duration-300"
            aria-label="Lire la vidéo de présentation"
          >
            {/* Play Icon Box */}
            <div className="w-8 h-8 flex items-center justify-center border-2 border-current">
              <FaPlay className="w-3 h-3 ml-0.5" />
            </div>

            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              Regarder la vidéo
            </span>

            {/* Hover effect bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-accent transform origin-bottom scale-y-0 group-hover/btn:scale-y-100 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Modal YouTube Video */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-7xl aspect-video bg-black shadow-2xl border border-white/10">
            {/* Bouton fermer - Sharp */}
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors group/close"
              aria-label="Fermer la vidéo"
            >
              <span className="text-xs uppercase tracking-widest font-bold">
                Fermer
              </span>
              <div className="p-2 border border-white/20 group-hover/close:border-white transition-colors bg-black">
                <FaTimes className="w-4 h-4" />
              </div>
            </button>

            {/* YouTube iframe */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoConfig.youtubeId}?autoplay=1&mute=0&controls=1&rel=0`}
              title="Vidéo de présentation Grand Tambour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Clic pour fermer (Overlay) */}
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
