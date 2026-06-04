'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopicsChips from '@/components/TopicsChips';
import ResourceCard from '@/components/ResourceCard';
import ResourceFilter from '@/components/ResourceFilter';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';
import BackToTop from '@/components/BackToTop';
import type { Skill, Resource } from '@/lib/types';

type Filter = 'all' | 'free' | 'paid';

interface Props {
  skill: Skill;
  from?: string;
}

export default function SkillPageClient({ skill, from }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const { isComplete, toggle } = useProgress();
  const { showToast } = useToast();
  const done = isComplete(skill.slug);

  const handleToggle = () => {
    const willBeComplete = !done;
    toggle(skill.slug);
    showToast(
      willBeComplete ? `✓ ${skill.title} marked as complete!` : `${skill.title} unmarked`,
      willBeComplete ? 'success' : 'info'
    );
  };

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
    <>
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href={backHref} className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          ← {backLabel}
        </Link>
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            done
              ? 'border-emerald-600 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {done ? '✓ Completed' : 'Mark complete'}
        </button>
      </div>

      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{skill.title}</h1>
        {skill.estimatedHours != null && (
          <span className="mt-1 flex-shrink-0 rounded-full border border-gray-300 dark:border-gray-700 px-3 py-0.5 text-xs text-gray-500 dark:text-gray-400">
            ~{skill.estimatedHours}h to learn
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>

      <div className="my-8 border-t border-gray-200 dark:border-gray-800" />

      {skill.topics.length > 0 && (
        <section className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Topics Covered
          </h2>
          <TopicsChips topics={skill.topics} />
        </section>
      )}

      {skill.prerequisites.length > 0 && (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Resources</h2>
          <ResourceFilter active={filter} onChange={setFilter} />
        </div>
        <div className="space-y-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource: Resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-500">No {filter} resources for this skill yet.</p>
          )}
        </div>
      </section>
    </main>
    <BackToTop />
    </>
  );
}
