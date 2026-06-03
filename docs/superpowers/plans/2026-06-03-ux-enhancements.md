# UX Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add skeleton loaders for the roadmap graph and a dark/light mode toggle to Roadify.

**Architecture:** Skeleton loader uses Next.js `loading.tsx` convention plus a dynamic import `loading` prop on `RoadmapGraph`. Dark/light mode uses `next-themes` for theme management with a toggle button in the Navbar; CSS custom properties in `globals.css` define the color palette for both themes.

**Tech Stack:** Next.js 16, Tailwind CSS v4, `next-themes`

---

## File Map

| File | Action |
|---|---|
| `src/app/roadmap/[role]/loading.tsx` | Create — page-level skeleton |
| `src/components/GraphSkeleton.tsx` | Create — graph area skeleton |
| `src/components/RoadmapGraphClient.tsx` | Modify — add loading prop |
| `src/components/ThemeProvider.tsx` | Create — next-themes wrapper |
| `src/components/ThemeToggle.tsx` | Create — sun/moon toggle button |
| `src/components/Navbar.tsx` | Modify — add ThemeToggle |
| `src/app/layout.tsx` | Modify — wrap with ThemeProvider, remove hardcoded dark class |
| `src/app/globals.css` | Modify — add CSS custom properties for both themes |

All files in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Skeleton Loaders

**Files:**
- Create: `src/components/GraphSkeleton.tsx`
- Create: `src/app/roadmap/[role]/loading.tsx`
- Modify: `src/components/RoadmapGraphClient.tsx`

- [ ] **Step 1: Create `src/components/GraphSkeleton.tsx`**

```tsx
export default function GraphSkeleton() {
  return (
    <div className="h-full w-full bg-gray-950 flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg px-8">
        {/* Top node */}
        <div className="h-10 w-40 rounded-lg bg-gray-800" />
        {/* Middle row */}
        <div className="flex gap-12">
          <div className="h-10 w-28 rounded-lg bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-800" />
        </div>
        {/* Bottom row */}
        <div className="flex gap-16">
          <div className="h-10 w-32 rounded-lg bg-gray-800" />
          <div className="h-10 w-32 rounded-lg bg-gray-800" />
        </div>
        <p className="text-xs text-gray-600 mt-4">Loading roadmap...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/RoadmapGraphClient.tsx` to use skeleton as loading state**

```tsx
'use client';

import dynamic from 'next/dynamic';
import type { RoadmapNode, RoadmapEdge } from '@/lib/types';
import GraphSkeleton from './GraphSkeleton';

const RoadmapGraph = dynamic(() => import('@/components/RoadmapGraph'), {
  ssr: false,
  loading: () => <GraphSkeleton />,
});

interface Props {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  fromRole: string;
}

export default function RoadmapGraphClient({ nodes, edges, fromRole }: Props) {
  return <RoadmapGraph nodes={nodes} edges={edges} fromRole={fromRole} />;
}
```

- [ ] **Step 3: Create `src/app/roadmap/[role]/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:flex-row animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-800 p-5 lg:block">
        <div className="h-3 w-20 rounded bg-gray-800 mb-6" />
        <div className="space-y-6">
          {['Foundation', 'Core', 'Advanced'].map((phase) => (
            <div key={phase}>
              <div className="h-2.5 w-16 rounded bg-gray-800 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: phase === 'Foundation' ? 3 : 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-2.5 w-24 rounded bg-gray-800" />
                    <div className="h-4 w-6 rounded bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      {/* Main area skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-800 px-6 py-4">
          <div className="h-5 w-48 rounded bg-gray-800 mb-2" />
          <div className="h-3 w-64 rounded bg-gray-800" />
        </div>
        <div className="flex-1 bg-gray-950 flex items-center justify-center">
          <div className="h-4 w-32 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Verify skeleton renders in browser**

Open http://localhost:3001/roadmap/frontend-engineer and hard-reload (Ctrl+Shift+R). You should briefly see the skeleton before the graph appears. On slower machines it will be visible longer.

- [ ] **Step 6: Commit**

```bash
git add src/components/GraphSkeleton.tsx src/components/RoadmapGraphClient.tsx src/app/roadmap/
git commit -m "feat: add skeleton loaders for roadmap graph page"
```

---

## Task 2: Dark / Light Mode Toggle

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install next-themes**

```bash
npm install next-themes
```

- [ ] **Step 2: Update `src/app/globals.css`**

```css
@import "tailwindcss";

/* Light mode (default) */
:root {
  --bg-base: #f9fafb;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --border: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
}

/* Dark mode */
.dark {
  --bg-base: #030712;
  --bg-surface: #111827;
  --bg-card: #111827;
  --border: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
}
```

- [ ] **Step 3: Create `src/components/ThemeProvider.tsx`**

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 4: Create `src/components/ThemeToggle.tsx`**

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors dark:hover:bg-gray-800 light:hover:bg-gray-100"
    >
      {isDark ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 5: Update `src/components/Navbar.tsx`**

```tsx
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 dark:bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          Roadify
        </Link>
        <div className="flex items-center gap-4">
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 6: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `suppressHydrationWarning` on `<html>` is required because `next-themes` adds the `dark`/`light` class server-vs-client-side. Without it, React logs a hydration warning.

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 8: Verify toggle works in browser**

Open http://localhost:3001. Click the sun/moon icon in the navbar. The page should switch between dark and light background. Reload — the chosen theme should persist.

- [ ] **Step 9: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/app/globals.css src/components/ThemeProvider.tsx src/components/ThemeToggle.tsx src/components/Navbar.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add dark/light mode toggle with next-themes and persistent theme preference"
```
