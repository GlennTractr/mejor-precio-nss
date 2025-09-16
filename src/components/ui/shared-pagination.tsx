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
  const getVisiblePages = (currentPage: number, totalPages: number, maxPages: number) => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Get different page sets for mobile and desktop
  const mobileVisiblePages = getVisiblePages(currentPage, totalPages, 3);
  const desktopVisiblePages = getVisiblePages(currentPage, totalPages, maxPagesToShow);

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

          {/* First page and ellipsis for mobile */}
          {mobileVisiblePages[0] > 1 && (
            <>
              <PaginationItem className="sm:hidden">
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="hover:bg-secondary-100/50"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {mobileVisiblePages[0] > 2 && (
                <PaginationItem className="sm:hidden">
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* First page and ellipsis for desktop */}
          {desktopVisiblePages[0] > 1 && (
            <>
              <PaginationItem className="hidden sm:block">
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="hover:bg-secondary-100/50"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {desktopVisiblePages[0] > 2 && (
                <PaginationItem className="hidden sm:block">
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Mobile visible pages */}
          {mobileVisiblePages.map(page => (
            <PaginationItem key={`mobile-${page}`} className="sm:hidden">
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

          {/* Desktop visible pages */}
          {desktopVisiblePages.map(page => (
            <PaginationItem key={`desktop-${page}`} className="hidden sm:block">
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

          {/* Last page and ellipsis for mobile */}
          {mobileVisiblePages[mobileVisiblePages.length - 1] < totalPages && (
            <>
              {mobileVisiblePages[mobileVisiblePages.length - 1] < totalPages - 1 && (
                <PaginationItem className="sm:hidden">
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem className="sm:hidden">
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="hover:bg-secondary-100/50"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Last page and ellipsis for desktop */}
          {desktopVisiblePages[desktopVisiblePages.length - 1] < totalPages && (
            <>
              {desktopVisiblePages[desktopVisiblePages.length - 1] < totalPages - 1 && (
                <PaginationItem className="hidden sm:block">
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem className="hidden sm:block">
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
