"use client";

import Image from "next/image";
import Link from "next/link";
import { getFeaturedProgrammes } from "@/lib/programmes-data";
import { FaArrowRight } from "react-icons/fa";

export default function Programmes() {
  const featuredProgrammes = getFeaturedProgrammes();
  // Double the items for seamless loop in marquee
  const loopedProgrammes = [...featuredProgrammes, ...featuredProgrammes];

  return (
    <section className="py-10 lg:py-24 bg-white text-black relative overflow-hidden border-y border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-accent"></span>
              <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold">
                Nos Activités
              </span>
            </div>
            <h2 className="text-3xl md:text-3xl lg:text-5xl font-black text-black tracking-tighter uppercase leading-none">
              Vivez la <br />
              <span className="text-black">Culture Africaine</span>
            </h2>
            <p className="text-lg text-black/60 font-light max-w-sm mb-2">
            Découvrez nos programmes culturels qui célèbrent la richesse artistique du Congo à travers la musique, le théâtre, le cinéma et le patrimoine.  
            </p>
          </div>

          <Link
            href="/programmes"
            className="group inline-flex items-center justify-center px-4 py-4 bg-white text-black hover:bg-accent hover:text-white transition-all duration-500 font-bold uppercase tracking-widest text-xs"
          >
            <span>Explorer tout le programme</span>
            <FaArrowRight className="ml-3 w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden pause-marquee">
        <div className="flex w-fit animate-marquee">
          {loopedProgrammes.map((programme, index) => (
            <div
              key={`${programme.id}-${index}`}
              className="w-[280px] sm:w-[350px] lg:w-[450px] shrink-0 px-2 sm:px-4"
            >
              <Link
                href={`/programmes/${programme.categorySlug}/${programme.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-zinc-900 border-2 border-white/5 hover:border-white/20 transition-all duration-500"
              >
                {/* Image */}
                <Image
                  src={programme.image || "/placeholder.svg"}
                  alt={programme.title}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
                  className="object-cover transition-all duration-1000 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end z-10">
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                      {programme.category}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase leading-none tracking-tighter group-hover:text-primary transition-colors duration-300">
                      {programme.title}
                    </h3>

                    <div className="flex items-center text-white/40 group-hover:text-white text-[10px] font-black uppercase tracking-[0.2em] pt-4 transition-colors duration-300">
                      <div className="w-8 h-px bg-white/20 mr-4 group-hover:w-12 group-hover:bg-primary transition-all duration-500" />
                      Détails
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
