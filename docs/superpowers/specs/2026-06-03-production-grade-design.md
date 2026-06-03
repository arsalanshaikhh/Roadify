# Production Grade — Design Spec

**Date:** 2026-06-03
**Status:** Approved

---

## Overview

Harden the DevRoadmap Next.js app for production deployment on Vercel. Covers five independent areas: SEO & discoverability, HTTP security headers, error handling pages, analytics, and CI/CD pipeline.

---

## Area 1: SEO & Discoverability

### Approach
Use Next.js App Router's built-in `generateMetadata` API — no external packages required.

### Files

**`src/app/layout.tsx`** — Root metadata:
- `title: { template: '%s | DevRoadmap', default: 'DevRoadmap — Find your learning path' }`
- `description`: `"Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill."`
- `openGraph`: site name, default OG image (`/og-image.png`), type `website`
- `twitter`: card type `summary_large_image`

**`src/app/roadmap/[role]/page.tsx`** — `generateMetadata` reads the role's JSON and returns:
- `title`: `"${roadmap.title}"` (template adds `| DevRoadmap`)
- `description`: `roadmap.description`
- `openGraph.title` + `openGraph.description`

**`src/app/skill/[slug]/page.tsx`** — `generateMetadata` reads the skill MDX and returns:
- `title`: `"${skill.title}"`
- `description`: `skill.description`
- `openGraph.title` + `openGraph.description`

**`src/app/sitemap.ts`** — Dynamic sitemap route served at `/sitemap.xml`:
- Static entries: `/`
- Dynamic entries: `/roadmap/[role]` for all roadmaps + `/skill/[slug]` for all skills
- Each entry includes `lastModified: new Date()` and `changeFrequency: 'weekly'`

**`src/app/robots.ts`** — Served at `/robots.txt`:
- `allow: '/'` for all crawlers
- `sitemap` pointing to `https://devroadmap.vercel.app/sitemap.xml`
- Uses `NEXT_PUBLIC_SITE_URL` env var with fallback `https://devroadmap.vercel.app`

**`public/og-image.png`** — Static 1200×630 PNG. Dark background (`#030712`), white "DevRoadmap" wordmark, indigo accent line, tagline "Find your learning path". Generated with an HTML/canvas script at build time — implementer creates `scripts/generate-og.mjs` that writes the file using `@vercel/og` or a simple `sharp`-based canvas render.

---

## Area 2: Security Headers

Configured entirely in `next.config.ts` via the `headers()` async function. Applied to all routes via `source: '/(.*)'`.

| Header | Value |
|---|---|
| `X-DNS-Prefetch-Control` | `on` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

**CSP excluded** — `@xyflow/react` injects inline styles at runtime, requiring `unsafe-inline` which negates CSP's value.

---

## Area 3: Error Handling

Three new files, all dark-themed (bg-gray-950) to match the app design.

**`src/app/not-found.tsx`** — Server component. Shown on 404.
- Heading: `404 — Page not found`
- Subtext: `The page you're looking for doesn't exist.`
- Link: `← Back to home` (href `/`)

**`src/app/error.tsx`** — Client component (`'use client'`). Catches errors in any page.
- Props: `{ error: Error & { digest?: string }, reset: () => void }`
- Shows generic message in production, `error.message` in development (`process.env.NODE_ENV === 'development'`)
- Button: `Try again` (calls `reset()`)
- Link: `← Back to home`

**`src/app/global-error.tsx`** — Client component (`'use client'`). Top-level fallback when root layout crashes.
- Must render its own `<html>` and `<body>` (layout is unavailable)
- Same content pattern as `error.tsx`

---

## Area 4: Analytics

**Packages:**
```bash
npm install @vercel/analytics @vercel/speed-insights
```

**`src/app/layout.tsx`** — Add inside `<body>`:
```tsx
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
// ...
<Analytics />
<SpeedInsights />
```

Both are no-ops in local development. They activate automatically when the app is deployed to Vercel. No environment variables or configuration needed.

- `Analytics` — tracks page views on every route change
- `SpeedInsights` — reports Core Web Vitals (LCP, FID, CLS) to Vercel dashboard

---

## Area 5: CI/CD

**File:** `.github/workflows/ci.yml`

**Triggers:** `push` and `pull_request` targeting `main` branch.

**Runner:** `ubuntu-latest`, Node.js 20 (LTS)

**Steps in order:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node.js (`actions/setup-node@v4`) with npm cache
3. Install deps: `npm ci`
4. Lint: `npm run lint`
5. Typecheck: `npx tsc --noEmit`
6. Test: `npm test`

No secrets required. Caches `~/.npm` to speed up repeated runs.

---

## New Files Summary

| File | Type | Purpose |
|---|---|---|
| `src/app/sitemap.ts` | New | `/sitemap.xml` — all routes |
| `src/app/robots.ts` | New | `/robots.txt` |
| `src/app/not-found.tsx` | New | Custom 404 page |
| `src/app/error.tsx` | New | Route-level error boundary |
| `src/app/global-error.tsx` | New | Top-level error boundary |
| `public/og-image.png` | New | Default 1200×630 OG image |
| `.github/workflows/ci.yml` | New | CI pipeline |

## Modified Files

| File | Change |
|---|---|
| `src/app/layout.tsx` | Add root metadata + Analytics + SpeedInsights |
| `src/app/roadmap/[role]/page.tsx` | Add `generateMetadata` |
| `src/app/skill/[slug]/page.tsx` | Add `generateMetadata` |
| `next.config.ts` | Add `headers()` with 6 security headers |

---

## Out of Scope

- Content Security Policy (CSP) — incompatible with `@xyflow/react` inline styles
- PWA manifest — not requested
- Skeleton loaders — not requested
- Sentry / external error monitoring — not requested
- Authentication — deferred to future spec
