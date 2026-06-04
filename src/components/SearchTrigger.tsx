'use client';

import { useSearch } from '@/context/SearchContext';
import { useEffect } from 'react';

export default function SearchTrigger() {
  const { toggle } = useSearch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return (
    <button
      onClick={toggle}
      className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-400 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="flex-1 text-left text-gray-400 dark:text-gray-500">Search roles & skills...</span>
      <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
        ⌘K
      </kbd>
    </button>
  );
}
