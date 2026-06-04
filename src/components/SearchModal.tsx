'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { useSearch } from '@/context/SearchContext';
import type { SearchItem } from '@/context/SearchContext';

type FilterTab = 'all' | 'role' | 'skill';
const RECENT_KEY = 'roadify_recent_searches';
const MAX_RECENT = 5;

export default function SearchModal() {
  const { isOpen, close, items } = useSearch();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function getResults(q: string, currentTab: FilterTab): SearchItem[] {
    const source = currentTab === 'all' ? items : items.filter((i) => i.type === currentTab);
    if (q.trim().length < 2) return source.slice(0, 8);
    const f = new Fuse(source, { keys: ['title', 'description', 'topics'], threshold: 0.35, minMatchCharLength: 2 });
    return f.search(q).map((r) => r.item).slice(0, 8);
  }

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTab('all');
      setResults(items.slice(0, 8));
      setSelected(0);
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) setRecent(JSON.parse(stored));
      } catch {}
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setResults(getResults(query, tab));
    setSelected(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tab]);

  function navigate(href: string, title: string) {
    setRecent((prev) => {
      const next = [title, ...prev.filter((r) => r !== title)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    router.push(href);
    close();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, results.length - 1));
      if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0));
      if (e.key === 'Enter' && results[selected]) navigate(results[selected].href, results[selected].title);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, results, selected, close]);

  if (!isOpen) return null;

  const tabs: { value: FilterTab; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: items.length },
    { value: 'role', label: 'Roles', count: items.filter((i) => i.type === 'role').length },
    { value: 'skill', label: 'Skills', count: items.filter((i) => i.type === 'skill').length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles and skills..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          />
          <kbd className="hidden sm:flex items-center rounded border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
            Esc
          </kbd>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 dark:border-gray-800 px-4 py-2">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === t.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1 text-xs ${tab === t.value ? 'bg-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Recent searches — shown when query is empty */}
        {query.trim().length < 2 && recent.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide font-medium">Recent</p>
            <div className="flex flex-wrap gap-1.5">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => setQuery(r)}
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-72 overflow-y-auto py-2">
            {results.map((item, i) => (
              <li key={item.href}>
                <button
                  onClick={() => navigate(item.href, item.title)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                    item.type === 'role'
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400'
                  }`}>
                    {item.type === 'role' ? 'Role' : 'Skill'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.description}</p>
                  </div>
                  <span className="ml-auto text-gray-300 dark:text-gray-600 flex-shrink-0 text-xs">↵</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">No results for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {/* Footer hints */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex gap-4 text-xs text-gray-400 dark:text-gray-600">
          <span><kbd className="mr-1 rounded border border-gray-200 dark:border-gray-700 px-1 py-0.5">↑↓</kbd>navigate</span>
          <span><kbd className="mr-1 rounded border border-gray-200 dark:border-gray-700 px-1 py-0.5">↵</kbd>open</span>
          <span><kbd className="mr-1 rounded border border-gray-200 dark:border-gray-700 px-1 py-0.5">Esc</kbd>close</span>
        </div>
      </div>
    </div>
  );
}
