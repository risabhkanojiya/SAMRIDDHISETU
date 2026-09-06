'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedPuzzlePatterns } from './ui/animated-puzzle-patterns';

export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          const totalScrollable = rect.height - windowH;

          if (totalScrollable > 0) {
            const scrolledWhilePinned = -rect.top;
            const p = Math.max(0, Math.min(1, scrolledWhilePinned / totalScrollable));
            setProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  return progress;
}

/**
 * Unified sequence matching Hummingbird.co:
 * 1. Background transitions from white/light to dark (#013e4e).
 * 2. Text slides in horizontally line by line.
 * 3. As you keep scrolling, the 4 feature cards scroll in horizontally.
 */
export function CombinedScrollSequence({
  line1,
  line2,
  subtitle,
  features,
}: {
  line1: string;
  line2: string;
  subtitle: string;
  features: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    desc: string;
    href: string;
    color: string;
  }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);

  // --- Animation Mapping (0.0 to 1.0) ---
  // The scroll length is 400vh

  // 1. Line 1 slides in (0.00 to 0.15)
  // 2. Line 2 slides in (0.15 to 0.25)
  // 3. Color Transition happens EXACTLY as line 2 hits left (0.24 to 0.28)
  // 4. Text stays briefly (0.28 to 0.35)
  // 5. Text Slide Out (0.35 to 0.45)
  // 6. Cards Slide In (0.45 to 0.85)

  // Background & Font Color
  let bgColor = '#f4f4f1';
  let textColorMain = '#272727';
  let textColorSub = 'rgba(39, 39, 39, 0.6)';
  
  if (progress > 0.24) {
    if (progress <= 0.28) {
      // Fast, smooth transition when text hits left
      const p = (progress - 0.24) / 0.04;
      
      const bgR = Math.round(244 + (1 - 244) * p);
      const bgG = Math.round(244 + (62 - 244) * p);
      const bgB = Math.round(241 + (78 - 241) * p);
      bgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

      const tmR = Math.round(39 + (244 - 39) * p);
      const tmG = Math.round(39 + (244 - 39) * p);
      const tmB = Math.round(39 + (241 - 39) * p);
      textColorMain = `rgb(${tmR}, ${tmG}, ${tmB})`;
      textColorSub = `rgba(${tmR}, ${tmG}, ${tmB}, 0.6)`;
    } else {
      // Fully transitioned
      bgColor = '#013e4e';
      textColorMain = '#f4f4f1';
      textColorSub = 'rgba(244, 244, 241, 0.6)';
    }
  }

  // Text Entrance & Exit
  let textOpacity = 1;
  let line1X = 150; // start far right
  let line2X = 150; // start far right
  let textY = 0;

  if (progress <= 0.15) {
    // Line 1 sliding in horizontally from right
    const p = Math.max(0, progress / 0.15);
    line1X = 100 * (1 - p); // Slide in from right (100vw to 0vw)
    line2X = 100; // Line 2 stays hidden right
  } else if (progress <= 0.25) {
    // Line 1 is done, Line 2 sliding in horizontally from right
    line1X = 0;
    const p = (progress - 0.15) / 0.10;
    line2X = 100 * (1 - p); // Slide in from right (100vw to 0vw)
  } else if (progress <= 0.35) {
    // Both text fully visible and in place
    line1X = 0;
    line2X = 0;
  } else if (progress <= 0.60) {
    // Text fades out slowly exactly while the features are sliding in
    const p = (progress - 0.35) / 0.25;
    textOpacity = 1 - p;
    textY = 0; // Removing upwards slide so it just fades in place as requested
    line1X = 0;
    line2X = 0;
  } else {
    // Text is completely gone
    textOpacity = 0;
    line1X = 0;
    line2X = 0;
  }

  // Matrix Choreography
  const xLeft = -180; // px
  const xRight = 180; // px
  const yTop = -135; // px
  const yBottom = 135; // px

  // Defaults (far away offscreen)
  let tlX = -2000, tlY = -2000;
  let trX = 2000, trY = -2000;
  let blX = -2000, blY = 2000;
  let brX = 2000, brY = 2000;
  
  let cardsOpacity = 0;

  if (progress > 0.40) {
    // 1. FLY IN (0.40 -> 0.60): Come from corners into the matrix
    const pIn = Math.min(1, Math.max(0, (progress - 0.40) / 0.20));
    cardsOpacity = pIn;
    tlX = -2000 + pIn * (2000 + xLeft); tlY = -2000 + pIn * (2000 + yTop);
    trX = 2000 - pIn * (2000 - xRight); trY = -2000 + pIn * (2000 + yTop);
    blX = -2000 + pIn * (2000 + xLeft); blY = 2000 - pIn * (2000 - yBottom);
    brX = 2000 - pIn * (2000 - xRight); brY = 2000 - pIn * (2000 - yBottom);
  }

  if (progress > 0.80) {
    // 2. STACK PHASE 1 (0.80 -> 0.90): TL moves down to BL, BR moves up to TR
    const pMove1 = Math.min(1, Math.max(0, (progress - 0.80) / 0.10));
    tlY = yTop + pMove1 * (yBottom - yTop);
    brY = yBottom - pMove1 * (yBottom - yTop);
  }

  if (progress > 0.90) {
    // 3. STACK PHASE 2 (0.90 -> 1.00): Fast snap into exact center (0,0)
    const pMove2 = Math.min(1, Math.max(0, (progress - 0.90) / 0.10));
    tlX = xLeft * (1 - pMove2); tlY = yBottom * (1 - pMove2); 
    blX = xLeft * (1 - pMove2); blY = yBottom * (1 - pMove2);
    trX = xRight * (1 - pMove2); trY = yTop * (1 - pMove2);
    brX = xRight * (1 - pMove2); brY = yTop * (1 - pMove2); 
  }

  const transforms = [
    `translate(-50%, -50%) translate3d(${tlX}px, ${tlY}px, 0)`,
    `translate(-50%, -50%) translate3d(${trX}px, ${trY}px, 0)`,
    `translate(-50%, -50%) translate3d(${blX}px, ${blY}px, 0)`,
    `translate(-50%, -50%) translate3d(${brX}px, ${brY}px, 0)`
  ];

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '300vh' }} // Reduced to 300vh to completely eliminate extra scrolling
    >
      <div 
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden"
        style={{ backgroundColor: bgColor, willChange: 'background-color', transform: 'translate3d(0,0,0)' }}
      >
        <div className="w-full h-full relative flex flex-col justify-center">
          
          {/* Animated Background Pattern */}
          <AnimatedPuzzlePatterns />

          {/* Text Sequence */}
          <div 
            className="absolute inset-0 flex flex-col justify-center pointer-events-none pl-[40px]"
            style={{ 
              opacity: textOpacity, 
              transform: `translate3d(0, ${textY}px, 0)`,
              willChange: 'opacity, transform',
              display: progress > 0.65 ? 'none' : 'flex' 
            }}
          >
            <div className="overflow-hidden w-full flex justify-start">
              <h2
                className="text-[4rem] sm:text-[5.5rem] lg:text-[7.5rem] font-medium leading-[1.05] tracking-tight whitespace-nowrap"
                style={{ transform: `translate3d(${line1X}vw, 0, 0)`, color: textColorMain, willChange: 'transform' }}
              >
                {line1}
              </h2>
            </div>
            <div className="overflow-hidden w-full flex justify-start mt-2">
              <h2
                className="text-[4rem] sm:text-[5.5rem] lg:text-[7.5rem] font-medium leading-[1.05] tracking-tight whitespace-nowrap"
                style={{ transform: `translate3d(${line2X}vw, 0, 0)`, color: textColorSub, willChange: 'transform' }}
              >
                {line2}
              </h2>
            </div>
            <p
              className="mt-8 text-xl max-w-2xl transition-opacity duration-300"
              style={{ 
                opacity: progress >= 0.25 && progress <= 0.4 ? 1 : 0,
                color: textColorSub
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Features Matrix Choreography */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              display: progress < 0.35 ? 'none' : 'flex',
              pointerEvents: progress < 0.35 ? 'none' : 'auto'
            }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              
              return (
                <a
                  key={i}
                  href={feature.href}
                  style={{ 
                    opacity: cardsOpacity, 
                    transform: transforms[i],
                    width: '320px',
                    height: '240px',
                    zIndex: 10 + i,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden' as const
                  }}
                  className={`group absolute left-1/2 top-1/2 bg-white rounded-[20px] p-6 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden will-change-transform`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className={`font-bold text-[#272727] mb-3 transition-colors duration-300 group-hover:text-[#013e4e] text-xl`}>
                    {feature.title}
                  </h3>
                  <p className={`text-[#5a5a5a] leading-relaxed mb-4 flex-grow text-[15px]`}>
                    {feature.desc}
                  </p>
                  <div className={`flex items-center gap-1.5 font-bold text-[#013e4e] mt-4 transition-all duration-300 text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0`}>
                    Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </a>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
}
