import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  itemLabel = "data",
  onPageChange,
  className = "",
}) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page === "..." || page === currentPage || page < 1 || page > totalPages) return;
    if (onPageChange) onPageChange(page);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm ${className}`}
    >
      <div className="text-slate-500 font-medium">
        Menampilkan{" "}
        <span className="font-semibold text-slate-700">
          {startItem}-{endItem}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
        {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm font-semibold select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => handlePageClick(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition cursor-pointer ${
                p === currentPage
                  ? "bg-[#006638] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
