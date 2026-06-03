'use client';

import { useState } from 'react';
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
  foundation: 'text-indigo-400',
  core: 'text-sky-400',
  advanced: 'text-emerald-400',
};

export default function TopicsSidebar({ nodes }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const content = (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">All Topics</p>
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
                  <span className="text-sm text-gray-300">{node.label}</span>
                  {node.required ? (
                    <span className="rounded bg-red-900/30 px-1.5 py-0.5 text-xs text-red-400">
                      req
                    </span>
                  ) : (
                    <span className="rounded bg-sky-900/30 px-1.5 py-0.5 text-xs text-sky-400">
                      opt
                    </span>
                  )}
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
      {/* Mobile toggle */}
      <div className="border-b border-gray-800 p-4 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          Topics {isOpen ? '▲' : '▾'}
        </button>
        {isOpen && <div className="mt-4">{content}</div>}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-800 p-5 lg:block">
        {content}
      </aside>
    </>
  );
}
