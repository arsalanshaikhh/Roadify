'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface SearchItem {
  type: 'role' | 'skill';
  id: string;
  title: string;
  description: string;
  topics?: string;
  href: string;
}

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  items: SearchItem[];
}

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  items: [],
});

export function SearchProvider({ children, items }: { children: ReactNode; items: SearchItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SearchContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), items }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
