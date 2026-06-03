# Content Model Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `estimatedHours` per skill and `rating` per resource to the data model, show roadmap stats on role cards and skill pages, and add 6 new roles (Mobile, Security, QA, Blockchain, Product Manager, UX Designer).

**Architecture:** Extend `types.ts` with optional fields, update `content.ts` with a `getRoadmapStats` helper, update display components, then add content files. All changes are backward-compatible — existing MDX files without the new fields still parse correctly.

**Tech Stack:** TypeScript, gray-matter, Next.js 16 App Router

---

## File Map

| File | Action |
|---|---|
| `src/lib/types.ts` | Add `estimatedHours?: number` to `SkillFrontmatter`, `rating?: number` to `Resource` |
| `src/lib/content.ts` | Add `getRoadmapStats()` helper |
| `src/lib/content.test.ts` | Tests for `getRoadmapStats` |
| `src/components/RoleCard.tsx` | Show free/paid counts + estimated hours |
| `src/components/ResourceCard.tsx` | Show star rating if present |
| `src/components/SkillPageClient.tsx` | Show estimated hours badge |
| `src/app/page.tsx` | Pass stats to RoleCard |
| `content/skills/*.mdx` | Add `estimatedHours` + resource `rating` fields |
| `content/roadmaps/mobile-engineer.json` | New role |
| `content/roadmaps/security-engineer.json` | New role |
| `content/roadmaps/qa-engineer.json` | New role |
| `content/roadmaps/blockchain-developer.json` | New role |
| `content/roadmaps/product-manager.json` | New role |
| `content/roadmaps/ux-designer.json` | New role |
| `content/skills/react-native.mdx` | New skill |
| `content/skills/flutter.mdx` | New skill |
| `content/skills/cybersecurity-fundamentals.mdx` | New skill |
| `content/skills/penetration-testing.mdx` | New skill |
| `content/skills/qa-testing.mdx` | New skill |
| `content/skills/selenium.mdx` | New skill |
| `content/skills/solidity.mdx` | New skill |
| `content/skills/web3.mdx` | New skill |
| `content/skills/product-strategy.mdx` | New skill |
| `content/skills/user-research.mdx` | New skill |
| `content/skills/figma.mdx` | New skill |
| `content/skills/design-systems.mdx` | New skill |

All files in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Extend Types + Content Helpers (TDD)

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`

- [ ] **Step 1: Write failing tests for `getRoadmapStats`**

Add to `src/lib/content.test.ts` (after existing tests):

```typescript
import { getRoadmapStats } from './content';
import type { Roadmap } from './types';

// Mock a minimal roadmap that references existing skill files
const TEST_ROADMAP: Roadmap = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Test',
  nodes: [
    { id: 'html-css', label: 'HTML & CSS', required: true, phase: 'foundation', position: { x: 0, y: 0 } },
  ],
  edges: [],
};

describe('getRoadmapStats', () => {
  it('returns skillCount equal to node count', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(stats.skillCount).toBe(1);
  });

  it('returns non-negative freeResourceCount', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(stats.freeResourceCount).toBeGreaterThanOrEqual(0);
  });

  it('returns estimatedHours as a number', () => {
    const stats = getRoadmapStats(TEST_ROADMAP);
    expect(typeof stats.estimatedHours).toBe('number');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/lib/content.test.ts
```
Expected: FAIL — "getRoadmapStats is not a function"

- [ ] **Step 3: Update `src/lib/types.ts`**

```typescript
export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface RoadmapNode {
  id: string;
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
  position: { x: number; y: number };
}

export interface RoadmapEdge {
  source: string;
  target: string;
}

export interface Roadmap {
  id: string;
  title: string;
  category: string;
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'docs' | 'video' | 'course' | 'article';
  free: boolean;
  rating?: number;
}

export interface SkillFrontmatter {
  title: string;
  description: string;
  topics: string[];
  prerequisites: string[];
  resources: Resource[];
  estimatedHours?: number;
}

export interface Skill extends SkillFrontmatter {
  slug: string;
  content: string;
}

export interface RoadmapStats {
  skillCount: number;
  freeResourceCount: number;
  paidResourceCount: number;
  estimatedHours: number;
}
```

- [ ] **Step 4: Update `src/lib/content.ts` — add `getRoadmapStats`**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Roadmap, Skill, SkillFrontmatter, Category, RoadmapStats } from './types';

const contentDir = path.join(process.cwd(), 'content');

export function parseSkillContent(slug: string, raw: string): Skill {
  const { data, content } = matter(raw);
  return { slug, ...(data as SkillFrontmatter), content };
}

export function parseRoadmapContent(json: string): Roadmap {
  return JSON.parse(json) as Roadmap;
}

export function getCategories(): Category[] {
  const raw = fs.readFileSync(path.join(contentDir, 'categories.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getAllRoadmaps(): Roadmap[] {
  const dir = path.join(contentDir, 'roadmaps');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => parseRoadmapContent(fs.readFileSync(path.join(dir, f), 'utf-8')));
}

export function getRoadmap(id: string): Roadmap | null {
  const filePath = path.join(contentDir, 'roadmaps', `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return parseRoadmapContent(fs.readFileSync(filePath, 'utf-8'));
}

export function getSkill(slug: string): Skill | null {
  const filePath = path.join(contentDir, 'skills', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseSkillContent(slug, fs.readFileSync(filePath, 'utf-8'));
}

export function getAllSkillSlugs(): string[] {
  const dir = path.join(contentDir, 'skills');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}

export function getRoadmapStats(roadmap: Roadmap): RoadmapStats {
  let freeResourceCount = 0;
  let paidResourceCount = 0;
  let estimatedHours = 0;

  for (const node of roadmap.nodes) {
    const skill = getSkill(node.id);
    if (!skill) continue;
    for (const resource of skill.resources) {
      if (resource.free) freeResourceCount++;
      else paidResourceCount++;
    }
    if (skill.estimatedHours) estimatedHours += skill.estimatedHours;
  }

  return {
    skillCount: roadmap.nodes.length,
    freeResourceCount,
    paidResourceCount,
    estimatedHours,
  };
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run src/lib/content.test.ts
```
Expected: All tests PASS (original 9 + new 3 = 12 total).

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/content.ts src/lib/content.test.ts
git commit -m "feat: add estimatedHours, resource rating types, and getRoadmapStats helper"
```

---

## Task 2: Update RoleCard to Show Stats

**Files:**
- Modify: `src/components/RoleCard.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update `src/components/RoleCard.tsx`**

```tsx
import Link from 'next/link';
import type { Roadmap, RoadmapStats } from '@/lib/types';

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
  stats: RoadmapStats;
}

export default function RoleCard({ roadmap, categoryColor, stats }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-400';
  const hoursLabel =
    stats.estimatedHours > 0
      ? stats.estimatedHours >= 100
        ? `~${Math.round(stats.estimatedHours / 30)}mo`
        : `~${stats.estimatedHours}h`
      : null;

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-600 transition-colors"
    >
      <h3 className="font-semibold text-white">{roadmap.title}</h3>
      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{roadmap.description}</p>
      <div className={`mt-3 flex items-center gap-3 text-sm font-medium ${accentColor}`}>
        <span>{stats.skillCount} skills</span>
        {stats.freeResourceCount > 0 && (
          <span className="text-gray-500">·</span>
        )}
        {stats.freeResourceCount > 0 && (
          <span className="text-emerald-400">{stats.freeResourceCount} free</span>
        )}
        {hoursLabel && (
          <>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">{hoursLabel}</span>
          </>
        )}
        <span aria-hidden="true" className="ml-auto">→</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`**

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">Find your learning path</h1>
        <p className="mt-3 text-gray-400">
          Pick a role to explore a curated roadmap with resources
        </p>
      </div>
      <RoleSearch roadmaps={roadmaps} categories={categories} statsMap={statsMap} />
    </main>
  );
}
```

- [ ] **Step 3: Update `src/components/RoleSearch.tsx`**

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

const labelColorMap: Record<string, string> = {
  indigo: 'text-indigo-400',
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
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
        <p className="text-center text-gray-500">No roles match &ldquo;{query}&rdquo;.</p>
      )}
    </>
  );
}
```

- [ ] **Step 4: Update RoleCard test to include stats prop**

In `src/components/RoleCard.test.tsx`, update the render call to include the new required `stats` prop:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoleCard from './RoleCard';
import type { Roadmap, RoadmapStats } from '@/lib/types';

const roadmap: Roadmap = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Build interactive UIs for the web',
  nodes: [
    { id: 'html', label: 'HTML', required: true, phase: 'foundation', position: { x: 0, y: 0 } },
    { id: 'js', label: 'JS', required: true, phase: 'core', position: { x: 0, y: 1 } },
  ],
  edges: [],
};

const stats: RoadmapStats = {
  skillCount: 2,
  freeResourceCount: 5,
  paidResourceCount: 1,
  estimatedHours: 120,
};

describe('RoleCard', () => {
  it('renders the role title', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" stats={stats} />);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" stats={stats} />);
    expect(screen.getByText('Build interactive UIs for the web')).toBeInTheDocument();
  });

  it('renders the skill count', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" stats={stats} />);
    expect(screen.getByText('2 skills')).toBeInTheDocument();
  });

  it('links to the roadmap page', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" stats={stats} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/roadmap/frontend-engineer');
  });

  it('shows free resource count', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" stats={stats} />);
    expect(screen.getByText('5 free')).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/RoleCard.tsx src/components/RoleSearch.tsx src/app/page.tsx src/components/RoleCard.test.tsx
git commit -m "feat: show roadmap stats (free resources, estimated hours) on role cards"
```

---

## Task 3: Show Estimated Hours + Ratings on Skill Page

**Files:**
- Modify: `src/components/SkillPageClient.tsx`
- Modify: `src/components/ResourceCard.tsx`

- [ ] **Step 1: Update `src/components/ResourceCard.tsx` to show rating**

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
      <span className="ml-1 text-gray-500">{rating.toFixed(1)}</span>
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
      className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-600 transition-colors"
    >
      <div>
        <p className="font-medium text-white">{resource.title}</p>
        <p className="mt-1 text-xs text-gray-500">
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
          <span className="rounded bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
            Free
          </span>
        ) : (
          <span className="rounded bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-400">
            Paid
          </span>
        )}
        <span className="text-gray-500">↗</span>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Update `src/components/SkillPageClient.tsx` to show estimated hours**

Add the estimated hours badge right after the description (after the `<p className="mb-6 text-gray-400">` line):

```tsx
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

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/SkillPageClient.tsx src/components/ResourceCard.tsx
git commit -m "feat: show estimated hours on skill page and star ratings on resources"
```

---

## Task 4: Add estimatedHours to All Skill MDX Files

**Files:** All 30 files in `content/skills/`

- [ ] **Step 1: Add `estimatedHours` to each skill file**

For each file, add `estimatedHours: N` to the frontmatter (after `prerequisites:`). Use these values:

| Skill file | estimatedHours |
|---|---|
| html-css.mdx | 40 |
| javascript.mdx | 80 |
| react.mdx | 60 |
| nodejs.mdx | 50 |
| databases.mdx | 40 |
| rest-apis.mdx | 30 |
| authentication.mdx | 25 |
| docker.mdx | 30 |
| testing-backend.mdx | 30 |
| linux.mdx | 20 |
| git.mdx | 15 |
| ci-cd.mdx | 25 |
| kubernetes.mdx | 50 |
| cloud.mdx | 60 |
| monitoring.mdx | 30 |
| python.mdx | 60 |
| statistics.mdx | 50 |
| pandas-numpy.mdx | 40 |
| data-visualization.mdx | 30 |
| machine-learning.mdx | 80 |
| deep-learning.mdx | 80 |
| sql.mdx | 35 |
| llms.mdx | 50 |
| mlops.mdx | 40 |
| vector-databases.mdx | 20 |
| ai-agents.mdx | 30 |
| data-pipelines.mdx | 35 |
| cloud-data.mdx | 30 |
| spark.mdx | 40 |
| streaming.mdx | 35 |

Example — in `content/skills/react.mdx`, after `prerequisites:` block, add:
```yaml
estimatedHours: 60
```

- [ ] **Step 2: Add `rating` to top 2 resources in each skill file**

For each skill, add `rating: 4.8` (or similar) to the first two resources. Use these ratings for common resources:

- Official Docs (MDN, React.dev, etc.): `rating: 4.9`
- freeCodeCamp full courses: `rating: 4.7`
- The Odin Project: `rating: 4.8`
- Traversy Media / Net Ninja: `rating: 4.6`
- CS50 Harvard courses: `rating: 4.9`
- Kaggle courses: `rating: 4.7`
- 3Blue1Brown: `rating: 4.9`
- Andrej Karpathy: `rating: 4.9`
- Google ML Crash Course: `rating: 4.7`

Example in `content/skills/react.mdx`:
```yaml
resources:
  - title: React Official Docs
    url: https://react.dev
    type: docs
    free: true
    rating: 4.9
  - title: Full React Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=bMknfKXIFA8
    type: video
    free: true
    rating: 4.7
```

- [ ] **Step 3: Verify the dev server renders skill pages correctly**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/react
```
Expected: `200`

Open http://localhost:3001/skill/react — should show `~60h to learn` badge and star ratings on resources.

- [ ] **Step 4: Commit**

```bash
git add content/skills/
git commit -m "content: add estimatedHours and resource ratings to all skill files"
```

---

## Task 5: Add 6 New Roles

**Files:** New files in `content/roadmaps/` and `content/skills/`

- [ ] **Step 1: Create `content/roadmaps/mobile-engineer.json`**

```json
{
  "id": "mobile-engineer",
  "title": "Mobile Engineer",
  "category": "software",
  "description": "Build native and cross-platform mobile apps for iOS and Android",
  "nodes": [
    { "id": "javascript", "label": "JavaScript", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "react", "label": "React", "required": true, "phase": "foundation", "position": { "x": 250, "y": 100 } },
    { "id": "react-native", "label": "React Native", "required": true, "phase": "core", "position": { "x": 100, "y": 220 } },
    { "id": "flutter", "label": "Flutter", "required": false, "phase": "core", "position": { "x": 400, "y": 220 } },
    { "id": "mobile-ux", "label": "Mobile UX Patterns", "required": true, "phase": "core", "position": { "x": 250, "y": 340 } },
    { "id": "app-store", "label": "App Store Deployment", "required": true, "phase": "advanced", "position": { "x": 250, "y": 460 } }
  ],
  "edges": [
    { "source": "javascript", "target": "react" },
    { "source": "react", "target": "react-native" },
    { "source": "react", "target": "flutter" },
    { "source": "react-native", "target": "mobile-ux" },
    { "source": "flutter", "target": "mobile-ux" },
    { "source": "mobile-ux", "target": "app-store" }
  ]
}
```

- [ ] **Step 2: Create `content/roadmaps/security-engineer.json`**

```json
{
  "id": "security-engineer",
  "title": "Security Engineer",
  "category": "software",
  "description": "Protect systems and data — vulnerability assessment, ethical hacking, and security architecture",
  "nodes": [
    { "id": "linux", "label": "Linux & Shell", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "networking", "label": "Networking Fundamentals", "required": true, "phase": "foundation", "position": { "x": 250, "y": 100 } },
    { "id": "cybersecurity-fundamentals", "label": "Security Fundamentals", "required": true, "phase": "core", "position": { "x": 100, "y": 220 } },
    { "id": "penetration-testing", "label": "Penetration Testing", "required": true, "phase": "core", "position": { "x": 400, "y": 220 } },
    { "id": "cloud", "label": "Cloud Security", "required": false, "phase": "advanced", "position": { "x": 250, "y": 340 } }
  ],
  "edges": [
    { "source": "linux", "target": "networking" },
    { "source": "networking", "target": "cybersecurity-fundamentals" },
    { "source": "networking", "target": "penetration-testing" },
    { "source": "cybersecurity-fundamentals", "target": "cloud" },
    { "source": "penetration-testing", "target": "cloud" }
  ]
}
```

- [ ] **Step 3: Create `content/roadmaps/qa-engineer.json`**

```json
{
  "id": "qa-engineer",
  "title": "QA / Testing Engineer",
  "category": "software",
  "description": "Ensure software quality through manual and automated testing strategies",
  "nodes": [
    { "id": "testing-fundamentals", "label": "Testing Fundamentals", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "javascript", "label": "JavaScript", "required": true, "phase": "foundation", "position": { "x": 250, "y": 100 } },
    { "id": "qa-testing", "label": "Test Automation", "required": true, "phase": "core", "position": { "x": 100, "y": 220 } },
    { "id": "selenium", "label": "Selenium / Playwright", "required": true, "phase": "core", "position": { "x": 400, "y": 220 } },
    { "id": "ci-cd", "label": "CI/CD Integration", "required": false, "phase": "advanced", "position": { "x": 250, "y": 340 } }
  ],
  "edges": [
    { "source": "testing-fundamentals", "target": "javascript" },
    { "source": "javascript", "target": "qa-testing" },
    { "source": "javascript", "target": "selenium" },
    { "source": "qa-testing", "target": "ci-cd" },
    { "source": "selenium", "target": "ci-cd" }
  ]
}
```

- [ ] **Step 4: Create `content/roadmaps/blockchain-developer.json`**

```json
{
  "id": "blockchain-developer",
  "title": "Blockchain Developer",
  "category": "software",
  "description": "Build decentralized applications and smart contracts on blockchain platforms",
  "nodes": [
    { "id": "javascript", "label": "JavaScript", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "solidity", "label": "Solidity", "required": true, "phase": "core", "position": { "x": 100, "y": 120 } },
    { "id": "web3", "label": "Web3 & DApps", "required": true, "phase": "core", "position": { "x": 400, "y": 120 } },
    { "id": "smart-contracts", "label": "Smart Contract Security", "required": true, "phase": "advanced", "position": { "x": 250, "y": 260 } }
  ],
  "edges": [
    { "source": "javascript", "target": "solidity" },
    { "source": "javascript", "target": "web3" },
    { "source": "solidity", "target": "smart-contracts" },
    { "source": "web3", "target": "smart-contracts" }
  ]
}
```

- [ ] **Step 5: Create `content/roadmaps/product-manager.json`**

```json
{
  "id": "product-manager",
  "title": "Product Manager",
  "category": "software",
  "description": "Define product vision, work with engineering teams, and ship products users love",
  "nodes": [
    { "id": "product-strategy", "label": "Product Strategy", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "user-research", "label": "User Research", "required": true, "phase": "foundation", "position": { "x": 250, "y": 100 } },
    { "id": "data-visualization", "label": "Data & Analytics", "required": true, "phase": "core", "position": { "x": 100, "y": 220 } },
    { "id": "figma", "label": "Wireframing (Figma)", "required": true, "phase": "core", "position": { "x": 400, "y": 220 } },
    { "id": "sql", "label": "SQL for PMs", "required": false, "phase": "advanced", "position": { "x": 250, "y": 340 } }
  ],
  "edges": [
    { "source": "product-strategy", "target": "user-research" },
    { "source": "user-research", "target": "data-visualization" },
    { "source": "user-research", "target": "figma" },
    { "source": "data-visualization", "target": "sql" },
    { "source": "figma", "target": "sql" }
  ]
}
```

- [ ] **Step 6: Create `content/roadmaps/ux-designer.json`**

```json
{
  "id": "ux-designer",
  "title": "UX Designer",
  "category": "software",
  "description": "Design intuitive user experiences through research, prototyping, and design systems",
  "nodes": [
    { "id": "user-research", "label": "User Research", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "figma", "label": "Figma", "required": true, "phase": "core", "position": { "x": 100, "y": 120 } },
    { "id": "design-systems", "label": "Design Systems", "required": true, "phase": "core", "position": { "x": 400, "y": 120 } },
    { "id": "accessibility", "label": "Accessibility (a11y)", "required": true, "phase": "advanced", "position": { "x": 100, "y": 260 } },
    { "id": "html-css", "label": "HTML & CSS basics", "required": false, "phase": "advanced", "position": { "x": 400, "y": 260 } }
  ],
  "edges": [
    { "source": "user-research", "target": "figma" },
    { "source": "user-research", "target": "design-systems" },
    { "source": "figma", "target": "accessibility" },
    { "source": "design-systems", "target": "html-css" }
  ]
}
```

- [ ] **Step 7: Create new skill MDX files**

Create `content/skills/react-native.mdx`:
```mdx
---
title: React Native
description: Build native iOS and Android apps using React — one codebase, two platforms.
estimatedHours: 60
topics:
  - Core Components (View, Text, Image)
  - Navigation (React Navigation)
  - Native Modules & APIs
  - Styling with StyleSheet
  - State Management
  - Debugging & Performance
prerequisites:
  - react
resources:
  - title: React Native Official Docs
    url: https://reactnative.dev/docs/getting-started
    type: docs
    free: true
    rating: 4.8
  - title: React Native Tutorial – freeCodeCamp
    url: https://www.youtube.com/watch?v=obH0Po_RdWk
    type: video
    free: true
    rating: 4.7
  - title: The Complete React Native Guide – Udemy
    url: https://www.udemy.com/course/the-complete-react-native-and-redux-course/
    type: course
    free: false
  - title: Expo Getting Started
    url: https://docs.expo.dev/get-started/introduction/
    type: docs
    free: true
---
```

Create `content/skills/flutter.mdx`:
```mdx
---
title: Flutter
description: Google's UI toolkit for building natively compiled apps from a single Dart codebase.
estimatedHours: 70
topics:
  - Dart Language Basics
  - Widgets (Stateless & Stateful)
  - Navigation & Routing
  - State Management (Provider/Riverpod)
  - HTTP & Local Storage
  - Platform Channels
prerequisites: []
resources:
  - title: Flutter Official Docs
    url: https://flutter.dev/docs
    type: docs
    free: true
    rating: 4.8
  - title: Flutter Crash Course – Traversy Media
    url: https://www.youtube.com/watch?v=1ukSR1GRtMU
    type: video
    free: true
    rating: 4.6
  - title: Flutter & Dart Complete Guide – Udemy
    url: https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/
    type: course
    free: false
  - title: DartPad (online playground)
    url: https://dartpad.dev
    type: course
    free: true
---
```

Create `content/skills/cybersecurity-fundamentals.mdx`:
```mdx
---
title: Security Fundamentals
description: Core concepts of information security — CIA triad, threat models, common attack vectors, and defenses.
estimatedHours: 40
topics:
  - CIA Triad (Confidentiality, Integrity, Availability)
  - OWASP Top 10
  - Cryptography Basics
  - Authentication & Authorization
  - Network Security
  - Incident Response
prerequisites:
  - linux
  - networking
resources:
  - title: OWASP Top 10
    url: https://owasp.org/www-project-top-ten/
    type: docs
    free: true
    rating: 4.9
  - title: CS50 Cybersecurity – Harvard
    url: https://cs50.harvard.edu/cybersecurity/
    type: course
    free: true
    rating: 4.9
  - title: TryHackMe (interactive labs)
    url: https://tryhackme.com
    type: course
    free: true
    rating: 4.8
  - title: CompTIA Security+ Study Guide
    url: https://www.comptia.org/certifications/security
    type: article
    free: false
---
```

Create `content/skills/penetration-testing.mdx`:
```mdx
---
title: Penetration Testing
description: Ethically hack systems to find vulnerabilities before attackers do — tools, methodology, and reporting.
estimatedHours: 60
topics:
  - Reconnaissance & OSINT
  - Scanning & Enumeration (Nmap)
  - Exploitation (Metasploit)
  - Web App Testing (Burp Suite)
  - Post-Exploitation
  - Reporting
prerequisites:
  - cybersecurity-fundamentals
  - linux
resources:
  - title: HackTheBox Academy (free tier)
    url: https://academy.hackthebox.com
    type: course
    free: true
    rating: 4.8
  - title: TryHackMe — Jr Penetration Tester Path
    url: https://tryhackme.com/path/outline/jrpenetrationtester
    type: course
    free: true
    rating: 4.7
  - title: Metasploit Unleashed (free)
    url: https://www.metasploitunleashed.com
    type: article
    free: true
  - title: The Web Application Hacker's Handbook
    url: https://portswigger.net/web-security
    type: course
    free: true
    rating: 4.9
---
```

Create `content/skills/qa-testing.mdx`:
```mdx
---
title: Test Automation
description: Write automated tests that catch bugs before production — unit, integration, and end-to-end.
estimatedHours: 35
topics:
  - Testing Pyramid
  - Unit Testing with Jest/Vitest
  - Integration Testing
  - End-to-End with Playwright/Cypress
  - Test Coverage
  - Mocking & Stubbing
prerequisites:
  - javascript
resources:
  - title: Playwright Docs
    url: https://playwright.dev/docs/intro
    type: docs
    free: true
    rating: 4.8
  - title: Jest Official Docs
    url: https://jestjs.io/docs/getting-started
    type: docs
    free: true
  - title: Testing JavaScript – Kent C. Dodds
    url: https://testingjavascript.com
    type: course
    free: false
  - title: Playwright Tutorial – freeCodeCamp
    url: https://www.youtube.com/watch?v=Hhbj7NameXE
    type: video
    free: true
    rating: 4.6
---
```

Create `content/skills/selenium.mdx`:
```mdx
---
title: Selenium / Playwright
description: Browser automation tools for end-to-end testing of web applications.
estimatedHours: 25
topics:
  - Selenium WebDriver
  - Page Object Model
  - Playwright API
  - Cross-browser Testing
  - Test Reports
  - CI Integration
prerequisites:
  - qa-testing
resources:
  - title: Playwright Official Docs
    url: https://playwright.dev
    type: docs
    free: true
    rating: 4.8
  - title: Selenium Documentation
    url: https://www.selenium.dev/documentation/
    type: docs
    free: true
  - title: Playwright Full Course – LambdaTest
    url: https://www.youtube.com/watch?v=wGr5rz8WGCE
    type: video
    free: true
---
```

Create `content/skills/solidity.mdx`:
```mdx
---
title: Solidity
description: The programming language for writing Ethereum smart contracts — syntax, patterns, and security.
estimatedHours: 50
topics:
  - Variables, Types & Functions
  - Mappings & Arrays
  - Inheritance & Interfaces
  - Events & Error Handling
  - Gas Optimization
  - Common Vulnerabilities (Reentrancy, etc.)
prerequisites:
  - javascript
resources:
  - title: Solidity Official Docs
    url: https://docs.soliditylang.org
    type: docs
    free: true
    rating: 4.7
  - title: CryptoZombies (interactive Solidity game)
    url: https://cryptozombies.io
    type: course
    free: true
    rating: 4.8
  - title: Solidity Full Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=ipwxYa-F1uY
    type: video
    free: true
    rating: 4.6
  - title: Hardhat Docs (development framework)
    url: https://hardhat.org/docs
    type: docs
    free: true
---
```

Create `content/skills/web3.mdx`:
```mdx
---
title: Web3 & DApps
description: Build decentralized applications — connect frontends to blockchain using ethers.js and web3 libraries.
estimatedHours: 45
topics:
  - Blockchain Concepts
  - Wallets & MetaMask
  - ethers.js & web3.js
  - IPFS & Decentralized Storage
  - DeFi Protocols
  - NFT Standards (ERC-721, ERC-1155)
prerequisites:
  - solidity
  - javascript
resources:
  - title: Ethereum Developer Docs
    url: https://ethereum.org/en/developers/docs/
    type: docs
    free: true
    rating: 4.8
  - title: Buildspace (free web3 projects)
    url: https://buildspace.so
    type: course
    free: true
    rating: 4.7
  - title: ethers.js Documentation
    url: https://docs.ethers.org
    type: docs
    free: true
  - title: Web3 University
    url: https://www.web3.university
    type: course
    free: true
---
```

Create `content/skills/product-strategy.mdx`:
```mdx
---
title: Product Strategy
description: Define what to build and why — vision, roadmaps, OKRs, and prioritization frameworks.
estimatedHours: 30
topics:
  - Product Vision & Mission
  - OKRs & Metrics
  - Prioritization (RICE, MoSCoW)
  - Competitive Analysis
  - Go-to-Market Strategy
  - Stakeholder Management
prerequisites: []
resources:
  - title: Inspired by Marty Cagan (summary)
    url: https://www.svpg.com/inspired-how-to-create-products-customers-love/
    type: article
    free: true
    rating: 4.9
  - title: Product School — Free PM Resources
    url: https://productschool.com/resources/
    type: course
    free: true
    rating: 4.6
  - title: Reforge Blog
    url: https://www.reforge.com/blog
    type: article
    free: true
  - title: Lenny's Newsletter (free tier)
    url: https://www.lennysnewsletter.com
    type: article
    free: true
    rating: 4.8
---
```

Create `content/skills/user-research.mdx`:
```mdx
---
title: User Research
description: Understand your users deeply — interviews, usability tests, surveys, and synthesis.
estimatedHours: 25
topics:
  - User Interviews
  - Usability Testing
  - Surveys & Quantitative Research
  - Affinity Mapping
  - Jobs-to-be-Done Framework
  - Research Synthesis
prerequisites: []
resources:
  - title: NN/g — User Research Basics (free articles)
    url: https://www.nngroup.com/articles/which-ux-research-methods/
    type: article
    free: true
    rating: 4.8
  - title: Google UX Design Certificate (Coursera, free audit)
    url: https://www.coursera.org/professional-certificates/google-ux-design
    type: course
    free: false
  - title: Just Enough Research (book)
    url: https://abookapart.com/products/just-enough-research
    type: article
    free: false
  - title: UX Research Field Guide – Dovetail
    url: https://dovetail.com/ux-research/
    type: article
    free: true
---
```

Create `content/skills/figma.mdx`:
```mdx
---
title: Figma
description: The industry-standard UI design tool — wireframes, prototypes, components, and collaboration.
estimatedHours: 30
topics:
  - Frames, Layers & Groups
  - Auto Layout
  - Components & Variants
  - Prototyping & Interactions
  - Design Tokens
  - Dev Mode & Handoff
prerequisites: []
resources:
  - title: Figma Learn (official free courses)
    url: https://www.figma.com/resource-library/figma-for-beginners/
    type: course
    free: true
    rating: 4.8
  - title: Figma Full Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=FTFaQWZBqQ8
    type: video
    free: true
    rating: 4.7
  - title: Figma Community (free templates & plugins)
    url: https://www.figma.com/community
    type: docs
    free: true
---
```

Create `content/skills/design-systems.mdx`:
```mdx
---
title: Design Systems
description: Build scalable, consistent UIs — component libraries, design tokens, and documentation.
estimatedHours: 35
topics:
  - Design Tokens
  - Component Architecture
  - Accessibility in Components
  - Storybook
  - Versioning & Governance
  - Documentation
prerequisites:
  - figma
  - html-css
resources:
  - title: Design Systems Handbook (free)
    url: https://www.designbetter.co/design-systems-handbook
    type: article
    free: true
    rating: 4.8
  - title: Storybook Docs
    url: https://storybook.js.org/docs
    type: docs
    free: true
    rating: 4.7
  - title: Material Design System (Google)
    url: https://m3.material.io
    type: docs
    free: true
  - title: Atomic Design by Brad Frost (free book)
    url: https://atomicdesign.bradfrost.com
    type: article
    free: true
    rating: 4.8
---
```

Also create `content/skills/networking.mdx`:
```mdx
---
title: Networking Fundamentals
description: How the internet works — TCP/IP, DNS, HTTP, firewalls, and network protocols.
estimatedHours: 20
topics:
  - OSI & TCP/IP Models
  - IP Addressing & Subnetting
  - DNS, HTTP/HTTPS
  - Firewalls & NAT
  - Network Scanning (Wireshark, Nmap)
  - VPNs & Proxies
prerequisites: []
resources:
  - title: Professor Messer — CompTIA Network+ (free)
    url: https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/
    type: video
    free: true
    rating: 4.7
  - title: Computer Networking: A Top-Down Approach (MIT OCW)
    url: https://ocw.mit.edu/courses/6-829-computer-networks-fall-2002/
    type: course
    free: true
  - title: Networking Basics – Cisco (free)
    url: https://www.netacad.com/courses/networking/networking-basics
    type: course
    free: true
  - title: Wireshark Tutorial – freeCodeCamp
    url: https://www.youtube.com/watch?v=lb1Dw0elw0Q
    type: video
    free: true
---
```

Also create `content/skills/testing-fundamentals.mdx`:
```mdx
---
title: Testing Fundamentals
description: Core concepts of software testing — types of tests, test planning, and quality mindset.
estimatedHours: 15
topics:
  - Types of Testing (unit, integration, E2E, manual)
  - Testing Pyramid
  - Test Cases & Test Plans
  - Bug Reporting
  - Black-box vs White-box Testing
  - Agile Testing
prerequisites: []
resources:
  - title: ISTQB Foundation Syllabus (free PDF)
    url: https://www.istqb.org/certifications/certified-tester-foundation-level
    type: docs
    free: true
  - title: Software Testing Tutorial – Guru99
    url: https://www.guru99.com/software-testing.html
    type: article
    free: true
    rating: 4.5
  - title: Testing Fundamentals – Ministry of Testing (free)
    url: https://www.ministryoftesting.com/free-resources
    type: course
    free: true
---
```

Also create `content/skills/smart-contracts.mdx`:
```mdx
---
title: Smart Contract Security
description: Audit and secure smart contracts — common vulnerabilities, tools, and best practices.
estimatedHours: 40
topics:
  - Reentrancy Attacks
  - Integer Overflow/Underflow
  - Access Control Issues
  - Slither & MythX (audit tools)
  - Formal Verification
  - Security Checklists
prerequisites:
  - solidity
resources:
  - title: Damn Vulnerable DeFi (free challenges)
    url: https://www.damnvulnerabledefi.xyz
    type: course
    free: true
    rating: 4.9
  - title: Smart Contract Security by Consensys
    url: https://consensys.io/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
    type: article
    free: true
  - title: OpenZeppelin Contracts (reference)
    url: https://docs.openzeppelin.com/contracts
    type: docs
    free: true
    rating: 4.8
  - title: Slither Static Analyzer Docs
    url: https://github.com/crytic/slither
    type: docs
    free: true
---
```

Also create `content/skills/mobile-ux.mdx` and `content/skills/app-store.mdx`:

`content/skills/mobile-ux.mdx`:
```mdx
---
title: Mobile UX Patterns
description: Design patterns specific to mobile — navigation, gestures, performance, and platform conventions.
estimatedHours: 20
topics:
  - iOS vs Android Design Conventions
  - Navigation Patterns (tab bar, drawer, stack)
  - Gesture Handling
  - Offline-first Design
  - Performance & 60fps
  - Accessibility on Mobile
prerequisites: []
resources:
  - title: Material Design for Mobile (Google)
    url: https://m3.material.io/foundations/layout/understanding-layout/overview
    type: docs
    free: true
  - title: Apple Human Interface Guidelines
    url: https://developer.apple.com/design/human-interface-guidelines/
    type: docs
    free: true
    rating: 4.8
  - title: Mobile UX Design – NN/g
    url: https://www.nngroup.com/topic/mobile-usability/
    type: article
    free: true
---
```

`content/skills/app-store.mdx`:
```mdx
---
title: App Store Deployment
description: Publishing apps to the Apple App Store and Google Play — builds, signing, review, and updates.
estimatedHours: 10
topics:
  - App Signing & Certificates
  - App Store Connect (iOS)
  - Google Play Console
  - Build Configuration (release vs debug)
  - App Store Optimization (ASO)
  - Over-the-Air Updates (EAS / CodePush)
prerequisites:
  - react-native
resources:
  - title: Expo EAS Build Docs
    url: https://docs.expo.dev/build/introduction/
    type: docs
    free: true
  - title: App Store Review Guidelines
    url: https://developer.apple.com/app-store/review/guidelines/
    type: docs
    free: true
  - title: Google Play Launch Checklist
    url: https://developer.android.com/distribute/best-practices/launch/launch-checklist
    type: docs
    free: true
---
```

- [ ] **Step 8: Commit all new roles and skills**

```bash
git add content/roadmaps/ content/skills/
git commit -m "feat: add 6 new roles (mobile, security, QA, blockchain, PM, UX) with 14 new skill files"
```

- [ ] **Step 9: Verify routes**

```bash
for role in mobile-engineer security-engineer qa-engineer blockchain-developer product-manager ux-designer; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/roadmap/$role)
  echo "$code /roadmap/$role"
done
```
Expected: All return `200`.

- [ ] **Step 10: Run full test suite**

```bash
npx vitest run
```
Expected: All tests PASS.
