# User Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add localStorage-based progress tracking (mark skills as done) and a global search modal (Cmd/Ctrl+K) that searches both roles and skills.

**Architecture:** Progress tracking uses a React Context (`ProgressContext`) shared across the roadmap page's graph and sidebar — no auth needed, state persists in `localStorage`. Global search uses `fuse.js` for fuzzy matching against a search index (roles + skills) built server-side and passed to a client `SearchModal` via a `SearchProvider` in the root layout.

**Tech Stack:** Next.js 16, React Context, `fuse.js`, localStorage

---

## File Map

| File | Action |
|---|---|
| `src/context/ProgressContext.tsx` | Create — progress state + localStorage sync |
| `src/components/ProgressProvider.tsx` | Create — client wrapper for roadmap page |
| `src/components/SkillNode.tsx` | Modify — show checkmark for completed skills |
| `src/components/TopicsSidebar.tsx` | Modify — show progress count |
| `src/components/SkillPageClient.tsx` | Modify — add "Mark complete" toggle button |
| `src/components/RoadmapGraph.tsx` | Modify — pass completion state to SkillNode |
| `src/app/roadmap/[role]/page.tsx` | Modify — wrap in ProgressProvider |
| `src/context/SearchContext.tsx` | Create — search index + modal open state |
| `src/components/SearchModal.tsx` | Create — Cmd+K search modal |
| `src/components/SearchTrigger.tsx` | Create — search button in Navbar |
| `src/components/Navbar.tsx` | Modify — add SearchTrigger |
| `src/app/layout.tsx` | Modify — wrap with SearchProvider |

All files in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Progress Tracking with localStorage

**Files:**
- Create: `src/context/ProgressContext.tsx`
- Create: `src/components/ProgressProvider.tsx`
- Modify: `src/components/SkillNode.tsx`
- Modify: `src/components/TopicsSidebar.tsx`
- Modify: `src/components/SkillPageClient.tsx`
- Modify: `src/components/RoadmapGraph.tsx`
- Modify: `src/app/roadmap/[role]/page.tsx`

- [ ] **Step 1: Create `src/context/ProgressContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'roadify_progress';

interface ProgressContextValue {
  isComplete: (slug: string) => boolean;
  toggle: (slug: string) => void;
  completedSlugs: Set<string>;
}

const ProgressContext = createContext<ProgressContextValue>({
  isComplete: () => false,
  toggle: () => {},
  completedSlugs: new Set(),
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompletedSlugs(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  const toggle = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (slug: string) => completedSlugs.has(slug),
    [completedSlugs]
  );

  return (
    <ProgressContext.Provider value={{ isComplete, toggle, completedSlugs }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
```

- [ ] **Step 2: Create `src/components/ProgressProvider.tsx`**

```tsx
'use client';

import { ProgressProvider } from '@/context/ProgressContext';
import type { ReactNode } from 'react';

export default function ProgressWrapper({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
```

- [ ] **Step 3: Update `src/components/SkillNode.tsx` to show completion state**

```tsx
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

interface SkillNodeData extends Record<string, unknown> {
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
  isComplete?: boolean;
}

const phaseColors: Record<string, string> = {
  foundation: 'border-indigo-500',
  core: 'border-sky-500',
  advanced: 'border-emerald-500',
};

export default function SkillNode({ data }: NodeProps<SkillNodeData>) {
  return (
    <div
      className={`relative rounded-lg border-2 bg-gray-900 px-3 py-2 text-sm text-white shadow transition-opacity ${
        phaseColors[data.phase]
      } ${data.isComplete ? 'opacity-60' : ''}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600" />
      <div className="flex items-center gap-2">
        {data.isComplete && (
          <span className="text-emerald-400 text-xs">✓</span>
        )}
        <span>{data.label}</span>
        {data.required ? (
          <span className="text-xs text-red-400">req</span>
        ) : (
          <span className="text-xs text-sky-400">opt</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600" />
    </div>
  );
}
```

- [ ] **Step 4: Update `src/components/RoadmapGraph.tsx` to pass completion state**

```tsx
'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import SkillNode from './SkillNode';
import { useProgress } from '@/context/ProgressContext';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';

const nodeTypes = { skill: SkillNode };

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraph({ nodes, edges, fromRole }: Props) {
  const router = useRouter();
  const { isComplete } = useProgress();

  const flowNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: 'skill',
    position: n.position,
    data: {
      label: n.label,
      required: n.required,
      phase: n.phase,
      isComplete: isComplete(n.id),
    },
  }));

  const flowEdges: Edge[] = edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    style: { stroke: '#475569' },
  }));

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/skill/${node.id}?from=${fromRole}`);
    },
    [router, fromRole]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={24} />
        <Controls className="!bg-gray-900 !border-gray-700 !text-gray-300" />
      </ReactFlow>
    </div>
  );
}
```

- [ ] **Step 5: Update `src/components/TopicsSidebar.tsx` to show progress counts**

```tsx
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
  foundation: 'text-indigo-400',
  core: 'text-sky-400',
  advanced: 'text-emerald-400',
};

export default function TopicsSidebar({ nodes }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { isComplete } = useProgress();

  const completedCount = nodes.filter((n) => isComplete(n.id)).length;
  const progressPct = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  const progressBar = (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span>{completedCount}/{nodes.length}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-800">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );

  const content = (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">All Topics</p>
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
                  <span className={`text-sm ${isComplete(node.id) ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {node.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {isComplete(node.id) && (
                      <span className="text-emerald-400 text-xs">✓</span>
                    )}
                    {!isComplete(node.id) && (node.required ? (
                      <span className="rounded bg-red-900/30 px-1.5 py-0.5 text-xs text-red-400">req</span>
                    ) : (
                      <span className="rounded bg-sky-900/30 px-1.5 py-0.5 text-xs text-sky-400">opt</span>
                    ))}
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
      <div className="border-b border-gray-800 p-4 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          Topics {isOpen ? '▲' : '▾'}
          <span className="ml-2 text-xs text-indigo-400">{completedCount}/{nodes.length}</span>
        </button>
        {isOpen && <div className="mt-4">{content}</div>}
      </div>
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-800 p-5 lg:block">
        {content}
      </aside>
    </>
  );
}
```

- [ ] **Step 6: Update `src/components/SkillPageClient.tsx` to add "Mark complete" button**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopicsChips from '@/components/TopicsChips';
import ResourceCard from '@/components/ResourceCard';
import ResourceFilter from '@/components/ResourceFilter';
import { useProgress } from '@/context/ProgressContext';
import type { Skill, Resource } from '@/lib/types';

type Filter = 'all' | 'free' | 'paid';

interface Props {
  skill: Skill;
  from?: string;
}

export default function SkillPageClient({ skill, from }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const { isComplete, toggle } = useProgress();
  const done = isComplete(skill.slug);

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
      <div className="flex items-center justify-between mb-6">
        <Link href={backHref} className="block text-sm text-gray-500 hover:text-gray-300">
          ← {backLabel}
        </Link>
        <button
          onClick={() => toggle(skill.slug)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            done
              ? 'border-emerald-700 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
              : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
          }`}
        >
          {done ? '✓ Completed' : 'Mark complete'}
        </button>
      </div>

      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{skill.title}</h1>
        {skill.estimatedHours != null && (
          <span className="mt-1 flex-shrink-0 rounded-full border border-gray-700 px-3 py-0.5 text-xs text-gray-400">
            ~{skill.estimatedHours}h to learn
          </span>
        )}
      </div>
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
```

- [ ] **Step 7: Move ProgressProvider to root layout so skill pages also have access**

`ProgressContext` is needed on both the roadmap page (graph + sidebar) AND the skill page (mark complete button). Wrapping only the roadmap page would mean the skill page has no provider — `toggle()` would be a no-op. Move it to the root layout instead.

Update `src/app/layout.tsx` — add `ProgressProvider` import and wrap children:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import { SearchProvider } from '@/context/SearchContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getAllRoadmaps, getAllSkillSlugs, getSkill } from '@/lib/content';
import type { SearchItem } from '@/context/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Roadify',
    default: 'Roadify — Find your learning path',
  },
  description:
    'Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill.',
  openGraph: { siteName: 'Roadify', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

function buildSearchIndex(): SearchItem[] {
  const roadmaps = getAllRoadmaps();
  const skillSlugs = getAllSkillSlugs();
  const roleItems: SearchItem[] = roadmaps.map((r) => ({
    type: 'role', id: r.id, title: r.title, description: r.description, href: `/roadmap/${r.id}`,
  }));
  const skillItems: SearchItem[] = skillSlugs
    .map((slug) => getSkill(slug))
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .map((s) => ({
      type: 'skill', id: s.slug, title: s.title, description: s.description,
      topics: s.topics.join(' '), href: `/skill/${s.slug}`,
    }));
  return [...roleItems, ...skillItems];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <ProgressProvider>
            <SearchProvider items={searchItems}>
              <Navbar />
              {children}
              <Analytics />
              <SpeedInsights />
            </SearchProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Also update `src/app/roadmap/[role]/page.tsx` to remove `ProgressWrapper` (no longer needed):

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoadmap, getAllRoadmaps } from '@/lib/content';
import TopicsSidebar from '@/components/TopicsSidebar';
import RoadmapGraphClient from '@/components/RoadmapGraphClient';

interface Props {
  params: Promise<{ role: string }>;
}

export function generateStaticParams() {
  return getAllRoadmaps().map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const roadmap = getRoadmap(role);
  if (!roadmap) return {};
  return {
    title: roadmap.title,
    description: roadmap.description,
    openGraph: { title: roadmap.title, description: roadmap.description },
  };
}

export default async function RoadmapPage({ params }: Props) {
  const { role } = await params;
  const roadmap = getRoadmap(role);
  if (!roadmap) notFound();

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:flex-row">
      <TopicsSidebar nodes={roadmap.nodes} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-bold text-white">{roadmap.title}</h1>
          <p className="text-sm text-gray-400">
            {roadmap.nodes.length} skills · Click any node to explore resources
          </p>
        </div>
        <div className="flex-1">
          <RoadmapGraphClient nodes={roadmap.nodes} edges={roadmap.edges} fromRole={roadmap.id} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 9: Test progress tracking**

1. Open http://localhost:3001/roadmap/frontend-engineer
2. Click "HTML & CSS" node → opens skill page
3. Click "Mark complete" button → button turns green with "✓ Completed"
4. Go back to roadmap → sidebar shows "1/3" progress bar + strikethrough on HTML & CSS
5. Reload page → progress persists (stored in localStorage)

- [ ] **Step 10: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 11: Commit**

```bash
git add src/context/ProgressContext.tsx src/components/ProgressProvider.tsx src/components/SkillNode.tsx src/components/TopicsSidebar.tsx src/components/SkillPageClient.tsx src/components/RoadmapGraph.tsx "src/app/roadmap/[role]/page.tsx"
git commit -m "feat: add localStorage progress tracking with completion toggle and progress bar"
```

---

## Task 2: Global Search (Cmd+K)

**Files:**
- Install: `fuse.js`
- Create: `src/context/SearchContext.tsx`
- Create: `src/components/SearchModal.tsx`
- Create: `src/components/SearchTrigger.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install fuse.js**

```bash
npm install fuse.js
```

- [ ] **Step 2: Create `src/context/SearchContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface SearchItem {
  type: 'role' | 'skill';
  id: string;
  title: string;
  description: string;
  topics?: string;
  href: string;
}

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  items: SearchItem[];
}

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  items: [],
});

export function SearchProvider({
  children,
  items,
}: {
  children: ReactNode;
  items: SearchItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SearchContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), items }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
```

- [ ] **Step 3: Create `src/components/SearchModal.tsx`**

```tsx
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
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : (() => {})();
      }
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
      onClick={(e) => e.target === e.currentTarget && close()}
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
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-gray-700 px-1.5 py-0.5 text-xs text-gray-500">
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
                    item.type === 'role'
                      ? 'bg-indigo-900/50 text-indigo-400'
                      : 'bg-sky-900/50 text-sky-400'
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
```

- [ ] **Step 4: Create `src/components/SearchTrigger.tsx`**

```tsx
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
      <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-gray-700 px-1 py-0.5 text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
```

- [ ] **Step 5: Update `src/components/Navbar.tsx` to include SearchTrigger and SearchModal**

```tsx
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import SearchModal from './SearchModal';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 dark:bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-white flex-shrink-0">
          Roadify
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <SearchTrigger />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 text-sm text-gray-400">
            <Link href="/#software" className="hover:text-white transition-colors">
              Software
            </Link>
            <Link href="/#data" className="hover:text-white transition-colors">
              Data
            </Link>
            <Link href="/#ai" className="hover:text-white transition-colors">
              AI & ML
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <SearchModal />
    </nav>
  );
}
```

- [ ] **Step 6: Update `src/app/layout.tsx` to provide search data**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import { SearchProvider } from '@/context/SearchContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getAllRoadmaps, getAllSkillSlugs, getSkill } from '@/lib/content';
import type { SearchItem } from '@/context/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Roadify',
    default: 'Roadify — Find your learning path',
  },
  description:
    'Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill.',
  openGraph: {
    siteName: 'Roadify',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

function buildSearchIndex(): SearchItem[] {
  const roadmaps = getAllRoadmaps();
  const skillSlugs = getAllSkillSlugs();

  const roleItems: SearchItem[] = roadmaps.map((r) => ({
    type: 'role',
    id: r.id,
    title: r.title,
    description: r.description,
    href: `/roadmap/${r.id}`,
  }));

  const skillItems: SearchItem[] = skillSlugs
    .map((slug) => getSkill(slug))
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .map((s) => ({
      type: 'skill',
      id: s.slug,
      title: s.title,
      description: s.description,
      topics: s.topics.join(' '),
      href: `/skill/${s.slug}`,
    }));

  return [...roleItems, ...skillItems];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <SearchProvider items={searchItems}>
            <Navbar />
            {children}
            <Analytics />
            <SpeedInsights />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 8: Test global search**

1. Open http://localhost:3001
2. Press Cmd+K (Mac) or Ctrl+K (Windows) — search modal should appear
3. Type "react" — should show React role and React skill in results
4. Type "python" — should show Python skill and Data Scientist role
5. Press Esc — modal closes
6. Arrow keys navigate results, Enter opens the selected item

- [ ] **Step 9: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/context/SearchContext.tsx src/components/SearchModal.tsx src/components/SearchTrigger.tsx src/components/Navbar.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add global search modal (Cmd+K) with fuzzy search across roles and skills"
```
