# Roadmap App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public, mobile-compatible Next.js web app where users browse curated learning roadmaps for tech roles (software, data, AI) as interactive node graphs, with per-skill resource pages showing curated free/paid links.

**Architecture:** Next.js 14 App Router with static site generation. Roadmaps are JSON files (graph nodes + edges); skills are MDX files (frontmatter carries all structured data). gray-matter parses MDX frontmatter at build time; React Flow renders the interactive graph. No database, no backend.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, React Flow (`reactflow`), gray-matter, Vitest, React Testing Library

---

## File Map

| File | Purpose |
|---|---|
| `src/lib/types.ts` | Shared TypeScript types (Roadmap, Skill, Resource, Category) |
| `src/lib/content.ts` | File-reading helpers + pure parse functions |
| `src/lib/content.test.ts` | Unit tests for parse functions |
| `src/test/setup.ts` | Vitest + jest-dom setup |
| `vitest.config.ts` | Vitest configuration |
| `src/app/layout.tsx` | Root layout (wraps all pages, renders Navbar) |
| `src/app/globals.css` | Global Tailwind styles |
| `src/app/page.tsx` | Home page — role cards grouped by category |
| `src/app/roadmap/[role]/page.tsx` | Roadmap graph page |
| `src/app/skill/[slug]/page.tsx` | Skill resource page (server component — fetches data, delegates to SkillPageClient) |
| `src/components/SkillPageClient.tsx` | Client component — owns filter state, renders resource list |
| `src/components/Navbar.tsx` | Top nav with logo + category links |
| `src/components/RoleSearch.tsx` | Client component — search input that filters visible role cards |
| `src/components/RoleCard.tsx` | Role card on home page |
| `src/components/RoleCard.test.tsx` | Tests for RoleCard |
| `src/components/SkillNode.tsx` | Custom React Flow node |
| `src/components/TopicsSidebar.tsx` | Phase-grouped topic list with req/opt tags |
| `src/components/RoadmapGraph.tsx` | React Flow wrapper (dynamic, no SSR) |
| `src/components/TopicsChips.tsx` | Chip list of sub-topics on skill page |
| `src/components/ResourceCard.tsx` | Single resource item |
| `src/components/ResourceCard.test.tsx` | Tests for ResourceCard |
| `src/components/ResourceFilter.tsx` | All / Free / Paid filter tabs |
| `src/components/ResourceFilter.test.tsx` | Tests for ResourceFilter |
| `content/categories.json` | Category definitions |
| `content/roadmaps/frontend-engineer.json` | Frontend roadmap graph |
| `content/skills/html-css.mdx` | HTML & CSS skill |
| `content/skills/javascript.mdx` | JavaScript skill |
| `content/skills/react.mdx` | React skill |

---

## Task 1: Project Scaffolding

**Files:**
- Create: project root (Next.js scaffold)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Scaffold Next.js app**

Run in the parent directory (one level above where you want the project):
```bash
npx create-next-app@latest "roadmap-app" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
cd "roadmap-app"
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install reactflow gray-matter
```

- [ ] **Step 3: Install dev/test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 5: Create `src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Add test script to `package.json`**

In `package.json`, add to the `"scripts"` section:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Verify test runner works**

```bash
npx vitest run
```
Expected: "No test files found" (no error).

- [ ] **Step 8: Delete the Next.js boilerplate content**

Replace `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Replace `src/app/page.tsx` with:
```tsx
export default function Home() {
  return <main><h1>Roadmap App</h1></main>;
}
```

- [ ] **Step 9: Verify app starts**

```bash
npm run dev
```
Expected: Server starts on http://localhost:3000 with no errors.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js app with Tailwind, React Flow, Vitest"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

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
}

export interface SkillFrontmatter {
  title: string;
  description: string;
  topics: string[];
  prerequisites: string[];
  resources: Resource[];
}

export interface Skill extends SkillFrontmatter {
  slug: string;
  content: string;
}
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: Content Helpers (TDD)

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/content.test.ts`

- [ ] **Step 1: Write failing tests for `parseSkillContent`**

Create `src/lib/content.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseSkillContent, parseRoadmapContent } from './content';

const SKILL_MDX = `---
title: React
description: A JS library for building UIs
topics:
  - Components
  - Hooks
prerequisites:
  - javascript
resources:
  - title: React Docs
    url: https://react.dev
    type: docs
    free: true
---

Optional body content.
`;

const ROADMAP_JSON = JSON.stringify({
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Build UIs',
  nodes: [
    { id: 'react', label: 'React', required: true, phase: 'core', position: { x: 0, y: 0 } },
  ],
  edges: [{ source: 'javascript', target: 'react' }],
});

describe('parseSkillContent', () => {
  it('extracts title and description from frontmatter', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.title).toBe('React');
    expect(skill.description).toBe('A JS library for building UIs');
  });

  it('extracts topics array', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.topics).toEqual(['Components', 'Hooks']);
  });

  it('extracts prerequisites array', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.prerequisites).toEqual(['javascript']);
  });

  it('extracts resources with all fields', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.resources).toHaveLength(1);
    expect(skill.resources[0]).toEqual({
      title: 'React Docs',
      url: 'https://react.dev',
      type: 'docs',
      free: true,
    });
  });

  it('sets the slug from the argument', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.slug).toBe('react');
  });

  it('captures markdown body content', () => {
    const skill = parseSkillContent('react', SKILL_MDX);
    expect(skill.content.trim()).toBe('Optional body content.');
  });
});

describe('parseRoadmapContent', () => {
  it('parses roadmap id and title', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.id).toBe('frontend-engineer');
    expect(roadmap.title).toBe('Frontend Engineer');
  });

  it('parses nodes with required and phase', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.nodes).toHaveLength(1);
    expect(roadmap.nodes[0].required).toBe(true);
    expect(roadmap.nodes[0].phase).toBe('core');
  });

  it('parses edges', () => {
    const roadmap = parseRoadmapContent(ROADMAP_JSON);
    expect(roadmap.edges[0]).toEqual({ source: 'javascript', target: 'react' });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/lib/content.test.ts
```
Expected: FAIL — "Cannot find module './content'"

- [ ] **Step 3: Create `src/lib/content.ts`**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Roadmap, Skill, SkillFrontmatter, Category } from './types';

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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/lib/content.test.ts
```
Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content.ts src/lib/content.test.ts
git commit -m "feat: add content helpers with parse functions"
```

---

## Task 4: Sample Content Files

**Files:**
- Create: `content/categories.json`
- Create: `content/roadmaps/frontend-engineer.json`
- Create: `content/skills/html-css.mdx`
- Create: `content/skills/javascript.mdx`
- Create: `content/skills/react.mdx`

- [ ] **Step 1: Create `content/categories.json`**

```json
[
  { "id": "software", "label": "Software Engineering", "color": "indigo" },
  { "id": "data", "label": "Data", "color": "sky" },
  { "id": "ai", "label": "AI & Machine Learning", "color": "emerald" }
]
```

- [ ] **Step 2: Create `content/roadmaps/frontend-engineer.json`**

```json
{
  "id": "frontend-engineer",
  "title": "Frontend Engineer",
  "category": "software",
  "description": "Build interactive user interfaces for the web",
  "nodes": [
    { "id": "html-css", "label": "HTML & CSS", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } },
    { "id": "javascript", "label": "JavaScript", "required": true, "phase": "foundation", "position": { "x": 250, "y": 100 } },
    { "id": "react", "label": "React", "required": true, "phase": "core", "position": { "x": 250, "y": 200 } }
  ],
  "edges": [
    { "source": "html-css", "target": "javascript" },
    { "source": "javascript", "target": "react" }
  ]
}
```

- [ ] **Step 3: Create `content/skills/html-css.mdx`**

```mdx
---
title: HTML & CSS
description: The building blocks of web pages — structure with HTML and styling with CSS.
topics:
  - HTML Elements & Semantics
  - CSS Selectors & Specificity
  - Flexbox & Grid
  - Responsive Design
  - CSS Variables
prerequisites: []
resources:
  - title: MDN Web Docs — HTML
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    type: docs
    free: true
  - title: MDN Web Docs — CSS
    url: https://developer.mozilla.org/en-US/docs/Web/CSS
    type: docs
    free: true
  - title: HTML & CSS Full Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=mU6anWqZJcc
    type: video
    free: true
  - title: CSS Tricks Complete Guide to Flexbox
    url: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    type: article
    free: true
---
```

- [ ] **Step 4: Create `content/skills/javascript.mdx`**

```mdx
---
title: JavaScript
description: The programming language of the web — adds interactivity and logic to pages.
topics:
  - Variables & Data Types
  - Functions & Scope
  - DOM Manipulation
  - Promises & Async/Await
  - ES6+ Features
  - Fetch API
prerequisites:
  - html-css
resources:
  - title: JavaScript.info
    url: https://javascript.info
    type: docs
    free: true
  - title: MDN JavaScript Guide
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
    type: docs
    free: true
  - title: JavaScript Full Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=PkZNo7MFNFg
    type: video
    free: true
  - title: Eloquent JavaScript (book)
    url: https://eloquentjavascript.net
    type: article
    free: true
---
```

- [ ] **Step 5: Create `content/skills/react.mdx`**

```mdx
---
title: React
description: A JavaScript library for building user interfaces with reusable components.
topics:
  - Components & JSX
  - Props & State
  - Hooks (useState, useEffect)
  - Context API
  - React Router
  - Performance Basics
prerequisites:
  - javascript
resources:
  - title: React Official Docs
    url: https://react.dev
    type: docs
    free: true
  - title: Full React Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=bMknfKXIFA8
    type: video
    free: true
  - title: Epic React – Kent C. Dodds
    url: https://epicreact.dev
    type: course
    free: false
  - title: React – The Complete Guide (Udemy)
    url: https://www.udemy.com/course/react-the-complete-guide-incl-redux/
    type: course
    free: false
---
```

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: add sample content (categories, frontend roadmap, 3 skills)"
```

---

## Task 5: Root Layout & Navbar

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/components/Navbar.tsx`**

```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          DevRoadmap
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
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
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevRoadmap — Find your learning path',
  description: 'Curated learning roadmaps for software, data, and AI roles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify it renders**

```bash
npm run dev
```
Open http://localhost:3000. Expected: dark page with "DevRoadmap" navbar.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: add root layout with Navbar"
```

---

## Task 6: RoleCard Component (TDD)

**Files:**
- Create: `src/components/RoleCard.tsx`
- Create: `src/components/RoleCard.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/RoleCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoleCard from './RoleCard';
import type { Roadmap } from '@/lib/types';

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

describe('RoleCard', () => {
  it('renders the role title', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('Build interactive UIs for the web')).toBeInTheDocument();
  });

  it('renders the skill count', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('2 skills')).toBeInTheDocument();
  });

  it('links to the roadmap page', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/roadmap/frontend-engineer');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/components/RoleCard.test.tsx
```
Expected: FAIL — "Cannot find module './RoleCard'"

- [ ] **Step 3: Create `src/components/RoleCard.tsx`**

```tsx
import Link from 'next/link';
import type { Roadmap } from '@/lib/types';

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
}

export default function RoleCard({ roadmap, categoryColor }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-400';

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-600 transition-colors"
    >
      <h3 className="font-semibold text-white">{roadmap.title}</h3>
      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{roadmap.description}</p>
      <p className={`mt-3 text-sm font-medium ${accentColor}`}>
        {roadmap.nodes.length} skills →
      </p>
    </Link>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/components/RoleCard.test.tsx
```
Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/RoleCard.tsx src/components/RoleCard.test.tsx
git commit -m "feat: add RoleCard component"
```

---

## Task 7: Home Page with Search

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/RoleSearch.tsx`

- [ ] **Step 1: Create `src/components/RoleSearch.tsx`**

```tsx
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
        <p className="text-center text-gray-500">No roles match "{query}".</p>
      )}
    </>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import { getAllRoadmaps, getCategories } from '@/lib/content';
import RoleSearch from '@/components/RoleSearch';

export default function Home() {
  const categories = getCategories();
  const roadmaps = getAllRoadmaps();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">Find your learning path</h1>
        <p className="mt-3 text-gray-400">
          Pick a role to explore a curated roadmap with resources
        </p>
      </div>
      <RoleSearch roadmaps={roadmaps} categories={categories} />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Open http://localhost:3000. Expected: "Software Engineering" section with a "Frontend Engineer" card. Typing in the search box filters cards in real-time.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/RoleSearch.tsx
git commit -m "feat: build home page with role cards, category groups, and search"
```

---

## Task 8: Custom SkillNode & TopicsSidebar

**Files:**
- Create: `src/components/SkillNode.tsx`
- Create: `src/components/TopicsSidebar.tsx`

- [ ] **Step 1: Create `src/components/SkillNode.tsx`**

```tsx
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

interface SkillNodeData {
  label: string;
  required: boolean;
  phase: 'foundation' | 'core' | 'advanced';
}

const phaseColors: Record<string, string> = {
  foundation: 'border-indigo-500',
  core: 'border-sky-500',
  advanced: 'border-emerald-500',
};

export default function SkillNode({ data }: NodeProps<SkillNodeData>) {
  return (
    <div
      className={`rounded-lg border-2 bg-gray-900 px-3 py-2 text-sm text-white shadow ${phaseColors[data.phase]}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600" />
      <span>{data.label}</span>
      {data.required ? (
        <span className="ml-2 text-xs text-red-400">req</span>
      ) : (
        <span className="ml-2 text-xs text-sky-400">opt</span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600" />
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/TopicsSidebar.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SkillNode.tsx src/components/TopicsSidebar.tsx
git commit -m "feat: add SkillNode and TopicsSidebar components"
```

---

## Task 9: RoadmapGraph Component

**Files:**
- Create: `src/components/RoadmapGraph.tsx`

- [ ] **Step 1: Create `src/components/RoadmapGraph.tsx`**

```tsx
'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/navigation';
import SkillNode from './SkillNode';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';

const nodeTypes = { skill: SkillNode };

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraph({ nodes, edges, fromRole }: Props) {
  const router = useRouter();

  const flowNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: 'skill',
    position: n.position,
    data: { label: n.label, required: n.required, phase: n.phase },
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

- [ ] **Step 2: Commit**

```bash
git add src/components/RoadmapGraph.tsx
git commit -m "feat: add RoadmapGraph with React Flow and node click navigation"
```

---

## Task 10: Roadmap Page

**Files:**
- Create: `src/app/roadmap/[role]/page.tsx`

- [ ] **Step 1: Create `src/app/roadmap/[role]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRoadmap, getAllRoadmaps } from '@/lib/content';
import TopicsSidebar from '@/components/TopicsSidebar';

const RoadmapGraph = dynamic(() => import('@/components/RoadmapGraph'), { ssr: false });

interface Props {
  params: { role: string };
}

export function generateStaticParams() {
  return getAllRoadmaps().map((r) => ({ role: r.id }));
}

export default function RoadmapPage({ params }: Props) {
  const roadmap = getRoadmap(params.role);
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
          <RoadmapGraph
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

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```
Open http://localhost:3000/roadmap/frontend-engineer. Expected: dark layout with sidebar showing 3 topics and React Flow graph with 3 nodes.

- [ ] **Step 3: Commit**

```bash
git add src/app/roadmap/
git commit -m "feat: build roadmap page with React Flow graph and topics sidebar"
```

---

## Task 11: ResourceCard, ResourceFilter & TopicsChips (TDD)

**Files:**
- Create: `src/components/ResourceCard.tsx`
- Create: `src/components/ResourceCard.test.tsx`
- Create: `src/components/ResourceFilter.tsx`
- Create: `src/components/ResourceFilter.test.tsx`
- Create: `src/components/TopicsChips.tsx`

- [ ] **Step 1: Write failing tests for ResourceCard**

Create `src/components/ResourceCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResourceCard from './ResourceCard';
import type { Resource } from '@/lib/types';

const freeResource: Resource = {
  title: 'React Docs',
  url: 'https://react.dev',
  type: 'docs',
  free: true,
};

const paidResource: Resource = {
  title: 'Epic React',
  url: 'https://epicreact.dev',
  type: 'course',
  free: false,
};

describe('ResourceCard', () => {
  it('renders the resource title', () => {
    render(<ResourceCard resource={freeResource} />);
    expect(screen.getByText('React Docs')).toBeInTheDocument();
  });

  it('shows Free badge for free resources', () => {
    render(<ResourceCard resource={freeResource} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows Paid badge for paid resources', () => {
    render(<ResourceCard resource={paidResource} />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('links to the resource URL', () => {
    render(<ResourceCard resource={freeResource} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://react.dev');
  });

  it('opens link in new tab', () => {
    render(<ResourceCard resource={freeResource} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
```

- [ ] **Step 2: Write failing tests for ResourceFilter**

Create `src/components/ResourceFilter.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ResourceFilter from './ResourceFilter';

describe('ResourceFilter', () => {
  it('renders All, Free, and Paid tabs', () => {
    render(<ResourceFilter active="all" onChange={vi.fn()} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('calls onChange with "free" when Free is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="all" onChange={onChange} />);
    await userEvent.click(screen.getByText('Free'));
    expect(onChange).toHaveBeenCalledWith('free');
  });

  it('calls onChange with "paid" when Paid is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="all" onChange={onChange} />);
    await userEvent.click(screen.getByText('Paid'));
    expect(onChange).toHaveBeenCalledWith('paid');
  });

  it('calls onChange with "all" when All is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="free" onChange={onChange} />);
    await userEvent.click(screen.getByText('All'));
    expect(onChange).toHaveBeenCalledWith('all');
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npx vitest run src/components/ResourceCard.test.tsx src/components/ResourceFilter.test.tsx
```
Expected: FAIL — modules not found.

- [ ] **Step 4: Create `src/components/ResourceCard.tsx`**

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

- [ ] **Step 5: Create `src/components/ResourceFilter.tsx`**

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
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create `src/components/TopicsChips.tsx`**

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
          className="rounded border border-indigo-800/50 bg-indigo-900/20 px-3 py-1 text-sm text-indigo-300"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Run all tests to confirm they pass**

```bash
npx vitest run src/components/ResourceCard.test.tsx src/components/ResourceFilter.test.tsx
```
Expected: All 9 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/ResourceCard.tsx src/components/ResourceCard.test.tsx src/components/ResourceFilter.tsx src/components/ResourceFilter.test.tsx src/components/TopicsChips.tsx
git commit -m "feat: add ResourceCard, ResourceFilter, and TopicsChips components"
```

---

## Task 12: Skill Page

**Files:**
- Create: `src/components/SkillPageClient.tsx`
- Create: `src/app/skill/[slug]/page.tsx`

Note: `generateStaticParams` requires a server component. The filter state (`useState`) requires a client component. Split them: the page is the server component; `SkillPageClient` owns the interactive parts.

- [ ] **Step 1: Create `src/components/SkillPageClient.tsx`**

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
```

- [ ] **Step 2: Create `src/app/skill/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { getSkill, getAllSkillSlugs } from '@/lib/content';
import SkillPageClient from '@/components/SkillPageClient';

interface Props {
  params: { slug: string };
  searchParams: { from?: string };
}

export function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export default function SkillPage({ params, searchParams }: Props) {
  const skill = getSkill(params.slug);
  if (!skill) notFound();

  return <SkillPageClient skill={skill} from={searchParams.from} />;
}
```

- [ ] **Step 3: Verify in browser — navigate from home → roadmap → skill**

```bash
npm run dev
```
1. Go to http://localhost:3000
2. Click "Frontend Engineer"
3. Click the "React" node in the graph
4. Expected: Skill page with Topics Covered chips, prerequisites linked, and 4 resource cards. Clicking "Free" filter shows 2 cards. Breadcrumb says "← Frontend Engineer".

- [ ] **Step 4: Commit**

```bash
git add src/components/SkillPageClient.tsx src/app/skill/
git commit -m "feat: build skill resource page with topics, prerequisites, and filtered resources"
```

---

## Task 13: Static Build & Final Verification

**Files:**
- No new files

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```
Expected: Build succeeds with all routes statically generated:
```
Route (app)                    Size
├ ○ /                          ...
├ ○ /roadmap/frontend-engineer ...
├ ○ /skill/html-css            ...
├ ○ /skill/javascript          ...
└ ○ /skill/react               ...
```

- [ ] **Step 4: Smoke-test production build**

```bash
npm run start
```
Open http://localhost:3000. Verify:
- Home page shows Frontend Engineer card
- Clicking card loads roadmap with graph + sidebar
- Clicking a node loads skill page with working filter tabs
- Breadcrumb links back correctly
- Mobile view (resize browser to 375px): sidebar shows as toggle drawer, cards stack to one column

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify production build passes"
```
