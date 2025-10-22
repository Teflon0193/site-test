"use client";

import Image from "next/image";
import Link from "next/link";
import { getFeaturedProgrammes } from "@/lib/programmes-data";
import { FaArrowRight } from "react-icons/fa";

export default function Programmes() {
  const featuredProgrammes = getFeaturedProgrammes();

  return (
    <section className="py-16 sm:py-20 px-4 md:px-8 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl sm:text-4xl md:text-4xl uppercase font-bold text-foreground drop-shadow-sm">
            Vivez la Culture Congolaise
          </h2>
          <p className="text-sm lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez nos programmes culturels qui célèbrent la richesse
            artistique du Congo à travers la musique, le théâtre, le cinéma et
            le patrimoine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {featuredProgrammes.map((programme, index) => {
            // Premier programme prend 2x2 (grande carte)
            const isLarge = index === 0;
            const gridClass = isLarge
              ? "md:col-span-2 md:row-span-2 h-[400px] md:h-full rounded-2xl"
              : "h-[300px] rounded-2xl";

            return (
              <Link
                key={programme.id}
                href={`/programmes/${programme.categorySlug}/${programme.slug}`}
                className={`group relative overflow-hidden ${gridClass} shadow-lg hover:shadow-xl transition-all duration-300 border border-muted/20`}
              >
                <Image
                  src={programme.image || "/placeholder.svg"}
                  alt={programme.title}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end rounded-2xl">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2 rounded-2xl">
                    {/* Badge catégorie */}
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold rounded-full mb-3 shadow-lg">
                      {programme.category}
                    </span>

                    {/* Titre */}
                    <h3
                      className={`font-bold uppercase text-white mb-2 rounded-2xl drop-shadow-lg ${
                        isLarge ? "text-lg sm:text-2xl md:text-3xl" : "text-lg"
                      }`}
                    >
                      {programme.title}
                    </h3>

                    {/* Slogan - visible au survol */}
                    <p
                      className={`text-white/90 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md ${
                        isLarge
                          ? "text-base line-clamp-2"
                          : "text-sm line-clamp-2"
                      }`}
                    >
                      {programme.slogan}
                    </p>

                    {/* Bouton découvrir */}
                    <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-semibold">Découvrir</span>
                      <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/programmes"
            className="inline-flex items-center text-base gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Découvrir tous nos programmes
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
