import Image from "next/image";
import { Media } from "@/types/media";
import { formatDate } from "@/lib/mediaUtils";

interface MediaGridProps {
  items: Media[];
  loading: boolean;
  onItemClick: (index: number) => void;
}

export default function MediaGrid({
  items,
  loading,
  onItemClick,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-[3/2] bg-zinc-100 animate-pulse rounded-none"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-none">
        <p className="text-zinc-500 font-bold uppercase tracking-wide">
          Aucun média trouvé
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemClick(index)}
          className="group block w-full text-left"
        >
          {/* Image Container */}
          <div className="relative aspect-[3/2] overflow-hidden rounded-none bg-zinc-100 mb-4 cursor-pointer outline outline-transparent hover:outline-black transition-all duration-300">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Category Badge - Sharp */}
            <div className="absolute top-0 left-0">
              <span className="inline-block bg-black text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                {item.category}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span className="truncate flex-1 min-w-0">
                {formatDate(item.eventDate)}
              </span>
              {item.eventType && (
                <span className="ml-2 truncate flex-shrink-0 text-black">
                  {item.eventType}
                </span>
              )}
            </div>
            <h3 className="font-black text-lg sm:text-xl uppercase leading-none group-hover:text-zinc-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
            {item.location && (
              <p className="text-xs text-zinc-500 font-medium line-clamp-1 border-l-2 border-accent pl-2">
                {item.location}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
