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
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[280px] sm:h-[40vh] sm:min-h-[350px] lg:h-[45vh] lg:min-h-[400px] mt-16 sm:mt-20 lg:mt-24 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src="/motif-luba.png"
            alt="Médiathèque CCAPAC"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="relative z-20 text-center px-4 sm:px-6 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-white tracking-tight uppercase drop-shadow-2xl">
              Médiathèque
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md px-2">
              Explorez les moments forts de nos événements culturels. Une
              fenêtre ouverte sur la créativité et l&apos;expression artistique.
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
