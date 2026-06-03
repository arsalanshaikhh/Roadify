'use client';

import { useState } from 'react';
import RoleCard from './RoleCard';
import type { Roadmap, Category } from '@/lib/types';

interface Props {
  roadmaps: Roadmap[];
  categories: Category[];
}

const labelColorMap: Record<string, string> = {
  indigo: 'text-indigo-400',
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
};

export default function RoleSearch({ roadmaps, categories }: Props) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? roadmaps.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : roadmaps;

  return (
    <>
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {categories.map((category) => {
        const roleCards = filtered.filter((r) => r.category === category.id);
        if (roleCards.length === 0) return null;
        const labelColor = labelColorMap[category.color] ?? 'text-indigo-400';

        return (
          <section key={category.id} id={category.id} className="mb-12">
            <h2 className={`mb-4 text-xs font-bold uppercase tracking-widest ${labelColor}`}>
              {category.label}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roleCards.map((roadmap) => (
                <RoleCard key={roadmap.id} roadmap={roadmap} categoryColor={category.color} />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500">No roles match &ldquo;{query}&rdquo;.</p>
      )}
    </>
  );
}
