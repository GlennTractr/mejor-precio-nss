import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductPaginationProps } from '../types';
import { generatePageNumbers } from '../utils';

function ProductPaginationComponent({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 5,
  className,
}: ProductPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  const pageNumbers = generatePageNumbers(currentPage, totalPages, maxPagesToShow);

  return (
    <div className={cn('flex justify-center mt-6', className)}>
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &lt;
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === currentPage}
            className={cn(
              page === '...' && 'cursor-default hover:bg-transparent border-transparent',
              page === currentPage && 'bg-secondary text-white'
            )}
            aria-label={typeof page === 'number' ? `Go to page ${page}` : undefined}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ProductPagination = memo(ProductPaginationComponent);
ProductPagination.displayName = 'ProductPagination';