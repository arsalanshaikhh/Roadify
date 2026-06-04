# UI Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish Roadify's UI with 20 improvements: proper light mode, hero section, footer, role card icons, graph enhancements (minimap, tooltips, completion colours), mobile hamburger nav, confetti on completion, toast notifications, search filter tabs, and recent searches.

**Architecture:** All changes are additive and component-level. Light mode uses Tailwind `dark:` variants applied to every component. New components (Footer, BackToTop, Toast, MobileMenu) are added to the layout or specific pages. Graph enhancements use `@xyflow/react` built-ins. Confetti uses `canvas-confetti`. No new routes or data changes.

**Tech Stack:** Next.js 16, Tailwind CSS v4, `next-themes`, `@xyflow/react`, `canvas-confetti` (new)

---

## File Map

| File | Change |
|---|---|
| `src/app/globals.css` | Expand CSS variables for light/dark theming |
| `src/components/Navbar.tsx` | Light mode colors + mobile hamburger menu |
| `src/components/RoleCard.tsx` | Light mode colors + role icon |
| `src/components/RoleSearch.tsx` | Light mode + enhanced category headers |
| `src/components/ResourceCard.tsx` | Light mode + hover lift |
| `src/components/ResourceFilter.tsx` | Light mode |
| `src/components/TopicsChips.tsx` | Light mode |
| `src/components/TopicsSidebar.tsx` | Light mode |
| `src/components/SkillPageClient.tsx` | Light mode + toast on mark complete + back-to-top |
| `src/components/SkillNode.tsx` | Green bg when complete + hover tooltip |
| `src/components/RoadmapGraph.tsx` | Minimap + animated edges + fit-view button |
| `src/components/SearchModal.tsx` | Category filter tabs + recent searches |
| `src/components/GraphSkeleton.tsx` | Light mode |
| `src/app/roadmap/[role]/page.tsx` | Sticky header + confetti on 100% complete |
| `src/app/page.tsx` | Hero section |
| `src/app/not-found.tsx` | Light mode |
| `src/app/error.tsx` | Light mode |
| `src/components/Footer.tsx` | Create — site footer |
| `src/components/BackToTop.tsx` | Create — floating button |
| `src/components/Toast.tsx` | Create — notification component |
| `src/context/ToastContext.tsx` | Create — toast state |
| `src/app/layout.tsx` | Add Footer + ToastProvider |

All work in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Light Mode — Full Component Theming

**Files:** All component files listed above

The rule: swap hardcoded dark colors for `light:dark:` pairs.

**Color mapping:**
- `bg-gray-950` → `bg-white dark:bg-gray-950`
- `bg-gray-900` → `bg-gray-50 dark:bg-gray-900`
- `bg-gray-800` → `bg-gray-100 dark:bg-gray-800`
- `border-gray-800` → `border-gray-200 dark:border-gray-800`
- `border-gray-700` → `border-gray-300 dark:border-gray-700`
- `text-white` → `text-gray-900 dark:text-white`
- `text-gray-400` → `text-gray-500 dark:text-gray-400`
- `text-gray-500` → `text-gray-400 dark:text-gray-500`
- `text-gray-600` → `text-gray-400 dark:text-gray-600`
- `placeholder-gray-500` → `placeholder-gray-400 dark:placeholder-gray-500`

- [ ] **Step 1: Update `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg-base: #f9fafb;
  --bg-surface: #ffffff;
  --bg-elevated: #f3f4f6;
  --border: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
}

.dark {
  --bg-base: #030712;
  --bg-surface: #111827;
  --bg-elevated: #1f2937;
  --border: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  transition: background-color 0.2s, color 0.2s;
}
```

- [ ] **Step 2: Update `src/components/Navbar.tsx`**

```tsx
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import SearchModal from './SearchModal';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white flex-shrink-0">
          Roadify
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <SearchTrigger />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/#software" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Software
            </Link>
            <Link href="/#data" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Data
            </Link>
            <Link href="/#ai" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              AI & ML
            </Link>
          </div>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
      <SearchModal />
    </nav>
  );
}
```

- [ ] **Step 3: Create `src/components/MobileMenu.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            {[
              { href: '/#software', label: 'Software Engineering' },
              { href: '/#data', label: 'Data' },
              { href: '/#ai', label: 'AI & Machine Learning' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Update `src/components/RoleCard.tsx`**

```tsx
import Link from 'next/link';
import type { Roadmap, RoadmapStats } from '@/lib/types';

const ROLE_ICONS: Record<string, string> = {
  'frontend-engineer': '⚛️',
  'backend-engineer': '🖥️',
  'full-stack': '🔗',
  'devops': '⚙️',
  'mobile-engineer': '📱',
  'security-engineer': '🔒',
  'qa-engineer': '🧪',
  'blockchain-developer': '⛓️',
  'product-manager': '📋',
  'ux-designer': '🎨',
  'data-scientist': '📊',
  'ai-ml-engineer': '🤖',
  'data-engineer': '🛠️',
};

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
  stats: RoadmapStats;
}

export default function RoleCard({ roadmap, categoryColor, stats }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-500 dark:text-indigo-400',
    sky: 'text-sky-500 dark:text-sky-400',
    emerald: 'text-emerald-500 dark:text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-500 dark:text-indigo-400';
  const hoursLabel =
    stats.estimatedHours > 0
      ? stats.estimatedHours >= 100
        ? `~${Math.round(stats.estimatedHours / 30)}mo`
        : `~${stats.estimatedHours}h`
      : null;
  const icon = ROLE_ICONS[roadmap.id] ?? '📌';

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {roadmap.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{roadmap.description}</p>
          <div className={`mt-3 flex items-center gap-3 text-sm font-medium ${accentColor}`}>
            <span>{stats.skillCount} skills</span>
            {stats.freeResourceCount > 0 && <span className="text-gray-300 dark:text-gray-600">·</span>}
            {stats.freeResourceCount > 0 && (
              <span className="text-emerald-500 dark:text-emerald-400">{stats.freeResourceCount} free</span>
            )}
            {hoursLabel && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-gray-400 dark:text-gray-500">{hoursLabel}</span>
              </>
            )}
            <span aria-hidden="true" className="ml-auto">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 5: Update `src/components/ResourceCard.tsx`**

```tsx
import type { Resource } from '@/lib/types';

const typeIcons: Record<string, string> = {
  docs: '📄',
  video: '🎥',
  course: '🎓',
  article: '📝',
};

interface Props {
  resource: Resource;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i}>★</span>;
        if (i === full && half) return <span key={i} className="opacity-50">★</span>;
        return <span key={i} className="opacity-20">★</span>;
      })}
      <span className="ml-1 text-gray-400 dark:text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ResourceCard({ resource }: Props) {
  const domain = new URL(resource.url).hostname.replace('www.', '');

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{resource.title}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {typeIcons[resource.type]} {resource.type} · {domain}
        </p>
        {resource.rating != null && (
          <div className="mt-1">
            <StarRating rating={resource.rating} />
          </div>
        )}
      </div>
      <div className="ml-4 flex items-center gap-3 flex-shrink-0">
        {resource.free ? (
          <span className="rounded bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Free
          </span>
        ) : (
          <span className="rounded bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            Paid
          </span>
        )}
        <span className="text-gray-400 dark:text-gray-500">↗</span>
      </div>
    </a>
  );
}
```

- [ ] **Step 6: Update `src/components/ResourceFilter.tsx`**

```tsx
type Filter = 'all' | 'free' | 'paid';

interface Props {
  active: Filter;
  onChange: (filter: Filter) => void;
}

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

export default function ResourceFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            active === f.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Update `src/components/TopicsChips.tsx`**

```tsx
interface Props {
  topics: string[];
}

export default function TopicsChips({ topics }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <span
          key={topic}
          className="rounded border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Update `src/components/TopicsSidebar.tsx`** — replace all hardcoded dark colors with themed pairs:

Key color changes:
- `border-gray-800` → `border-gray-200 dark:border-gray-800`
- `bg-gray-800` → `bg-gray-200 dark:bg-gray-800`
- `bg-indigo-500` → keep (accent, same in both modes)
- `text-gray-500` → `text-gray-400 dark:text-gray-500`
- `text-gray-300` → `text-gray-700 dark:text-gray-300`
- `bg-red-900/30` → `bg-red-100 dark:bg-red-900/30`
- `text-red-400` → `text-red-600 dark:text-red-400`
- `bg-sky-900/30` → `bg-sky-100 dark:bg-sky-900/30`
- `text-sky-400` → `text-sky-600 dark:text-sky-400`
- `text-emerald-400` → `text-emerald-600 dark:text-emerald-400`

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
          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
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
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs">✓</span>
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
          <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">{completedCount}/{nodes.length}</span>
        </button>
        {isOpen && <div className="mt-4">{content}</div>}
      </div>
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 lg:block">
        {content}
      </aside>
    </>
  );
}
```

- [ ] **Step 9: Update `src/app/not-found.tsx` and `src/app/error.tsx`** — replace `text-white` with `text-gray-900 dark:text-white`, `text-gray-400` with `text-gray-500 dark:text-gray-400`, `border-gray-700` with `border-gray-300 dark:border-gray-700`, `text-gray-300` with `text-gray-600 dark:text-gray-300`.

`src/app/not-found.tsx`:
```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        ← Back to home
      </Link>
    </main>
  );
}
```

`src/app/error.tsx`:
```tsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-500 dark:text-red-400">Error</p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        {process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 10: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 11: Run tests**

```bash
npx vitest run
```
Expected: All 26 tests pass.

- [ ] **Step 12: Commit**

```bash
git add src/app/globals.css src/components/Navbar.tsx src/components/MobileMenu.tsx src/components/RoleCard.tsx src/components/ResourceCard.tsx src/components/ResourceFilter.tsx src/components/TopicsChips.tsx src/components/TopicsSidebar.tsx src/app/not-found.tsx src/app/error.tsx
git commit -m "feat: full light mode theming across all components + mobile hamburger menu + role card icons"
```

---

## Task 2: Hero Section + Category Headers + Footer

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/RoleSearch.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { getAllRoadmaps, getCategories, getRoadmapStats } from '@/lib/content';
import RoleSearch from '@/components/RoleSearch';
import type { RoadmapStats } from '@/lib/types';

export default function Home() {
  const categories = getCategories();
  const roadmaps = getAllRoadmaps();
  const statsMap: Record<string, RoadmapStats> = {};
  for (const roadmap of roadmaps) {
    statsMap[roadmap.id] = getRoadmapStats(roadmap);
  }

  const totalSkills = roadmaps.reduce((sum, r) => sum + r.nodes.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-950/40" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            ✦ Free · No account required · Open source
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Find your path
            <span className="block text-indigo-600 dark:text-indigo-400">in tech</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Curated learning roadmaps for {roadmaps.length} tech roles — with free resources for every skill. No fluff, just signal.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{roadmaps.length}</div>
              <div className="text-gray-500 dark:text-gray-400">Roles</div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSkills}+</div>
              <div className="text-gray-500 dark:text-gray-400">Skills</div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-gray-500 dark:text-gray-400">Resources</div>
            </div>
          </div>
          <a
            href="#roles"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
          >
            Explore Roles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Role Grid */}
      <main id="roles" className="mx-auto max-w-6xl px-6 py-12">
        <RoleSearch roadmaps={roadmaps} categories={categories} statsMap={statsMap} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Update `src/components/RoleSearch.tsx` — enhanced category headers**

```tsx
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
```

- [ ] **Step 3: Create `src/components/Footer.tsx`**

```tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-12 mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Roadify</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Curated learning roadmaps for tech roles — with free resources for every skill.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Categories</div>
            <ul className="space-y-2">
              {[
                { href: '/#software', label: '🖥️ Software Engineering' },
                { href: '/#data', label: '📊 Data' },
                { href: '/#ai', label: '🤖 AI & Machine Learning' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Project</div>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/arsalanshaikhh/Roadify" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  GitHub →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Roadify. Free to use, open to learn.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Add Footer to `src/app/layout.tsx`**

Read the current layout.tsx, then add `import Footer from '@/components/Footer';` at the top and `<Footer />` just before `</SearchProvider>`:

```tsx
// inside RootLayout, after {children} and before </SearchProvider>:
<Footer />
```

- [ ] **Step 5: Run tests + TypeScript check**

```bash
npx tsc --noEmit && npx vitest run
```
Expected: No errors, all 26 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/RoleSearch.tsx src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add hero section, enhanced category headers with icons, and site footer"
```

---

## Task 3: Toast Notifications + Back-to-top + SkillPageClient Updates

**Files:**
- Create: `src/context/ToastContext.tsx`
- Create: `src/components/Toast.tsx`
- Create: `src/components/BackToTop.tsx`
- Modify: `src/components/SkillPageClient.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/context/ToastContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'info') => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  toasts: [],
  removeToast: () => {},
});

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
```

- [ ] **Step 2: Create `src/components/Toast.tsx`**

```tsx
'use client';

import { useToast } from '@/context/ToastContext';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
          }`}
        >
          {toast.type === 'success' && <span>✓</span>}
          {toast.message}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/BackToTop.tsx`**

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
```

- [ ] **Step 4: Update `src/app/layout.tsx` — add ToastProvider and Toast**

Read the current layout.tsx (which has ThemeProvider > ProgressProvider > SearchProvider), then add:
- Import `ToastProvider` from `@/context/ToastContext`
- Import `Toast` from `@/components/Toast`
- Wrap the body content with `<ToastProvider>`
- Add `<Toast />` just before the closing `</ToastProvider>`

The provider nesting should be:
```tsx
<ThemeProvider>
  <ToastProvider>
    <ProgressProvider>
      <SearchProvider items={searchItems}>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
        <Toast />
      </SearchProvider>
    </ProgressProvider>
  </ToastProvider>
</ThemeProvider>
```

- [ ] **Step 5: Update `src/components/SkillPageClient.tsx` — add toast on mark complete + BackToTop**

Read the current file, then add:
1. `import { useToast } from '@/context/ToastContext';`
2. `import BackToTop from '@/components/BackToTop';`
3. Get `showToast` from `useToast()`
4. In the `toggle` call, fire toast after toggling:

```tsx
const handleToggle = () => {
  const willBeComplete = !done;
  toggle(skill.slug);
  showToast(
    willBeComplete
      ? `✓ ${skill.title} marked complete!`
      : `${skill.title} unmarked`,
    willBeComplete ? 'success' : 'info'
  );
};
```

5. Replace `onClick={() => toggle(skill.slug)}` with `onClick={handleToggle}`
6. Add `<BackToTop />` at the very end of the returned JSX (after `</main>`):

```tsx
    <>
      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* ... existing content ... */}
      </main>
      <BackToTop />
    </>
```

- [ ] **Step 6: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run
```
Expected: All 26 tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/context/ToastContext.tsx src/components/Toast.tsx src/components/BackToTop.tsx src/components/SkillPageClient.tsx src/app/layout.tsx
git commit -m "feat: add toast notifications on skill completion and back-to-top button"
```

---

## Task 4: Graph UX — Completion Colors, Minimap, Animated Edges, Tooltip

**Files:**
- Modify: `src/components/SkillNode.tsx`
- Modify: `src/components/RoadmapGraph.tsx`
- Modify: `src/app/roadmap/[role]/page.tsx`

- [ ] **Step 1: Update `src/components/SkillNode.tsx` — green background when complete**

```tsx
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';

interface SkillNodeData extends Record<string, unknown> {
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
  isComplete?: boolean;
}

type SkillNode = Node<SkillNodeData>;

const phaseColors: Record<string, string> = {
  foundation: 'border-indigo-500',
  core: 'border-sky-500',
  advanced: 'border-emerald-500',
};

export default function SkillNode({ data }: NodeProps<SkillNode>) {
  const nodeData = data as SkillNodeData;
  const isComplete = nodeData.isComplete;

  return (
    <div
      title={`${nodeData.label} — click to explore resources`}
      className={`relative rounded-lg border-2 px-3 py-2 text-sm shadow cursor-pointer transition-all ${
        isComplete
          ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
          : `${phaseColors[nodeData.phase]} bg-gray-900 text-white hover:brightness-110`
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600" />
      <div className="flex items-center gap-2">
        {isComplete && <span className="text-emerald-400 text-xs">✓</span>}
        <span className={isComplete ? 'line-through opacity-70' : ''}>{nodeData.label}</span>
        {!isComplete && (nodeData.required ? (
          <span className="text-xs text-red-400">req</span>
        ) : (
          <span className="text-xs text-sky-400">opt</span>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600" />
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/RoadmapGraph.tsx` — add MiniMap, animated edges, fit-view button**

```tsx
'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
  const [rfInstance, setRfInstance] = useState<{ fitView: () => void } | null>(null);

  const flowNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: 'skill',
    position: n.position,
    data: { label: n.label, required: n.required, phase: n.phase, isComplete: isComplete(n.id) },
  }));

  const flowEdges: Edge[] = edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: '#475569', strokeWidth: 1.5 },
  }));

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/skill/${node.id}?from=${fromRole}`);
    },
    [router, fromRole]
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onInit={(instance) => setRfInstance(instance as { fitView: () => void })}
        fitView
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={24} />
        <Controls className="!bg-gray-900 !border-gray-700 !text-gray-300" />
        <MiniMap
          className="!bg-gray-900 !border-gray-700"
          nodeColor={(n) => {
            if ((n.data as { isComplete?: boolean }).isComplete) return '#10b981';
            const phase = (n.data as { phase: string }).phase;
            return phase === 'foundation' ? '#6366f1' : phase === 'core' ? '#0ea5e9' : '#10b981';
          }}
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>
      {rfInstance && (
        <button
          onClick={() => rfInstance.fitView()}
          title="Reset view"
          className="absolute bottom-20 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 hover:text-white hover:border-gray-500 transition-colors shadow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update `src/app/roadmap/[role]/page.tsx` — sticky header + confetti on completion**

First install canvas-confetti:
```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

Then read the current file and replace the client-rendered part. Since the roadmap page is a server component, create a new `RoadmapPageClient.tsx` that wraps the graph and triggers confetti:

Create `src/components/RoadmapPageClient.tsx`:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useProgress } from '@/context/ProgressContext';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';
import RoadmapGraphClient from './RoadmapGraphClient';

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapPageClient({ nodes, edges, fromRole }: Props) {
  const { completedSlugs } = useProgress();
  const firedRef = useRef(false);

  const allComplete = nodes.length > 0 && nodes.every((n) => completedSlugs.has(n.id));

  useEffect(() => {
    if (allComplete && !firedRef.current) {
      firedRef.current = true;
      import('canvas-confetti').then((mod) => {
        mod.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'],
        });
      });
    }
  }, [allComplete]);

  return <RoadmapGraphClient nodes={nodes} edges={edges} fromRole={fromRole} />;
}
```

Then update `src/app/roadmap/[role]/page.tsx` to use `RoadmapPageClient` instead of `RoadmapGraphClient`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoadmap, getAllRoadmaps } from '@/lib/content';
import TopicsSidebar from '@/components/TopicsSidebar';
import RoadmapPageClient from '@/components/RoadmapPageClient';

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
        <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm px-6 py-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{roadmap.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {roadmap.nodes.length} skills · Click any node to explore resources
          </p>
        </div>
        <div className="flex-1">
          <RoadmapPageClient
            nodes={roadmap.nodes}
            edges={roadmap.edges}
            fromRole={roadmap.id}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```
Expected: All 26 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/SkillNode.tsx src/components/RoadmapGraph.tsx src/components/RoadmapPageClient.tsx "src/app/roadmap/[role]/page.tsx" package.json package-lock.json
git commit -m "feat: green completion nodes, animated edges, minimap, confetti on roadmap completion, sticky header"
```

---

## Task 5: Search Modal — Category Tabs + Recent Searches

**Files:**
- Modify: `src/components/SearchModal.tsx`

- [ ] **Step 1: Replace `src/components/SearchModal.tsx` entirely**

```tsx
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

  const fuse = new Fuse(items, {
    keys: ['title', 'description', 'topics'],
    threshold: 0.35,
    minMatchCharLength: 2,
  });

  const filteredItems = tab === 'all' ? items : items.filter((i) => i.type === tab);

  function getResults(q: string): SearchItem[] {
    const source = tab === 'all' ? items : items.filter((i) => i.type === tab);
    if (q.trim().length < 2) return source.slice(0, 8);
    const fuseSrc = new Fuse(source, { keys: ['title', 'description', 'topics'], threshold: 0.35, minMatchCharLength: 2 });
    return fuseSrc.search(q).map((r) => r.item).slice(0, 8);
  }

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTab('all');
      setResults(filteredItems.slice(0, 8));
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
    setResults(getResults(query));
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
      <div className="relative w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
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
              <span className={`rounded-full px-1 text-xs ${tab === t.value ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Recent searches (shown when query is empty) */}
        {query.trim().length < 2 && recent.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Recent</p>
            <div className="flex flex-wrap gap-1.5">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => setQuery(r)}
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run
```
Expected: All 26 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/SearchModal.tsx
git commit -m "feat: add category filter tabs and recent searches to search modal"
```

---

## Task 6: Final Polish — GraphSkeleton Light Mode + SkillPageClient Light Mode

**Files:**
- Modify: `src/components/GraphSkeleton.tsx`
- Modify: `src/components/SkillPageClient.tsx` (light mode colors)

- [ ] **Step 1: Update `src/components/GraphSkeleton.tsx`**

```tsx
export default function GraphSkeleton() {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg px-8">
        <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="flex gap-12">
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex gap-16">
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">Loading roadmap...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update light mode colors in `src/components/SkillPageClient.tsx`**

Replace these class strings (they appear in the current file):
- `text-gray-500 hover:text-gray-300` → `text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`
- `text-2xl font-bold text-white` → `text-2xl font-bold text-gray-900 dark:text-white`
- `text-gray-400` (description) → `text-gray-600 dark:text-gray-400`
- `rounded-xl border border-gray-800 bg-gray-900 p-5` → `rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5`
- `text-xs font-bold uppercase tracking-widest text-gray-400` → `text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400`
- `text-sm text-gray-500` (prerequisites) → `text-sm text-gray-500 dark:text-gray-500`
- `text-sm text-gray-500` (no resources) → same

- [ ] **Step 3: Final TypeScript + test run**

```bash
npx tsc --noEmit && npx vitest run
```
Expected: No errors, all 26 tests pass.

- [ ] **Step 4: Push everything**

```bash
git add src/components/GraphSkeleton.tsx src/components/SkillPageClient.tsx
git commit -m "feat: light mode for skill page and graph skeleton"
git push origin main
```
