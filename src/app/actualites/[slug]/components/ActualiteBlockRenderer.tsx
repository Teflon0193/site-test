import { Quote } from "lucide-react";
import { ActualiteBlock } from "@/types/actualite";
import RichTextContent from "./RichTextContent";

export default function ActualiteBlockRenderer({
  block,
}: {
  block: ActualiteBlock;
}) {
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
