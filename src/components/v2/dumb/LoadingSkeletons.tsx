import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LoadingSkeletonsProps } from '../types';

function LoadingSkeletonsComponent({
  count,
  type,
  className,
}: LoadingSkeletonsProps) {
  const renderProductSkeleton = () => (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  );

  const renderFilterSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeaderSkeleton = () => (
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return renderProductSkeleton();
      case 'filter':
        return renderFilterSkeleton();
      case 'header':
        return renderHeaderSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  if (type === 'product') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'filter') {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {renderSkeleton()}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const LoadingSkeletons = memo(LoadingSkeletonsComponent);
LoadingSkeletons.displayName = 'LoadingSkeletons';