"use client";

import MediaFilters from "../components/media/MediaFilters";
import MediaGrid from "../components/media/MediaGrid";
import Pagination from "../components/media/Pagination";
import MediaPopup from "../components/media/MediaPopup";
import { useMediaFilters } from "@/hooks/useMediaFilters";
import { useMediaGallery } from "@/hooks/useMediaGallery";
import { useMediaPopup } from "@/hooks/useMediaPopup";
import { ITEMS_PER_PAGE } from "@/lib/mediaUtils";
import Image from "next/image";

export default function MediaPageClient() {
  // Hooks pour la gestion des filtres
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedEventTypes,
    selectedYear,
    selectedMonth,
    toggleCategory,
    toggleEventType,
    setSelectedYear,
    setSelectedMonth,
  } = useMediaFilters();

  // Hook pour la gestion des médias
  const {
    mediaItems,
    loading,
    filteredItems,
    totalPages,
    paginatedItems,
    currentPage,
    setCurrentPage,
  } = useMediaGallery({
    searchQuery,
    selectedCategories,
    selectedEventTypes,
    selectedYear,
    selectedMonth,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Hook pour la gestion de la popup
  const {
    isPopupOpen,
    currentImageIndex,
    openPopup,
    closePopup,
    nextImage,
    prevImage,
    goToImage,
  } = useMediaPopup();

  // Handlers
  const handleItemClick = (index: number) => {
    openPopup(index, paginatedItems, mediaItems);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextImage = () => {
    nextImage(mediaItems.length);
  };

  const handlePrevImage = () => {
    prevImage(mediaItems.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-12 sm:pb-16 md:pb-20">
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/events/event1.jpg"
              alt="Médiathèque CCAPAC"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            {/* Gradient for text readability, but sharper */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-20">
            <span className="inline-block mb-6 px-4 py-1.5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase transform -skew-x-6 border border-white hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm">
              Galerie
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
              Médiathèque
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-accent"></div>
              <div className="h-[2px] w-12 bg-accent"></div>
            </div>
            <p className="text-xl sm:text-2xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
              Retours en images sur nos événements marquants.
            </p>
          </div>
        </section>

        {/* Filter and Gallery Section */}
        <section className="py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
              <MediaFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                selectedEventTypes={selectedEventTypes}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                toggleCategory={toggleCategory}
                toggleEventType={toggleEventType}
                setSelectedYear={setSelectedYear}
                setSelectedMonth={setSelectedMonth}
                resultsCount={filteredItems.length}
              />

              {/* Gallery Grid */}
              <div className="flex-1 w-full min-w-0">
                <MediaGrid
                  items={paginatedItems}
                  loading={loading}
                  onItemClick={handleItemClick}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Popup / Lightbox */}
      <MediaPopup
        isOpen={isPopupOpen}
        mediaItems={mediaItems}
        currentIndex={currentImageIndex}
        onClose={closePopup}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        onGoToImage={goToImage}
      />
    </div>
  );
}
