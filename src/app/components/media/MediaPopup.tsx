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
  onGoToImage,
}: MediaPopupProps) {
  if (!isOpen || mediaItems.length === 0) return null;

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="absolute left-6 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Image précédente"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-6 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Image suivante"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image Container */}
        <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-full h-[80vh]">
            <Image
              src={currentItem.image || "/placeholder.svg"}
              alt={currentItem.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Image Info */}
          <div className="mt-6 text-center text-white max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-primary/80 rounded-full text-sm font-semibold shadow-lg">
                {currentItem.category}
              </div>
              {currentItem.eventType && (
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-sm font-semibold shadow-lg">
                  {currentItem.eventType}
                </div>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
              {currentItem.title}
            </h3>
            {currentItem.description && (
              <p className="text-gray-300 mb-6 leading-relaxed">
                {currentItem.description}
              </p>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3 text-sm">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">
                  {formatDate(currentItem.eventDate)}
                </span>
              </div>
              {currentItem.location && (
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{currentItem.location}</span>
                </div>
              )}
              {currentItem.photographer && (
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    Photo: {currentItem.photographer}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Counter and Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white text-sm font-semibold">
              {currentIndex + 1} / {mediaItems.length}
            </p>
          </div>
          <div className="flex space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToImage(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8 h-2 shadow-lg"
                    : "bg-white/40 hover:bg-white/60 w-2 h-2 hover:scale-125"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
