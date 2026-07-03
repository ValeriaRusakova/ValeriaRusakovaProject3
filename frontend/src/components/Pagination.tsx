// Pagination with numbered page buttons.
//
// Up to 7 pages: shows all buttons.
// More than 7:   shows a window around the current page with "…" gaps.
// Always hidden when there is only 1 page.

interface Props {
  page:     number;
  pages:    number;
  onChange: (page: number) => void;
}

/**
 * Returns an array of page numbers and '...' separators to render.
 * Example for page=5, pages=12: [1, '...', 4, 5, 6, '...', 12]
 */
function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const list: (number | '...')[] = [1];

  if (current > 3) list.push('...');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) list.push(i);

  if (current < total - 2) list.push('...');

  list.push(total);
  return list;
}

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;

  const pageList = buildPageList(page, pages);

  return (
    <nav className="pagination" aria-label="Page navigation">
      {/* Prev */}
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ←
      </button>

      {/* Page numbers + dots */}
      {pageList.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="pagination-dots">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => p !== page && onChange(p)}
            disabled={p === page}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="page-btn"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        →
      </button>
    </nav>
  );
}
