'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopicsChips from '@/components/TopicsChips';
import ResourceCard from '@/components/ResourceCard';
import ResourceFilter from '@/components/ResourceFilter';
import type { Skill, Resource } from '@/lib/types';

type Filter = 'all' | 'free' | 'paid';

interface Props {
  skill: Skill;
  from?: string;
}

export default function SkillPageClient({ skill, from }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filteredResources = skill.resources.filter((r: Resource) => {
    if (filter === 'free') return r.free;
    if (filter === 'paid') return !r.free;
    return true;
  });

  const backHref = from ? `/roadmap/${from}` : '/';
  const backLabel = from
    ? from.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'All Roadmaps';

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href={backHref} className="mb-6 block text-sm text-gray-500 hover:text-gray-300">
        ← {backLabel}
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">{skill.title}</h1>
      <p className="mb-6 text-gray-400">{skill.description}</p>

      {skill.topics.length > 0 && (
        <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Topics Covered
          </h2>
          <TopicsChips topics={skill.topics} />
        </section>
      )}

      {skill.prerequisites.length > 0 && (
        <p className="mb-6 text-sm text-gray-500">
          Prerequisites:{' '}
          {skill.prerequisites.map((prereq, i) => (
            <span key={prereq}>
              <Link
                href={`/skill/${prereq}${from ? `?from=${from}` : ''}`}
                className="text-indigo-400 hover:underline"
              >
                {prereq.replace(/-/g, ' ')}
              </Link>
              {i < skill.prerequisites.length - 1 && ' · '}
            </span>
          ))}
        </p>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Resources</h2>
          <ResourceFilter active={filter} onChange={setFilter} />
        </div>
        <div className="space-y-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource: Resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No {filter} resources for this skill yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
