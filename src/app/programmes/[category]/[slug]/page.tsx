import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../../../components/home/header";
import Footer from "../../../components/home/footer";
import {
  getProgrammeBySlug,
  programmes,
  categories,
} from "@/lib/programmes-data";
import { FaArrowLeft } from "react-icons/fa";
import { MdBookmark, MdGroup, MdTrendingUp } from "react-icons/md";

export async function generateStaticParams() {
  return programmes.map((programme) => ({
    category: programme.categorySlug,
    slug: programme.slug,
  }));
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const programme = getProgrammeBySlug(slug);

  if (!programme || programme.categorySlug !== category) {
    notFound();
  }

  const categoryObj = categories.find((c) => c.id === category);

  const relatedProgrammes = programmes
    .filter((p) => p.categorySlug === category && p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden mt-14">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10" />
        <Image
          src={programme.image || "/placeholder.svg"}
          alt={programme.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="relative z-20 w-full px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            <Link
              href={`/programmes/${category}`}
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour à {categoryObj?.title}
            </Link>
            <div className="mb-4">
              <span className="inline-block rounded-xl px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm text-primary-foreground text-sm font-semibold border border-primary/30 shadow-lg">
                {programme.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance drop-shadow-lg">
              {programme.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 italic text-balance drop-shadow-md">
              {programme.slogan}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white to-muted/10 rounded-2xl p-8 sm:p-10 shadow-lg border border-muted/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/80 rounded-full"></div>
              Description
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed text-pretty text-foreground/90">
              {programme.description}
            </p>
          </div>
        </div>
      </section>

      {/* Key Information Grid */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Objectif */}
            <div className="group bg-gradient-to-br from-white to-muted/10 rounded-2xl border border-muted/20 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ">
              <div className="w-12 h-12 flex items-center justify-center mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                <MdBookmark className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Objectif
              </h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {programme.objectif}
              </p>
            </div>

            {/* Public visé */}
            <div className="group bg-gradient-to-br from-white to-muted/10 rounded-2xl border border-muted/20 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ">
              <div className="w-12 h-12 flex items-center justify-center mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                <MdGroup className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Public visé
              </h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {programme.publicVise}
              </p>
            </div>

            {/* Impact */}
            <div className="group bg-gradient-to-br from-white to-muted/10 rounded-2xl border border-muted/20 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ">
              <div className="w-12 h-12 flex items-center justify-center mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                <MdTrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Impact</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {programme.impact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl uppercase font-bold mb-4 sm:mb-6 text-balance text-foreground drop-shadow-sm">
            Intéressé par ce programme ?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Contactez-nous pour en savoir plus sur les modalités de
            participation, les dates des prochaines éditions ou pour proposer un
            partenariat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/infos"
              className="inline-flex rounded-xl items-center justify-center px-8 py-3 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Nous contacter
            </Link>
            <Link
              href={`/programmes/${category}`}
              className="inline-flex items-center rounded-xl text-foreground justify-center px-8 py-3 bg-gradient-to-br from-white to-muted/10 border border-muted/20 hover:border-primary/50 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105"
            >
              Voir tous les programmes
            </Link>
          </div>
        </div>
      </section>

      {/* Related Programmes */}
      {relatedProgrammes.length > 0 && (
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl text-foreground font-bold mb-6 sm:mb-8 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/80 rounded-full"></div>
              Autres programmes de cette catégorie
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {relatedProgrammes.map((related) => (
                <Link
                  key={related.id}
                  href={`/programmes/${category}/${related.slug}`}
                  className="group rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={related.image || "/placeholder.svg"}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-balance leading-tight">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-pretty leading-relaxed">
                      {related.slogan}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
