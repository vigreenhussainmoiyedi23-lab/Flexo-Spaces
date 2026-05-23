import React from "react";
import { useSpace } from "../spaces/hooks/useSpace";

const Pagination = ({ page, totalPages }) => {
  const { updateFilters } = useSpace();
  if (!totalPages || totalPages <= 1) return null;
  const handlePrev = () => {
    if (page > 1) updateFilters("page", page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) updateFilters("page", page + 1);
  };

  // 👇 Smart page range (max 5 buttons)
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    // Adjust if near start
    if (page <= 3) {
      end = Math.min(5, totalPages);
    }

    // Adjust if near end
    if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-accent-500 disabled:opacity-40"
      >
        Prev
      </button>

      {/* First page */}
      {page > 3 && (
        <>
          <button
            onClick={() => updateFilters("page", 1)}
            className="px-3 py-1 rounded bg-white/10"
          >
            1
          </button>
          <span className="px-1 text-white/50">...</span>
        </>
      )}

      {/* Middle pages */}
      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => updateFilters("page", p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-brand-500 text-white" : "bg-white/10"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last page */}
      {page < totalPages - 2 && (
        <>
          <span className="px-1 text-white/50">...</span>
          <button
            onClick={() => updateFilters("page", totalPages)}
            className="px-3 py-1 rounded bg-white/10"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-accent-500 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
