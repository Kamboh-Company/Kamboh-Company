import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-[#141923] border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((p, idx) => {
        if (p === '...') {
          return (
            <span key={'ellipsis-' + idx} className="px-2 text-slate-500 text-sm">
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={'page-' + p}
            onClick={() => onPageChange(Number(p))}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              isCurrent
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                : 'bg-[#141923] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-[#141923] border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
