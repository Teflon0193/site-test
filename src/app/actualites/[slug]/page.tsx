import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, FileText } from "lucide-react";
import MainLayout from "@/app/components/layouts/MainLayout";
import { getActualiteBySlug } from "@/services/actualiteService";
import ActualiteBlockRenderer from "./components/ActualiteBlockRenderer";

const typeLabels = {
  NEWSLETTER: "Newsletter",
  COMMUNIQUE: "Communique",
  POINT_PRESSE: "Point de presse",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actualite = await getActualiteBySlug(slug);

  return {
    title: actualite ? `${actualite.title} - CCAPAC` : "Actualite - CCAPAC",
    description: actualite?.summary,
  };
}

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actualite = await getActualiteBySlug(slug);

  if (!actualite || actualite.type === "NEWSLETTER") {
    notFound();
  }

  return (
    <MainLayout>
      <article className="min-h-screen bg-white">
        <section className="border-b-2 border-black bg-zinc-950 text-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
            <span className="inline-block bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em]">
              {typeLabels[actualite.type]}
            </span>
            <h1 className="mt-8 max-w-5xl text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              {actualite.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <Calendar size={13} />
                {actualite.mois && actualite.annee
                  ? `${actualite.mois} ${actualite.annee}`
                  : actualite.datePublication || "Date a venir"}
              </span>
            </div>
          </div>
        </section>

        {actualite.coverImage && (
          <div className="relative h-[42vh] min-h-[320px] border-b-2 border-black">
            <Image
              src={actualite.coverImage}
              alt={actualite.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="container mx-auto max-w-4xl px-6 md:px-12 py-12 md:py-16">
          {actualite.summary && (
            <p className="mb-12 border-l-4 border-primary pl-6 text-xl font-black uppercase tracking-tight leading-snug text-zinc-700">
              {actualite.summary}
            </p>
          )}

          <div className="space-y-10">
            {actualite.blocks?.length ? (
              actualite.blocks.map((block) => (
                <ActualiteBlockRenderer
                  key={`${block.__component}-${block.id}`}
                  block={block}
                />
              ))
            ) : (
              <div className="border-2 border-dashed border-zinc-200 p-10 text-center">
                <FileText className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Le contenu detaille sera bientot disponible.
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
