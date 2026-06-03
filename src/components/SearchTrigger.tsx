'use client';

import { useSearch } from '@/context/SearchContext';
import { useEffect } from 'react';

export default function SearchTrigger() {
  const { open } = useSearch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <button
      onClick={open}
      className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden sm:flex items-center rounded border border-gray-700 px-1 py-0.5 text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
