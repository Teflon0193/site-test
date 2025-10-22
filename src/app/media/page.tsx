"use client";

import Header from "../components/home/header";
import Footer from "../components/home/footer";
import MediaFilters from "../components/media/MediaFilters";
import MediaGrid from "../components/media/MediaGrid";
import Pagination from "../components/media/Pagination";
import MediaPopup from "../components/media/MediaPopup";
import { useMediaFilters } from "@/hooks/useMediaFilters";
import { useMediaGallery } from "@/hooks/useMediaGallery";
import { useMediaPopup } from "@/hooks/useMediaPopup";
import { ITEMS_PER_PAGE } from "@/lib/mediaUtils";
import Image from "next/image";

export default function MediaPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative lg:h-[40vh] h-[30vh] lg:mt-5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
          <Image
            src="/motif-luba.png"
            alt="Médiathèque CCAPAC"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance drop-shadow-lg">
              Médiathèque
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl max-w-3xl mx-auto text-balance text-white/90 leading-relaxed drop-shadow-md">
              Découvrez nos moments forts de nos événements culturels à travers
              notre collection d&apos;images et de souvenirs
            </p>
          </div>
        </section>

        {/* Filter and Gallery Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
              <div className="flex-1">
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

      {/* Popup Slider Modal */}
      <MediaPopup
        isOpen={isPopupOpen}
        mediaItems={mediaItems}
        currentIndex={currentImageIndex}
        onClose={closePopup}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        onGoToImage={goToImage}
      />

      <Footer />
    </div>
  );
}
