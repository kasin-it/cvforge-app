"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Returns a debounced version of the callback function.
 * The debounced function delays invoking callback until after `delay` ms
 * have elapsed since the last time the debounced function was invoked.
 */
export function useDebouncedCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}
