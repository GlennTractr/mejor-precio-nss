'use client';

import { memo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface SharedPaginationProps {
  /**
   * Current active page number
   */
  currentPage: number;
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Number of items per page
   */
  itemsPerPage: number;
  /**
   * Callback when page is changed
   */
  onPageChange: (page: number) => void;
  /**
   * Maximum number of page buttons to show in the pagination
   */
  maxPagesToShow?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

function SharedPaginationComponent({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 5,
  className,
}: SharedPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // Generate visible page numbers with ellipsis logic
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={cn('flex justify-center mt-6', className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={cn(
                'hover:bg-secondary-100/50',
                currentPage === 1 && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>

          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="hover:bg-secondary-100/50"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && <PaginationEllipsis />}
            </>
          )}

          {visiblePages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={
                  currentPage === page
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary-800'
                    : 'hover:bg-secondary-100/50'
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="hover:bg-secondary-100/50"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={cn(
                'hover:bg-secondary-100/50',
                currentPage === totalPages && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SharedPagination = memo(SharedPaginationComponent);
SharedPagination.displayName = 'SharedPagination';
