'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'roadify_progress';

interface ProgressContextValue {
  isComplete: (slug: string) => boolean;
  toggle: (slug: string) => void;
  completedSlugs: Set<string>;
}

const ProgressContext = createContext<ProgressContextValue>({
  isComplete: () => false,
  toggle: () => {},
  completedSlugs: new Set(),
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompletedSlugs(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  const toggle = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (slug: string) => completedSlugs.has(slug),
    [completedSlugs]
  );

  return (
    <ProgressContext.Provider value={{ isComplete, toggle, completedSlugs }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
