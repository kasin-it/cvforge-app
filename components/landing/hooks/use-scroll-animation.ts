"use client";

import { useEffect, useRef, useState } from "react";

type AnimationOptions = {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
};

export function useScrollAnimation<T extends HTMLElement>(
  options: AnimationOptions = {}
) {
  const { threshold = 0.15, rootMargin = "-50px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
