"use client";

import { useEffect, useRef } from "react";

type TimeoutCallback = () => void;

export function useTimeout(callback: TimeoutCallback, delay: number | null) {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef<TimeoutCallback | null>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "number") {
      timeoutRef.current = window.setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current();
        }
      }, delay);

      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [delay]);

  const clear = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const reset = (newDelay: number | null) => {
    clear();
    if (typeof newDelay === "number") {
      timeoutRef.current = window.setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current();
        }
      }, newDelay);
    }
  };

  return { clear, reset };
}
