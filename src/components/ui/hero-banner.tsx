'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface HeroBannerProps {
  className?: string;
}

export function HeroBanner({ className }: HeroBannerProps) {
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [rightImageVisible, setRightImageVisible] = useState(false);
  const [leftDecorationVisible, setLeftDecorationVisible] = useState(false);

  // Ref for banner container
  const bannerRef = useRef<HTMLDivElement>(null);

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Animation triggers on mount
  useEffect(() => {
    // Trigger fade-in animation
    const timer1 = setTimeout(() => setIsVisible(true), 100);

    // Trigger right image slide-in with delay
    const timer2 = setTimeout(() => setRightImageVisible(true), 400);

    // Trigger left decoration slide-in (same timing as right image)
    const timer3 = setTimeout(() => setLeftDecorationVisible(true), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <section className={cn('relative overflow-hidden w-full', className)}>
      <div ref={bannerRef} className="relative w-full h-[320px] md:h-[540px]">
        {/* Background Image - Bottom Layer with Fade-in */}
        <div
          className={cn(
            'absolute inset-0 z-10 transition-opacity duration-1200 ease-out',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src="/banner/background.jpg"
            alt=""
            fill
            className="w-full h-full object-cover will-change-transform"
            priority
            sizes="100vw"
          />
        </div>

        {/* Right Photo - Middle Layer with Slide-in (Hidden on mobile) */}
        <div className="absolute inset-0 z-20 hidden md:block">
          <div className="relative w-full h-full">
            <div
              className={cn(
                'absolute right-0 top-0 w-auto min-w-[35%] max-w-[45%] h-full transition-transform duration-1000 ease-out will-change-transform',
                rightImageVisible ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              <Image
                src="/banner/right-photo.png"
                alt="Madre feliz sosteniendo a su bebé"
                fill
                className="w-full h-full object-contain object-right"
                priority
                sizes="(min-width: 768px) 45vw"
              />
            </div>
          </div>
        </div>

        {/* Decoration Layer - Separate Left and Right Images */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Left Decoration - Slide-in from left */}
          <div
            className={cn(
              'absolute left-0 top-0 h-full transition-transform duration-1000 ease-out will-change-transform',
              leftDecorationVisible ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Image
              src="/banner/left-decaration.png"
              alt=""
              width={200}
              height={540}
              className="h-full w-auto object-cover"
              priority
            />
          </div>

          {/* Right Decoration - Synced with right image slide-in (Hidden on mobile) */}
          <div
            className={cn(
              'absolute top-0 h-full left-[60%] -ml-[50px] transition-transform duration-1000 ease-out will-change-transform hidden md:block',
              rightImageVisible ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <Image
              src="/banner/right-decoration.png"
              alt=""
              width={200}
              height={540}
              className="h-full w-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Text Content - Top Layer with Slow Fade-in */}
        <div
          className={cn(
            'absolute inset-0 z-40 flex items-center transition-opacity duration-2000 ease-out',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="relative w-full max-w-5xl mx-auto px-4 md:px-6">
            <div className="w-full md:w-[65%] space-y-4 md:space-y-6 text-center md:text-left">
              {/* Main Text */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-quicksand text-secondary leading-tight">
                Cuando un bebé nace,
                <br />
                comienza <span className="highlight-primary">una nueva </span> <br />
                <span className="highlight-secondary">ilusión</span> y el deseo de <br />
                <span className="highlight-primary">brindarle lo mejor</span>
              </h1>

              {/* Secondary Text */}
              <p className="text-lg md:text-2xl lg:text-3xl text-secondary/80 font-medium max-w-xs md:max-w-md mx-auto md:mx-0">
                ¡Nosotros te ayudamos a encontrarlo al mejor precio!
              </p>

              {/* Call to Action Button */}
              <div className="pt-2 md:pt-4 flex justify-center md:justify-start">
                <Button
                  onClick={scrollToCategories}
                  variant="primary"
                  size="lg"
                  className="text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 group border-0 font-medium"
                >
                  Ver Categorías
                  <ChevronDown className="ml-3 h-4 w-4 md:h-5 md:w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
