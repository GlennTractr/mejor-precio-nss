'use client';

import { useEffect, useRef, useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api/fetch-helper';

interface SimilarProductsCarouselProps {
  title: string;
  query: string;
  productId?: string;
  categorySlug?: string;
  specs?: Array<{ type: string; label: string }>;
  filterBy?: string;
  perPage?: number;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse h-[320px] flex flex-col border rounded-lg border-primary-light/20">
      <div className="relative w-full h-36 bg-primary-light/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary-light/30" />
        </div>
      </div>
      <div className="flex-grow space-y-1 py-2 px-4">
        <div className="h-3 bg-primary-light/20 rounded w-3/4"></div>
        <div className="h-3 bg-primary-light/20 rounded w-1/2 mt-1"></div>
      </div>
      <div className="py-1 px-4">
        <div className="h-4 bg-primary-light/20 rounded w-1/3"></div>
      </div>
      <div className="pt-0 pb-2 px-4">
        <div className="h-3 bg-primary-light/20 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function SimilarProductsCarousel({
  title,
  query,
  productId,
  categorySlug,
  specs,
  filterBy = '',
  perPage = 10,
}: SimilarProductsCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchSimilarProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          per_page: perPage.toString(),
        });

        // Add product ID to exclude current product
        if (productId) {
          params.append('exclude_id', productId);
        }

        // Add category slug for filtering
        if (categorySlug) {
          params.append('category_slug', categorySlug);
        }

        // Add specs for filtering
        if (specs && specs.length > 0) {
          params.append('specs', JSON.stringify(specs));
        }

        // Add any additional filters
        if (filterBy) {
          params.append('filter_by', filterBy);
        }

        const response = await apiFetch(`/api/typesense/similar-products?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.hits) {
          setProducts(data.hits.map((hit: { document: Product }) => hit.document));
          setTotalFound(data.found || 0);
        } else {
          setProducts([]);
          setTotalFound(0);
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
        setProducts([]);
        setTotalFound(0);
      } finally {
        setIsLoading(false);
        // Reset scroll position and navigation states when new products load
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
          setCanScrollLeft(false);
          checkScrollability();
        }
      }
    }

    fetchSimilarProducts();
  }, [query, productId, categorySlug, specs, filterBy, perPage]);

  // Auto-scroll for mobile
  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 4000); // Auto-scroll every 4 seconds

      return () => clearInterval(interval);
    }
  }, [products.length]);

  // Mobile slide functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Function to check if we can scroll left or right
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // Use a threshold of 10px for showing the left button to account for padding/margin
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer for rounding errors
    }
  };

  // Check if we can scroll left or right
  useEffect(() => {
    // Check initially after products load
    if (!isLoading && products.length > 0) {
      // Force initial check after render with a slightly longer delay to ensure everything is rendered
      setTimeout(() => {
        // Ensure we start at the beginning
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
        checkScrollability();
      }, 200);
    }

    // Add scroll event listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      return () => scrollContainer.removeEventListener('scroll', checkScrollability);
    }
  }, [isLoading, products]);

  // Add resize listener to update button visibility when window size changes
  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Reset current slide when products change
  useEffect(() => {
    setCurrentSlide(0);
  }, [products]);

  // Don't render if no similar products found
  if (!isLoading && totalFound === 0) {
    return null;
  }

  return (
    <div className="py-8 space-y-4">
      <h2 className="text-xl font-semibold text-accent">
        {title} <span className="text-muted-foreground">({totalFound})</span>
      </h2>

      {/* Mobile View - Single card with dots */}
      <div className="block md:hidden">
        {isLoading ? (
          <>
            <div className="flex justify-center px-6">
              <div className="min-w-[280px]">
                <ProductSkeleton />
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white" />
              ))}
            </div>
          </>
        ) : products.length > 0 ? (
          <>
            <div className="flex justify-center px-6">
              <div className="min-w-[280px]">
                <ProductCard product={products[currentSlide]} />
              </div>
            </div>
            {/* Dot Pagination */}
            {products.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide
                        ? 'bg-primary'
                        : 'bg-primary/20 hover:bg-primary-light/20'
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
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

        {/* Product list */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onLoad={checkScrollability}
        >
          {isLoading
            ? Array.from({ length: perPage }).map((_, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <ProductSkeleton />
                </div>
              ))
            : products.map(product => (
                <div key={product.id} className="min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* Right navigation button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full bg-white hover:bg-white shadow-lg border border-primary-light/20 hover:border-primary-light/30 text-secondary hover:text-secondary"
            onClick={scrollRight}
            disabled={isLoading}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
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
