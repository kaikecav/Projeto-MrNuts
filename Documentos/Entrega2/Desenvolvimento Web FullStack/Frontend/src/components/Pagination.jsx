export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded border border-marketplace-cream text-marketplace-ink hover:bg-marketplace-paper disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded border border-marketplace-cream text-marketplace-ink hover:bg-marketplace-paper transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-marketplace-muted">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`px-3 py-2 rounded border transition-colors ${
            page === currentPage
              ? 'bg-marketplace-accent text-white border-marketplace-accent'
              : 'border-marketplace-cream text-marketplace-ink hover:bg-marketplace-paper'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-marketplace-muted">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded border border-marketplace-cream text-marketplace-ink hover:bg-marketplace-paper transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-marketplace-cream text-marketplace-ink hover:bg-marketplace-paper disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  );
}
