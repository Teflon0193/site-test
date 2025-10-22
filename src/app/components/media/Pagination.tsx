import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-3 border border-muted/30 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[44px] h-11 font-semibold transition-all duration-300 rounded-xl ${
            currentPage === page
              ? "bg-gradient-to-r from-accent to-accent/90 text-black shadow-lg scale-105"
              : "border border-muted/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 text-foreground hover:scale-105 shadow-lg"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-3 border border-muted/30 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
