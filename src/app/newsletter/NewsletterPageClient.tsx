"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Newsletter } from "@/types/newsletter";
import { Calendar, FileText, Download } from "lucide-react";
import dynamic from "next/dynamic";

const PDFPreview = dynamic(
  () => import("../components/newsletter/PDFPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du PDF...</p>
      </div>
    ),
  },
);

interface NewsletterPageClientProps {
  newsletters: Newsletter[];
  isAuthenticated: boolean;
}

export default function NewsletterPageClient({
  newsletters,
  isAuthenticated,
}: NewsletterPageClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(newsletters[0]);

  const handleDownload = (newsletter: Newsletter) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirectUrl=/newsletter`);
      return;
    }
    window.open(`/api/newsletter/${newsletter.id}/download`, "_blank");
  };

  if (newsletters.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="p-12 text-center max-w-md border-2 border-black">
          <FileText className="w-16 h-16 mx-auto mb-6 text-zinc-300" />
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
            Aucune newsletter
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Les éditions de notre newsletter seront bientôt disponibles sur
            cette plateforme.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] md:h-[70vh] overflow-hidden border-b-2 border-black bg-white group/hero">
        {/* Slanted Image Suite Background */}
        <div className="absolute inset-0 flex w-[120%] -ml-[10%] z-10">
          <div
            className="relative flex-1 h-full overflow-hidden border-r-2 border-black transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event1.jpg"
              alt="CCAPAC Event 1"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 scale-110 group-hover/hero:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-x-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event2.jpg"
              alt="CCAPAC Event 2"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-75 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-l-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event3.jpg"
              alt="CCAPAC Event 3"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-150 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
        </div>

        {/* Text Overlay & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:to-white/5 z-20" />

        <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col justify-center relative z-30 pointer-events-none">
          <div className="max-w-3xl bg-white/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent p-8 lg:p-0 border-2 lg:border-0 border-black animate-slide-up">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              PUBLICATIONS & MÉMOIRES
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[0.8] mb-6 drop-shadow-sm">
              NEWS<br />
              <span className="text-primary italic">LETTER</span>
            </h1>
            <div className="w-24 h-3 bg-black"></div>
            <p className="max-w-md text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-600 mt-8 leading-relaxed">
              DÉCOUVREZ LES MOMENTS FORTS ET LES RÉCITS QUI FAÇONNENT NOTRE
              PATRIMOINE CULTUREL CHAQUE MOIS.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-12 right-12 w-32 h-32 border-t-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar - Liste */}
          <aside className="lg:col-span-1 space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b border-zinc-100 pb-4">
              ARCHIVES RÉCENTES
            </h2>
            <div className="space-y-4">
              {newsletters.map((n) => (
                <div
                  key={n.id}
                  className={`relative p-6 cursor-pointer transition-all duration-300 border-2 group ${
                    selected?.id === n.id
                      ? "border-black bg-zinc-50"
                      : "border-zinc-100 hover:border-zinc-300 bg-white"
                  }`}
                  onClick={() => setSelected(n)}
                >
                  {n.isFeatured && (
                    <div className="absolute -top-3 left-4 bg-primary px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                      ACTUEL
                    </div>
                  )}
                  <h3
                    className={`font-black uppercase tracking-tight text-lg leading-none mb-2 ${
                      selected?.id === n.id
                        ? "text-black"
                        : "text-zinc-400 group-hover:text-black"
                    }`}
                  >
                    {n.edition}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {n.mois} {n.annee}
                  </p>

                  {selected?.id === n.id && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main - Preview */}
          <main className="lg:col-span-3">
            {selected && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-zinc-100 px-3 py-1 text-black">
                      <Calendar size={12} className="text-primary" />
                      {selected.mois} {selected.annee}
                    </span>
                    {selected.pageCount && (
                      <span className="flex items-center gap-2 bg-zinc-100 px-3 py-1 text-black">
                        <FileText size={12} className="text-primary" />
                        {selected.pageCount} PAGES
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                    {selected.edition}
                  </h2>

                  <p className="text-lg font-bold uppercase tracking-tight text-zinc-500 max-w-2xl leading-snug">
                    {selected.description}
                  </p>

                  <button
                    onClick={() => handleDownload(selected)}
                    className="group relative inline-flex items-center gap-4 bg-black text-white px-8 py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300"
                  >
                    <Download size={16} />
                    {isAuthenticated
                      ? "TÉLÉCHARGER L'ÉDITION"
                      : "CONNEXION POUR TÉLÉCHARGER"}
                    <div className="absolute -bottom-1 -right-1 w-full h-full border-2 border-black -z-10 group-hover:bottom-0 group-hover:right-0 transition-all"></div>
                  </button>
                </div>

                <div className="border-t-4 border-black pt-12">
                  <PDFPreview
                    pdfUrl={`${process.env.NEXT_PUBLIC_STRAPI_URL}${selected.pdf.url}`}
                    maxPages={2}
                    onDownloadClick={() => handleDownload(selected)}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
