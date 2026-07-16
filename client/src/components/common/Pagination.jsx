import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, isAdmin = false }) {
  if (totalPages <= 1) return null;

  const pages = [];
  // Show up to 5 pages around the current page, or just all if small
  // For simplicity, we'll just show all pages if totalPages is small, or a window.
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  if (totalPages > 5) {
    if (currentPage <= 3) {
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Admin styles use slate and fedex-purple. Main site uses primary and muted.
  const containerClass = isAdmin ? "flex items-center justify-center gap-1 mt-6" : "flex items-center justify-center gap-2 mt-12";
  const btnBase = isAdmin
    ? "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all"
    : "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all";
    
  const getNavBtnClass = (disabled) => {
    if (isAdmin) {
      return `${btnBase} border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;
    }
    return `${btnBase} border border-border bg-card text-muted-foreground hover:bg-[var(--accent-soft)] hover:text-accent ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;
  };

  const getPageBtnClass = (isActive) => {
    if (isAdmin) {
      return `${btnBase} ${isActive ? 'bg-fedex-purple text-white shadow-md shadow-fedex-purple/20' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`;
    }
    return `${btnBase} ${isActive ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]' : 'bg-transparent text-muted-foreground hover:bg-[var(--primary-soft)] hover:text-primary'}`;
  };

  return (
    <div className={containerClass}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={getNavBtnClass(currentPage === 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className={isAdmin ? "w-4 h-4" : "w-5 h-5"} />
      </button>
      
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={getPageBtnClass(false)}>1</button>
          {startPage > 2 && <span className={isAdmin ? "text-slate-400" : "text-muted-foreground"}>...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={getPageBtnClass(currentPage === page)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className={isAdmin ? "text-slate-400" : "text-muted-foreground"}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className={getPageBtnClass(false)}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={getNavBtnClass(currentPage === totalPages)}
        aria-label="Next page"
      >
        <ChevronRight className={isAdmin ? "w-4 h-4" : "w-5 h-5"} />
      </button>
    </div>
  );
}
