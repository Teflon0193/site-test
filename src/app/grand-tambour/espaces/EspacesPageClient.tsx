"use client";

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { espaces } from "@/data/espaces";
import Image from "next/image";

export default function EspacesPageClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentEspace = espaces[currentSlide];

  return (
    <div className="min-h-screen bg-white text-black pt-24 sm:pt-32 pb-24">
      <div className="mx-auto px-6 sm:px-10 lg:px-16">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl w-full">
            <Link
              href="/grand-tambour/presentation"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-black mb-6 transition-colors duration-300 text-xs sm:text-sm font-black uppercase tracking-widest group"
            >
              <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Retour à la présentation
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] sm:leading-[0.85] mb-4 sm:mb-6">
              Les Espaces <br />{" "}
              <span className="text-3xl sm:text-4xl lg:text-5xl">
                du Grand Tambour
              </span>
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-zinc-500 font-medium max-w-sm border-l-4 border-accent pl-4 sm:pl-6">
            Un pôle pluridisciplinaire dédié à la création et à
            l&apos;expression culturelle.
          </p>
        </div>

        {/* Main Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-2 border-black mb-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
          {/* Image Side */}
          <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-video lg:aspect-auto h-auto min-h-[300px] lg:h-[750px] overflow-hidden group border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-zinc-100">
            <div className="absolute inset-0 bg-accent/5 z-10 group-hover:bg-transparent transition-colors duration-700" />
            <Image
              src={currentEspace.image || "/images/grand-tambour.jpg"}
              alt={currentEspace.nom}
              fill
              className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              key={currentEspace.id}
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />

            {/* Overlay Label */}
            <div className="absolute top-0 right-0 bg-black text-white px-6 py-4 font-black uppercase tracking-[0.3em] text-[10px] z-20">
              ESPACE {String(currentSlide + 1).padStart(2, "0")}
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-4 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-white">
            <div className="space-y-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6 block">
                  Configuration
                </span>
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                  {currentEspace.nom}
                </h2>
              </div>

              <div className="space-y-6">
                {currentEspace.caracteristiques.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="h-px w-6 bg-accent mt-3 shrink-0 group-hover:w-10 transition-all duration-300"></div>
                    <span className="text-zinc-600 font-black uppercase text-[10px] sm:text-xs tracking-widest group-hover:text-black transition-colors leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 pt-10 border-t-2 border-zinc-100">
              <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed italic border-l-2 border-zinc-200 pl-6">
                {currentEspace.description ||
                  "Un espace dédié à l'excellence artistique et à la transmission culturelle au cœur de Kinshasa."}
              </p>
            </div>
          </div>
        </div>

        {/* Selector Grid - Responsive Scrollable on Mobile */}
        <div className="relative group">
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t-2 border-l-2 border-black w-max sm:w-auto">
              {espaces.map((espace, idx) => (
                <button
                  key={espace.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`min-w-[200px] sm:min-w-0 p-8 sm:p-10 border-r-2 border-b-2 border-black text-left transition-all duration-500 group relative overflow-hidden ${
                    currentSlide === idx
                      ? "bg-primary text-white"
                      : "bg-white text-black hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`block text-[10px] font-black mb-4 tracking-[0.4em] uppercase transition-colors duration-500 ${
                      currentSlide === idx ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="block text-sm font-black uppercase tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500">
                    {espace.nom}
                  </span>

                  {/* Active Indicator */}
                  {currentSlide === idx && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-accent animate-in slide-in-from-left duration-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Hint */}
          <div className="sm:hidden mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center animate-pulse">
            ← Faire défiler pour voir plus d&apos;espaces →
          </div>
        </div>
      </div>
    </div>
  );
}
