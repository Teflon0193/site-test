export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import MainLayout from "@/app/components/layouts/MainLayout";
import { articles, getArticleBySlug } from "@/data/articles";
import type { Article, ArticleBlock } from "@/types/article";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable - CCAPAC" };
  }

  return {
    title: `${article.title} - CCAPAC`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = articles
    .filter((item) => item.slug !== article.slug)
    .filter((item) => item.category === article.category)
    .concat(
      articles.filter(
        (item) =>
          item.slug !== article.slug && item.category !== article.category
      )
    )
    .slice(0, 3);

  return (
    <MainLayout>
      <article className="min-h-screen bg-background text-foreground">
        {/* En-tête */}
        <header className="pt-24 sm:pt-28 md:pt-32 lg:pt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/articles"
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground shadow-sm ring-1 ring-muted/20 transition hover:text-primary hover:ring-primary/40"
              >
                <ArrowLeft size={14} />
                Tous les articles
              </Link>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-widest">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {article.category}
                </span>
                <span className="text-muted-foreground">
                  {article.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={13} />
                  {article.readingTime} min
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {article.title}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {article.excerpt}
              </p>

              <p className="mt-5 text-sm italic text-muted-foreground">
                Par {article.author}
              </p>
            </div>
          </div>
        </header>

        {/* Image de couverture */}
        <div className="container mx-auto mt-8 px-4 sm:mt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted/10 shadow-sm ring-1 ring-muted/10 sm:aspect-[16/10]">
              <div className="absolute inset-0 z-10 bg-[url('/motif-lub.png')] bg-cover bg-center opacity-[0.04]" />
              <Image
                src={article.coverImage ?? article.image}
                alt={article.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                quality={90}
              />
            </div>
          </div>
        </div>

        {/* Corps de l'article */}
        <div className="container mx-auto mt-10 px-4 sm:mt-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {article.content.map((block, index) => (
              <ArticleBlockView key={index} block={block} />
            ))}

            <div className="mt-12 border-t border-muted/20 pt-6">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary"
              >
                <ArrowLeft size={15} />
                Retour aux articles
              </Link>
            </div>
          </div>
        </div>

        {/* Articles liés */}
        {related.length > 0 && (
          <section className="container mx-auto mt-16 px-4 pb-16 sm:mt-20 sm:px-6 sm:pb-20 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-2.5 w-2.5 bg-primary" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
                  À lire également
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <RelatedCard key={item.slug} article={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </MainLayout>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="mt-10 flex items-center gap-3 text-xl font-bold text-primary sm:text-2xl">
        <span className="h-6 w-1.5 flex-shrink-0 rounded-full bg-primary" />
        {block.text}
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-8 border-l-4 border-primary bg-white px-6 py-5 shadow-sm">
        <p className="text-lg font-medium italic leading-relaxed text-foreground">
          « {block.text} »
        </p>
        {block.cite && (
          <cite className="mt-3 block text-xs font-semibold uppercase tracking-widest not-italic text-muted-foreground">
            {block.cite}
          </cite>
        )}
      </blockquote>
    );
  }

  if (block.type === "qa") {
    return (
      <div className="mt-8 border-t border-muted/20 pt-6">
        <p className="flex gap-3 text-base font-semibold leading-snug text-primary sm:text-lg">
          <span className="select-none font-bold not-italic">Q.</span>
          <span>{block.question}</span>
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {block.answer}
        </p>
      </div>
    );
  }

  return (
    <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
      {block.text}
    </p>
  );
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-muted/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/10">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {article.category}
        </span>
        <h3 className="mt-2 text-base font-bold uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground transition-colors group-hover:text-primary">
          Lire la suite
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
