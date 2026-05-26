import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, FileText, Quote } from "lucide-react";
import MainLayout from "@/app/components/layouts/MainLayout";
import { getActualiteBySlug } from "@/services/actualiteService";
import { ActualiteBlock } from "@/types/actualite";

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
                <ActualiteBlockRenderer key={`${block.__component}-${block.id}`} block={block} />
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

function ActualiteBlockRenderer({ block }: { block: ActualiteBlock }) {
  if (block.__component === "shared.quote") {
    return (
      <blockquote className="border-2 border-black p-8">
        <Quote className="mb-5 h-8 w-8 text-primary" />
        {block.title && (
          <h2 className="mb-4 text-2xl font-black uppercase tracking-tighter">
            {block.title}
          </h2>
        )}
        {block.body && (
          <p className="text-lg font-semibold leading-relaxed text-zinc-700">
            {block.body}
          </p>
        )}
      </blockquote>
    );
  }

  if (block.__component === "shared.rich-text" && block.body) {
    return <RichTextContent body={block.body} />;
  }

  return null;
}

function RichTextContent({ body }: { body: string }) {
  const lines = body.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;

    const text = paragraph.join(" ");
    elements.push(
      <p key={`p-${elements.length}`} className="text-base font-medium leading-8 text-zinc-700">
        {renderInlineMarkdown(text)}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;

    const ListTag = listType;
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`space-y-3 pl-6 text-base font-medium leading-8 text-zinc-700 ${
          listType === "ol" ? "list-decimal" : "list-disc"
        }`}
      >
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ListTag>
    );
    listItems = [];
    listType = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();

      const level = heading[1].length;
      const className =
        level === 1
          ? "text-3xl md:text-4xl"
          : level === 2
            ? "text-2xl md:text-3xl"
            : "text-xl md:text-2xl";
      const HeadingTag = `h${level + 1}` as "h2" | "h3" | "h4";

      elements.push(
        <HeadingTag
          key={`h-${elements.length}`}
          className={`${className} pt-4 font-black uppercase leading-tight tracking-tighter text-black`}
        >
          {renderInlineMarkdown(heading[2])}
        </HeadingTag>
      );
      return;
    }

    const unorderedItem = trimmed.match(/^[-*]\s+(.+)$/);
    const orderedItem = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextType = orderedItem ? "ol" : "ul";

      if (listType && listType !== nextType) {
        flushList();
      }

      listType = nextType;
      listItems.push((orderedItem || unorderedItem)?.[1] || "");
      return;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      flushList();
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="border-l-4 border-primary pl-6 text-lg font-black uppercase tracking-tight text-zinc-700"
        >
          {renderInlineMarkdown(trimmed.replace(/^>\s?/, ""))}
        </blockquote>
      );
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-6">{elements}</div>;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      const href = getSafeHref(match[3]);
      nodes.push(
        href ? (
          <Link
            key={`link-${match.index}`}
            href={href}
            className="font-black text-primary underline underline-offset-4"
          >
            {match[2]}
          </Link>
        ) : (
          match[2]
        )
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={`strong-${match.index}`} className="font-black text-black">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      nodes.push(
        <em key={`em-${match.index}`} className="italic text-zinc-900">
          {match[5]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function getSafeHref(href: string) {
  const trimmed = href.trim();

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }

  return "";
}
