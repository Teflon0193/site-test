import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MainLayout from "@/app/components/layouts/MainLayout";
import { getProgrammeBySlug, programmes } from "@/lib/programmes-data";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
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

  const relatedProgrammes = programmes
    .filter((p) => p.categorySlug === category && p.slug !== slug)
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] lg:h-[60vh] flex items-end ">
        <div className="absolute inset-0 z-0">
          <Image
            src={programme.image || "/placeholder.svg"}
            alt={programme.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-16">
          <Link
            href={`/programmes/${category}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
          >
            <FaArrowLeft className="w-3 h-3 mr-2" />
            Retour
          </Link>

          <div className="max-w-5xl">
            <span className="inline-block py-1 px-3 mb-4 bg-white text-black text-xs font-black uppercase tracking-widest">
              {programme.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter text-balance drop-shadow-2xl leading-[0.9]">
              {programme.title}
            </h1>
            <p className="text-lg sm:text-lg md:text-xl text-white/90 font-medium max-w-3xl text-pretty drop-shadow-md line-clamp-3 leading-relaxed border-l-4 border-accent pl-4">
              {programme.slogan}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-16">
            {/* Description */}
            <div className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black prose-p:text-zinc-600 prose-p:leading-loose max-w-none">
              <h2 className="flex items-center gap-4 text-xl md:text-3xl">
                <span className="w-12 h-1 bg-black block"></span>À propos du
                programme
              </h2>
              <p className="text-sm md:text-lg font-medium">{programme.description}</p>
            </div>

            {/* Impact & Objectives */}
            <div className="space-y-8">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tighter flex items-center gap-4">
                <span className="w-12 h-1 bg-black block"></span>
                Impact & Objectifs
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Objectif */}
                <div className="bg-zinc-50 p-8 border-l-4 border-black">
                  <div className="flex items-center gap-3 mb-4 text-black">
                    <MdBookmark className="w-6 h-6 flex-shrink-0" />
                    <h3 className="font-black text-lg md:text-xl  uppercase tracking-tight">
                      Objectif
                    </h3>
                  </div>
                  <p className="text-zinc-600 leading-relaxed font-medium">
                    {programme.objectif}
                  </p>
                </div>

                {/* Impact */}
                <div className="bg-zinc-50 p-8 border-l-4 border-black">
                  <div className="flex items-center gap-3 mb-4 text-black">
                    <MdTrendingUp className="w-6 h-6 flex-shrink-0" />
                    <h3 className="font-black text-lg md:text-xl uppercase tracking-tight">
                      Impact
                    </h3>
                  </div>
                  <p className="text-zinc-600 leading-relaxed font-medium">
                    {programme.impact}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Key Info Card */}
              <div className="bg-white border-2 border-zinc-100 p-8 shadow-xl">
                <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-wider mb-8 pb-4 border-b-2 border-black">
                  Détails Clés
                </h3>

                <div className="space-y-8">
                  {/* Public Visé */}
                  <div>
                    <div className="flex items-center gap-2 text-black font-bold mb-2 text-sm uppercase tracking-wide">
                      <MdGroup className="w-5 h-5 flex-shrink-0" />
                      <span>Public Visé</span>
                    </div>
                    <p className="text-zinc-600 leading-relaxed pl-7 border-l border-zinc-200">
                      {programme.publicVise}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    <div className="flex items-center gap-2 text-black font-bold mb-2 text-sm uppercase tracking-wide">
                      <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Statut</span>
                    </div>
                    <div className="pl-7">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-widest bg-black text-white">
                        Actif
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-10 pt-8 border-t-2 border-zinc-100 space-y-4">
                  <Link
                    href="/infos"
                    className="block w-full text-center bg-black text-white font-black py-4 px-6 uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                  >
                    Nous contacter
                  </Link>
                  <p className="text-xs text-center text-zinc-400 font-bold uppercase tracking-wide">
                    Pour partenariats ou participation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programmes */}
      {relatedProgrammes.length > 0 && (
        <section className="py-20 px-4 sm:px-6 md:px-8 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-xl md:text-3xl font-black text-black mb-12 text-center uppercase tracking-tighter">
              Dans la même catégorie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedProgrammes.map((related) => (
                <Link
                  key={related.id}
                  href={`/programmes/${category}/${related.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/2] overflow-hidden mb-4 border-b-4 border-transparent group-hover:border-black transition-all duration-300">
                    <Image
                      src={related.image || "/placeholder.svg"}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-black text-lg md:text-xl text-black uppercase leading-none mb-2 group-hover:underline decoration-4 underline-offset-4 decoration-black transition-all">
                    {related.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-600 font-medium line-clamp-2">
                    {related.slogan}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
