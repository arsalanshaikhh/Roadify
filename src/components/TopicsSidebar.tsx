'use client';

import { useState } from 'react';
import { useProgress } from '@/context/ProgressContext';
import type { RoadmapNode } from '@/lib/types';

interface Props {
  nodes: RoadmapNode[];
}

const phases = ['foundation', 'core', 'advanced'] as const;

const phaseLabels: Record<string, string> = {
  foundation: 'Foundation',
  core: 'Core',
  advanced: 'Advanced',
};

const phaseLabelColors: Record<string, string> = {
  foundation: 'text-indigo-600 dark:text-indigo-400',
  core: 'text-sky-600 dark:text-sky-400',
  advanced: 'text-emerald-600 dark:text-emerald-400',
};

export default function TopicsSidebar({ nodes }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { isComplete } = useProgress();

  const completedCount = nodes.filter((n) => isComplete(n.id)).length;
  const progressPct = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  const progressBar = (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
        <span>Progress</span>
        <span>{completedCount}/{nodes.length}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );

  const content = (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">All Topics</p>
      {progressBar}
      {phases.map((phase) => {
        const phaseNodes = nodes.filter((n) => n.phase === phase);
        if (phaseNodes.length === 0) return null;
        return (
          <div key={phase}>
            <p className={`mb-2 text-xs font-semibold ${phaseLabelColors[phase]}`}>
              {phaseLabels[phase]}
            </p>
            <ul className="space-y-1">
              {phaseNodes.map((node) => (
                <li key={node.id} className="flex items-center justify-between">
                  <span className={`text-sm ${isComplete(node.id) ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                    {node.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {isComplete(node.id) ? (
                      <span className="text-emerald-500 dark:text-emerald-400 text-xs">✓</span>
                    ) : node.required ? (
                      <span className="rounded bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 text-xs text-red-600 dark:text-red-400">req</span>
                    ) : (
                      <span className="rounded bg-sky-100 dark:bg-sky-900/30 px-1.5 py-0.5 text-xs text-sky-600 dark:text-sky-400">opt</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        >
          Topics {isOpen ? '▲' : '▾'}
          <span className="ml-2 text-xs text-indigo-500 dark:text-indigo-400">{completedCount}/{nodes.length}</span>
        </button>
        {isOpen && <div className="mt-4">{content}</div>}
      </div>
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 lg:block">
        {content}
      </aside>
    </>
  );
}
