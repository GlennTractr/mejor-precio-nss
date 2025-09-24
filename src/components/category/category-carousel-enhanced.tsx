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

function CategorySkeleton() {
  return (
    <Card variant="interactive" className="w-[280px] h-[280px] flex-shrink-0">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function CategoryCarouselEnhanced() {
  const { data: categories, isLoading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Swipe gesture configuration
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      if (!categories || categories.length <= 1) return;

      setIsDragging(down);

      if (down) {
        // While dragging, show the drag offset
        setDragOffset(mx);
      } else {
        // When drag ends, determine if we should change slides
        const threshold = 50; // Minimum distance to trigger slide change
        const velocityThreshold = 0.2; // Minimum velocity for flick gesture

        const shouldChangeSlide = Math.abs(mx) > threshold || Math.abs(vx) > velocityThreshold;

        if (shouldChangeSlide) {
          if (xDir > 0 && currentSlide > 0) {
            // Swiped right, go to previous slide
            setCurrentSlide(prev => prev - 1);
          } else if (xDir < 0 && currentSlide < categories.length - 1) {
            // Swiped left, go to next slide
            setCurrentSlide(prev => prev + 1);
          }
        }

        // Reset drag offset
        setDragOffset(0);
      }
    },
    {
      axis: 'x',
      bounds: { left: -100, right: 100 },
      rubberband: true,
      preventDefault: true,
    }
  );

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

  return (
    <>
      {/* Mobile View - Enhanced with swipe gestures */}
      <div className="block md:hidden">
        <div className="flex justify-center px-6 overflow-hidden">
          <div
            ref={mobileContainerRef}
            {...bind()}
            className="w-[280px] cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translateX(${dragOffset}px)`,
              transition: isDragging
                ? 'none'
                : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <Link
              href={`/categoria/${categories[currentSlide].slug}`}
              className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/20 rounded-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
              // Prevent click during drag
              onClick={e => {
                if (isDragging || Math.abs(dragOffset) > 10) {
                  e.preventDefault();
                }
              }}
            >
              <Card variant="interactive" className="w-full h-[280px] pointer-events-none">
                <CardContent className="p-6 space-y-4 pointer-events-auto">
                  <h3 className="text-lg text-center font-medium text-secondary">
                    <b>{categories[currentSlide].label}</b>
                  </h3>
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={categories[currentSlide].image_url || '/images/placeholder.jpg'}
                      alt={categories[currentSlide].label}
                      fill
                      className="object-cover rounded-lg"
                      sizes="280px"
                      priority={false}
                      quality={80}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Enhanced Dot Pagination with swipe indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-primary scale-125'
                  : 'bg-white hover:bg-primary-light/20 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1} of ${categories.length}`}
            />
          ))}
        </div>

        {/* Swipe hint for first-time users */}
        {categories.length > 1 && (
          <div className="flex justify-center mt-2">
            <p className="text-xs text-secondary/60 text-center">Desliza para ver más categorías</p>
          </div>
        )}
      </div>

      {/* Desktop View - Unchanged horizontal scroll with navigation buttons */}
      <div className="hidden md:block relative">
        {/* Left navigation button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full bg-white hover:bg-white shadow-lg border border-primary-light/20 hover:border-primary-light/30 text-secondary/50 hover:text-secondary focus:border-none"
            onClick={scrollLeft}
            disabled={isLoading}
            aria-label="Previous categories"
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
          {categories.map(category => (
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
            aria-label="Next categories"
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
  
  /* Improve touch scrolling on mobile */
  .scrollbar-hide {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

// Add the styles to the document if we're in the browser
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
}
