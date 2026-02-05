import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="mt-12 sm:mt-16 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors rounded-none"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 overflow-x-auto max-w-full">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-none text-sm font-bold transition-all flex-shrink-0 border",
              currentPage === page
                ? "bg-black text-white border-black"
                : "text-zinc-500 border-transparent hover:border-zinc-300 hover:bg-zinc-50",
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors rounded-none"
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
