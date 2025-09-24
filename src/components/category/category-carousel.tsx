'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/use-categories';
import { useEffect, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useRouter } from 'next/navigation';

function CategorySkeleton() {
  return (
    <Card variant="interactive" className="w-[180px] h-[180px] flex-shrink-0">
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[120px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function CategoryCarousel() {
  const { data: categories, isLoading } = useCategories();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Function to check if we can scroll left or right (desktop only)
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Desktop scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Mobile slide functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Handle card click for navigation
  const handleCardClick = (e: React.MouseEvent, categorySlug: string) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    router.push(`/categoria/${categorySlug}`);
  };

  // Swipe gesture handler for mobile
  const bind = useDrag(
    ({ direction: [xDir], distance, last, first }) => {
      if (first) {
        setIsDragging(true);
      }

      // Only execute slide change on gesture end with sufficient distance
      if (last) {
        setTimeout(() => setIsDragging(false), 100); // Small delay to prevent click

        if (Math.sqrt(distance[0] ** 2 + distance[1] ** 2) > 50) {
          if (xDir > 0 && currentSlide > 0) {
            // Swiping right -> go to previous slide
            setCurrentSlide(prev => prev - 1);
          } else if (xDir < 0 && categories && currentSlide < categories.length - 1) {
            // Swiping left -> go to next slide
            setCurrentSlide(prev => prev + 1);
          }
        }
      }
    },
    {
      axis: 'x', // Only allow horizontal swiping
      threshold: 10, // Minimum distance to start gesture
      preventDefault: true, // Prevent default touch behaviors
    }
  );

  // Check scrollability for desktop
  useEffect(() => {
    if (!isLoading && categories && categories.length > 0) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
        checkScrollability();
      }, 200);
    }

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      return () => scrollContainer.removeEventListener('scroll', checkScrollability);
    }
  }, [isLoading, categories]);

  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="block md:hidden">
          <div className="flex justify-center">
            <CategorySkeleton />
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary-light/30" />
            ))}
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden md:block relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x mx-2 px-2 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[180px] snap-start">
                <CategorySkeleton />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Ensure currentSlide is within bounds
  const validCurrentSlide = Math.min(currentSlide, categories.length - 1);
  const currentCategory = categories[validCurrentSlide];

  if (!currentCategory || !currentCategory.slug) {
    return null;
  }

  return (
    <>
      {/* Mobile View - Single card with dots */}
      <div className="block md:hidden">
        <div className="flex justify-center px-6">
          <div {...bind()} className="w-[280px] touch-pan-y">
            <div
              onClick={e => handleCardClick(e, currentCategory.slug!)}
              className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/20 rounded-xl motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer"
            >
              <Card variant="interactive" className="w-full h-[280px]">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg text-center font-medium text-secondary">
                    <b>{currentCategory.label}</b>
                  </h3>
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={currentCategory.image_url || '/images/placeholder.jpg'}
                      alt={currentCategory.label}
                      fill
                      className="object-cover rounded-lg"
                      sizes="280px"
                      priority={false}
                      quality={80}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Dot Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-white hover:bg-primary-light/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop View - Horizontal scroll with navigation buttons */}
      <div className="hidden md:block relative">
        {/* Left navigation button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full bg-white hover:bg-white shadow-lg border border-primary-light/20 hover:border-primary-light/30 text-secondary/50 hover:text-secondary focus:border-none"
            onClick={scrollLeft}
            disabled={isLoading}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Category list */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x p-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onLoad={checkScrollability}
        >
          {categories.filter(category => category.slug).map(category => (
            <div key={category.id} className="min-w-[180px] snap-start">
              <Link
                href={`/categoria/${category.slug}`}
                className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/20 rounded-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
              >
                <Card variant="interactive" className="w-[180px] h-[180px] flex-shrink-0">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-md text-center font-medium truncate text-secondary">
                      <b>{category.label}</b>
                    </h3>
                    <div className="relative h-[120px] w-full">
                      <Image
                        src={category.image_url || '/images/placeholder.jpg'}
                        alt={category.label}
                        fill
                        className="object-cover rounded-lg"
                        sizes="180px"
                        priority={false}
                        quality={80}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Right navigation button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full bg-white hover:bg-white shadow-lg border border-primary-light/20 hover:border-primary-light/30 text-secondary/50 hover:text-secondary focus:border-none"
            onClick={scrollRight}
            disabled={isLoading}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </>
  );
}

// Add CSS to hide scrollbar
const scrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add the styles to the document if we're in the browser
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
}
