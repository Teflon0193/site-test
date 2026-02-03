import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react";
import { Media } from "@/types/media";
import { formatDate } from "@/lib/mediaUtils";
import { useEffect } from "react";

interface MediaPopupProps {
  isOpen: boolean;
  mediaItems: Media[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToImage: (index: number) => void;
}

export default function MediaPopup({
  isOpen,
  mediaItems,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: MediaPopupProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || mediaItems.length === 0) return null;

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black animate-in fade-in duration-200">
      {/* Search/Controls Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-black/50 backdrop-blur-md px-4 py-2 text-white text-xs font-bold uppercase tracking-widest border border-white/10">
          {currentIndex + 1} / {mediaItems.length}
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-3 text-white hover:text-accent transition-colors bg-black/50 backdrop-blur-md border border-white/10 hover:border-accent"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden">
        {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          className="absolute left-0 h-full px-4 sm:px-8 z-40 text-white/30 hover:text-white hover:bg-black/20 transition-all hidden sm:flex items-center justify-center group"
          aria-label="Précédent"
        >
          <ChevronLeft
            size={48}
            strokeWidth={1}
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </button>

        <button
          onClick={onNext}
          className="absolute right-0 h-full px-4 sm:px-8 z-40 text-white/30 hover:text-white hover:bg-black/20 transition-all hidden sm:flex items-center justify-center group"
          aria-label="Suivant"
        >
          <ChevronRight
            size={48}
            strokeWidth={1}
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </button>

        {/* Image */}
        <div className="relative w-full h-full p-4 sm:p-12 md:p-20 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={currentItem.image || "/placeholder.svg"}
              alt={currentItem.title}
              fill
              className="object-contain"
              priority
              quality={90}
            />
          </div>
        </div>
      </div>

      {/* Footer / Caption Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 pt-8 pb-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-3 uppercase tracking-tight">
            {currentItem.title}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-accent" />
              <span className="truncate">
                {formatDate(currentItem.eventDate)}
              </span>
            </div>
            {currentItem.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-accent" />
                <span className="truncate">{currentItem.location}</span>
              </div>
            )}
            {currentItem.photographer && (
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-accent" />
                <span className="truncate">{currentItem.photographer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
