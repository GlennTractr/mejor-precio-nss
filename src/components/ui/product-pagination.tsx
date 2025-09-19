import { memo } from 'react';
import { SharedPagination } from '@/components/ui/shared-pagination';
import { ProductPaginationProps } from '@/types/components';

function ProductPaginationComponent({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 5,
  className,
}: ProductPaginationProps) {
  return (
    <SharedPagination
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      maxPagesToShow={maxPagesToShow}
      className={className}
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ProductPagination = memo(ProductPaginationComponent);
ProductPagination.displayName = 'ProductPagination';
