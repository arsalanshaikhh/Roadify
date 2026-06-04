'use client';

import { useState } from 'react';
import RoleCard from './RoleCard';
import type { Roadmap, Category, RoadmapStats } from '@/lib/types';

interface Props {
  roadmaps: Roadmap[];
  categories: Category[];
  statsMap: Record<string, RoadmapStats>;
}

const categoryMeta: Record<string, { icon: string; colorClass: string; borderClass: string }> = {
  software: { icon: '🖥️', colorClass: 'text-indigo-600 dark:text-indigo-400', borderClass: 'border-indigo-500' },
  data: { icon: '📊', colorClass: 'text-sky-600 dark:text-sky-400', borderClass: 'border-sky-500' },
  ai: { icon: '🤖', colorClass: 'text-emerald-600 dark:text-emerald-400', borderClass: 'border-emerald-500' },
};

export default function RoleSearch({ roadmaps, categories, statsMap }: Props) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? roadmaps.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : roadmaps;

  return (
    <>
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Filter roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:outline-none shadow-sm"
        />
      </div>

      {categories.map((category) => {
        const roleCards = filtered.filter((r) => r.category === category.id);
        if (roleCards.length === 0) return null;
        const meta = categoryMeta[category.id] ?? categoryMeta.software;

        return (
          <section key={category.id} id={category.id} className="mb-14">
            <div className={`mb-6 flex items-center gap-3 border-b-2 ${meta.borderClass} pb-3`}>
              <span className="text-xl">{meta.icon}</span>
              <h2 className={`text-sm font-bold uppercase tracking-widest ${meta.colorClass}`}>
                {category.label}
              </h2>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${meta.colorClass} bg-gray-100 dark:bg-gray-800`}>
                {roleCards.length} {roleCards.length === 1 ? 'role' : 'roles'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roleCards.map((roadmap) => (
                <RoleCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  categoryColor={category.color}
                  stats={statsMap[roadmap.id] ?? { skillCount: roadmap.nodes.length, freeResourceCount: 0, paidResourceCount: 0, estimatedHours: 0 }}
                />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-gray-400">No roles match &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </>
  );
}
