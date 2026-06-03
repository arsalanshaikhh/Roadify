'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { useSearch } from '@/context/SearchContext';
import type { SearchItem } from '@/context/SearchContext';

export default function SearchModal() {
  const { isOpen, close, items } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = new Fuse(items, {
    keys: ['title', 'description', 'topics'],
    threshold: 0.35,
    minMatchCharLength: 2,
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(items.slice(0, 8));
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, items]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(items.slice(0, 8));
    } else {
      setResults(fuse.search(query).map((r) => r.item).slice(0, 8));
    }
    setSelected(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, results.length - 1));
      if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0));
      if (e.key === 'Enter' && results[selected]) {
        router.push(results[selected].href);
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, results, selected, close, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-xl rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles and skills..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          />
          <kbd className="hidden sm:flex items-center rounded border border-gray-700 px-1.5 py-0.5 text-xs text-gray-500">
            Esc
          </kbd>
        </div>

        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((item, i) => (
              <li key={item.href}>
                <button
                  onClick={() => { router.push(item.href); close(); }}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                    item.type === 'role' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-sky-900/50 text-sky-400'
                  }`}>
                    {item.type === 'role' ? 'Role' : 'Skill'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                  <span className="ml-auto text-gray-600 flex-shrink-0">→</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        <div className="border-t border-gray-800 px-4 py-2 flex gap-4 text-xs text-gray-600">
          <span><kbd className="mr-1 rounded border border-gray-700 px-1 py-0.5">↑↓</kbd>navigate</span>
          <span><kbd className="mr-1 rounded border border-gray-700 px-1 py-0.5">↵</kbd>open</span>
          <span><kbd className="mr-1 rounded border border-gray-700 px-1 py-0.5">Esc</kbd>close</span>
        </div>
      </div>
    </div>
  );
}
