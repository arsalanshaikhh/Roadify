# Production Grade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the DevRoadmap Next.js 16 app for production on Vercel — adding SEO metadata, HTTP security headers, custom error pages, Vercel Analytics, and a GitHub Actions CI pipeline.

**Architecture:** All changes are additive and independent. Security headers go in `next.config.ts`. SEO uses Next.js App Router's built-in `generateMetadata` API and file conventions (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`). Error pages use Next.js file conventions (`not-found.tsx`, `error.tsx`, `global-error.tsx`). Analytics is two components in the root layout. CI is a single GitHub Actions workflow file.

**Tech Stack:** Next.js 16 (App Router), TypeScript, `@vercel/analytics`, `@vercel/speed-insights`, GitHub Actions

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `next.config.ts` | Modify | Add 6 HTTP security headers |
| `src/app/layout.tsx` | Modify | Root metadata template + Analytics + SpeedInsights |
| `src/app/opengraph-image.tsx` | Create | Auto-generated 1200×630 OG image via `next/og` |
| `src/app/roadmap/[role]/page.tsx` | Modify | Add `generateMetadata` for role title/description |
| `src/app/skill/[slug]/page.tsx` | Modify | Add `generateMetadata` for skill title/description |
| `src/app/sitemap.ts` | Create | `/sitemap.xml` — all roadmap + skill URLs |
| `src/app/robots.ts` | Create | `/robots.txt` — allow all, link to sitemap |
| `src/app/not-found.tsx` | Create | Custom 404 page |
| `src/app/error.tsx` | Create | Route-level error boundary |
| `src/app/global-error.tsx` | Create | Top-level error boundary |
| `.github/workflows/ci.yml` | Create | Lint + typecheck + test on push/PR |

All work is in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Security Headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts` entirely**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Verify header appears in dev server response**

```bash
curl -s -I http://localhost:3001/ | grep -i "x-frame"
```
Expected: `x-frame-options: SAMEORIGIN`

If the server isn't running, start it first with `npm run dev -- --port 3001` in a separate terminal.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: add HTTP security headers"
```

---

## Task 2: Analytics + Root Metadata

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Install analytics packages**

```bash
npm install @vercel/analytics @vercel/speed-insights
```

- [ ] **Step 2: Replace `src/app/layout.tsx` entirely**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | DevRoadmap',
    default: 'DevRoadmap — Find your learning path',
  },
  description:
    'Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill.',
  openGraph: {
    siteName: 'DevRoadmap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DevRoadmap — Find your learning path';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030712',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 80,
            height: 6,
            background: '#6366f1',
            borderRadius: 3,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: '-2px',
          }}
        >
          DevRoadmap
        </div>
        <div style={{ color: '#94a3b8', fontSize: 32, marginTop: 20 }}>
          Find your learning path
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Verify OG image endpoint works**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/opengraph-image
```
Expected: `200`

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/opengraph-image.tsx package.json package-lock.json
git commit -m "feat: add root metadata template, OG image, and Vercel Analytics"
```

---

## Task 3: Page-Level Metadata

**Files:**
- Modify: `src/app/roadmap/[role]/page.tsx`
- Modify: `src/app/skill/[slug]/page.tsx`

- [ ] **Step 1: Replace `src/app/roadmap/[role]/page.tsx` entirely**

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
    openGraph: {
      title: roadmap.title,
      description: roadmap.description,
    },
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
          <RoadmapGraphClient
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

- [ ] **Step 2: Replace `src/app/skill/[slug]/page.tsx` entirely**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSkill, getAllSkillSlugs } from '@/lib/content';
import SkillPageClient from '@/components/SkillPageClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return {};
  return {
    title: skill.title,
    description: skill.description,
    openGraph: {
      title: skill.title,
      description: skill.description,
    },
  };
}

export default async function SkillPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;

  const skill = getSkill(slug);
  if (!skill) notFound();

  return <SkillPageClient skill={skill} from={from} />;
}
```

- [ ] **Step 3: Verify page titles in browser**

Start or confirm dev server is running on port 3001:
- Open http://localhost:3001/roadmap/frontend-engineer — browser tab should read **"Frontend Engineer | DevRoadmap"**
- Open http://localhost:3001/skill/react — browser tab should read **"React | DevRoadmap"**

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/roadmap/[role]/page.tsx src/app/skill/[slug]/page.tsx
git commit -m "feat: add page-level SEO metadata for roadmap and skill pages"
```

---

## Task 4: Sitemap & Robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next';
import { getAllRoadmaps, getAllSkillSlugs } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devroadmap.vercel.app';

  const roadmapEntries = getAllRoadmaps().map((r) => ({
    url: `${baseUrl}/roadmap/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillEntries = getAllSkillSlugs().map((slug) => ({
    url: `${baseUrl}/skill/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...roadmapEntries,
    ...skillEntries,
  ];
}
```

- [ ] **Step 2: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devroadmap.vercel.app';
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify sitemap and robots routes**

```bash
curl -s http://localhost:3001/sitemap.xml | head -20
```
Expected: XML starting with `<?xml` containing `<urlset` and URLs like `/roadmap/frontend-engineer`.

```bash
curl -s http://localhost:3001/robots.txt
```
Expected:
```
User-Agent: *
Allow: /

Sitemap: https://devroadmap.vercel.app/sitemap.xml
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

## Task 5: Error Pages

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/global-error.tsx`

- [ ] **Step 1: Create `src/app/not-found.tsx`**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-4 text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:border-gray-500 transition-colors"
      >
        ← Back to home
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Create `src/app/error.tsx`**

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
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
        Error
      </p>
      <h1 className="mt-4 text-4xl font-bold text-white">Something went wrong</h1>
      <p className="mt-4 text-gray-400">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred.'}
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
          className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:border-gray-500 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create `src/app/global-error.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
          Critical Error
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">Something went wrong</h1>
        <p className="mt-4 text-gray-400">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'A critical error occurred. Please refresh the page.'}
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify 404 page**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/roadmap/nonexistent-role
```
Expected: `404`

Open http://localhost:3001/this-page-does-not-exist in browser — should show the styled 404 page with "Page not found" and "← Back to home" link.

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/not-found.tsx src/app/error.tsx src/app/global-error.tsx
git commit -m "feat: add custom 404, error boundary, and global error pages"
```

---

## Task 6: CI/CD Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

First create the directory:
```bash
mkdir -p .github/workflows
```

Then create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, typecheck & test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npx tsc --noEmit

      - name: Test
        run: npm test
```

- [ ] **Step 2: Verify the workflow file is valid YAML**

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
console.log('File exists, length:', content.length, 'chars');
console.log('First line:', content.split('\n')[0]);
"
```
Expected: File exists, length > 400 chars, first line: `name: CI`

- [ ] **Step 3: Run the same checks locally to confirm they pass**

```bash
npm run lint && echo "lint ok"
npx tsc --noEmit && echo "typecheck ok"
npm test && echo "tests ok"
```
Expected: All three print their `ok` message.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add GitHub Actions CI pipeline (lint, typecheck, test)"
```

---

## Task 7: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```
Expected: All 22 tests pass.

- [ ] **Step 2: TypeScript clean**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: Build succeeds. Check output includes:
- `○ /sitemap.xml`
- `○ /robots.txt`
- All existing routes still generated

- [ ] **Step 4: Smoke-test key new endpoints**

```bash
curl -s -I http://localhost:3001/ | grep -i "x-frame-options"
curl -s -o /dev/null -w "sitemap: %{http_code}\n" http://localhost:3001/sitemap.xml
curl -s -o /dev/null -w "robots: %{http_code}\n" http://localhost:3001/robots.txt
curl -s -o /dev/null -w "og-image: %{http_code}\n" http://localhost:3001/opengraph-image
curl -s -o /dev/null -w "404: %{http_code}\n" http://localhost:3001/roadmap/fake-role
```

Expected output:
```
x-frame-options: SAMEORIGIN
sitemap: 200
robots: 200
og-image: 200
404: 404
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: production grade verification complete"
```
