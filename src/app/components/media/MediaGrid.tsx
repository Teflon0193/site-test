import Image from "next/image";
import { Calendar, MapPin, Camera } from "lucide-react";
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
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">
              Chargement des médias...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl p-12 max-w-lg mx-auto border border-muted/20 shadow-lg">
          <p className="text-xl text-foreground font-semibold mb-3">
            Aucun résultat trouvé
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemClick(index)}
          className="group cursor-pointer rounded-2xl relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 border border-muted/20"
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary to-primary/80 rounded-full text-xs font-semibold shadow-lg">
                {item.category}
              </div>
              {item.eventType && (
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-xs font-semibold shadow-lg">
                  {item.eventType}
                </div>
              )}
            </div>
            <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 drop-shadow-md">
              {item.title}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.eventDate)}</span>
              </div>
              {item.location && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
              )}
              {item.photographer && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Camera className="w-3 h-3" />
                  <span className="line-clamp-1">{item.photographer}</span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
