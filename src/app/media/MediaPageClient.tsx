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
        <section className="relative h-[40vh] min-h-[350px] md:h-[50vh] overflow-hidden border-b-2 border-black bg-white group/hero">
          {/* Slanted Image Suite Background */}
          <div className="absolute inset-0 flex w-[120%] -ml-[10%] z-10">
            <div
              className="relative flex-1 h-full overflow-hidden border-r-2 border-black transition-all duration-700 hover:flex-[1.5]"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            >
              <Image
                src="/images/events/event1.jpg"
                alt="CCAPAC Media 1"
                fill
                className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 scale-110 group-hover/hero:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
            </div>
            <div
              className="relative flex-1 h-full overflow-hidden border-x-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
              style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)" }}
            >
              <Image
                src="/images/events/event2.jpg"
                alt="CCAPAC Media 2"
                fill
                className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-75 scale-110 group-hover/hero:scale-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
            </div>
            <div
              className="relative flex-1 h-full overflow-hidden border-l-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
            >
              <Image
                src="/images/events/event3.jpg"
                alt="CCAPAC Media 3"
                fill
                className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-150 scale-110 group-hover/hero:scale-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
            </div>
          </div>

          {/* Text Overlay & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:to-white/5 z-20" />

          <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col justify-end pb-12 md:pb-16 relative z-30 pointer-events-none">
            <div className="max-w-3xl bg-white/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent p-8 lg:p-0 border-2 lg:border-0 border-black animate-slide-up">
              <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                ARCHIVES & MÉDIATHÈQUE
              </span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase leading-[0.8] mb-6 drop-shadow-sm">
                MÉDIATHÈQUE
              </h1>
              <div className="w-24 h-3 bg-primary"></div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-28 right-12 w-32 h-32 border-t-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
          <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
        </section>

        {/* Filter and Gallery Section */}
        <section className="py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
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
