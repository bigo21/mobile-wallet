'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-in-right';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
  threshold?: number;
}

export default function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const visibleClass = isVisible ? 'animate-visible' : 'animate-hidden';
  const animationClass = `animate-on-scroll-${animation}`;

  return (
    <div
      ref={ref}
      className={`${animationClass} ${visibleClass} ${className}`}
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
