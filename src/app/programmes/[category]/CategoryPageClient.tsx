"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { categories, getProgrammesByCategory } from "@/lib/programmes-data";
import { Search } from "lucide-react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Input } from "../../../components/ui/input";

export default function CategoryPageClient() {
  const params = useParams();
  const categorySlug = params.category as string;

  const category = categories.find((c) => c.id === categorySlug);
  const allProgrammes = getProgrammesByCategory(categorySlug);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProgrammes = allProgrammes.filter((programme) =>
    programme.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-black mb-4">CATÉGORIE INTROUVABLE</h1>
          <Link
            href="/programmes"
            className="text-black hover:underline uppercase font-bold tracking-widest"
          >
            Retour aux programmes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          {/* Gradient for text readability, but sharper */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20">
          <Link
            href="/programmes"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-xs font-black uppercase tracking-[0.2em] hover:underline decoration-accent decoration-2 underline-offset-4"
          >
            <FaArrowLeft className="mr-2 w-3 h-3" />
            Retour à l&apos;index
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
            {category.title}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-[2px] w-12 bg-accent"></div>
          </div>
          <p className="text-lg md:text-xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            {category.description}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-200 py-4 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black text-black uppercase tracking-[0.2em] w-full sm:w-auto text-center sm:text-left">
            {filteredProgrammes.length} Programme
            {filteredProgrammes.length > 1 ? "s" : ""}
          </p>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="RECHERCHER UN PROGRAMME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-10 bg-transparent border-b-2 border-zinc-200 focus:border-black rounded-none transition-colors w-full font-bold uppercase text-sm placeholder:text-zinc-300 focus:ring-0 px-0"
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {filteredProgrammes.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-zinc-200">
              Aucun programme ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
              {filteredProgrammes.map((programme) => (
                <Link
                  key={programme.id}
                  href={`/programmes/${categorySlug}/${programme.slug}`}
                  className="group block"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100 mb-6 border-b-4 border-transparent group-hover:border-black transition-all duration-300">
                    <Image
                      src={programme.image || "/placeholder.svg"}
                      alt={programme.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Featured Badge */}
                    {programme.featured && (
                      <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase px-3 py-1 tracking-widest">
                        À la une
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-black uppercase leading-[0.9] tracking-tight group-hover:underline decoration-4 underline-offset-4 decoration-black transition-all">
                      {programme.title}
                    </h3>
                    <p className="text-sm text-zinc-600 font-medium line-clamp-2 leading-relaxed border-l-2 border-zinc-200 pl-3">
                      {programme.slogan}
                    </p>
                    <div className="pt-2 flex items-center text-xs font-black uppercase tracking-widest text-black group-hover:translate-x-2 transition-transform duration-300">
                      Découvrir
                      <FaArrowRight className="ml-2 w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
