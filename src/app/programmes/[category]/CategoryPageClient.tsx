"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { categories, getProgrammesByCategory } from "@/lib/programmes-data";
import { Search } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function CategoryPageClient() {
  const params = useParams();
  const categorySlug = params.category as string;

  const category = categories.find((c) => c.id === categorySlug);
  const allProgrammes = getProgrammesByCategory(categorySlug);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProgrammes = allProgrammes.filter((programme) =>
    programme.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-foreground">
              Catégorie non trouvée
            </h1>
            <Link
              href="/programmes"
              className="text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Retour aux programmes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10" />
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <Link
            href="/programmes"
            className="inline-flex items-center text-white/80 hover:text-white  mt-20 mb-2 transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Retour aux programmes
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance drop-shadow-lg">
            {category.title}
          </h1>
          <p className="text-md md:text-lg text-white/90 text-balance leading-relaxed drop-shadow-md">
            {category.description}
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 sm:py-12 px-4 border-b border-muted/20 bg-gradient-to-r from-muted/10 via-muted/5 to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              {filteredProgrammes.length} programme
              {filteredProgrammes.length > 1 ? "s" : ""} disponible
              {filteredProgrammes.length > 1 ? "s" : ""}
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un programme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-11 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProgrammes.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Aucun programme trouvé pour votre recherche.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProgrammes.map((programme) => (
                <Link
                  key={programme.id}
                  href={`/programmes/${categorySlug}/${programme.slug}`}
                  className="group h-full"
                >
                  <Card className="h-full flex flex-col rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                    <div className="relative h-40 overflow-hidden flex-shrink-0">
                      <Image
                        src={programme.image || "/placeholder.svg"}
                        alt={programme.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {programme.featured && (
                        <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                          À la une
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 text-balance leading-snug">
                        {programme.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pb-4">
                      <CardDescription className="text-xs italic mb-2 line-clamp-2 text-pretty text-muted-foreground">
                        {programme.slogan}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground line-clamp-3 text-pretty leading-relaxed">
                        {programme.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
