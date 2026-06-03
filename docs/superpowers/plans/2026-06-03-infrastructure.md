# Infrastructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Clerk authentication (sign-in, sign-up, user session) and a Playwright end-to-end test suite covering the key user flows.

**Architecture:** Clerk wraps the Next.js App Router with `ClerkProvider` and a middleware file that protects routes. Sign-in and sign-up use Clerk's hosted components via catch-all routes. Playwright runs against `npm run dev` on port 3001 and tests the home, roadmap, and skill pages.

**Tech Stack:** `@clerk/nextjs`, `@playwright/test`

---

## File Map

| File | Action |
|---|---|
| `.env.local` | Create — Clerk API keys (not committed) |
| `.env.example` | Create — document required env vars |
| `.gitignore` | Modify — ensure `.env.local` is ignored |
| `middleware.ts` | Create — Clerk auth middleware |
| `src/app/layout.tsx` | Modify — wrap with ClerkProvider |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Create — Clerk sign-in page |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Create — Clerk sign-up page |
| `src/components/Navbar.tsx` | Modify — add UserButton |
| `playwright.config.ts` | Create — Playwright config |
| `e2e/home.spec.ts` | Create — home page tests |
| `e2e/roadmap.spec.ts` | Create — roadmap page tests |
| `e2e/skill.spec.ts` | Create — skill page tests |

All files in `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

---

## Task 1: Clerk Authentication

**Prerequisite:** You need a free Clerk account. Sign up at https://clerk.com, create a new application, and copy your **Publishable Key** and **Secret Key** from the Clerk dashboard.

**Files:**
- Create: `.env.local`
- Create: `.env.example`
- Modify: `.gitignore`
- Create: `middleware.ts`
- Modify: `src/app/layout.tsx`
- Create: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `src/app/sign-up/[[...sign-up]]/page.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Install @clerk/nextjs**

```bash
npm install @clerk/nextjs
```

- [ ] **Step 2: Create `.env.local`**

Replace `pk_test_...` and `sk_test_...` with your actual keys from the Clerk dashboard:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

- [ ] **Step 3: Create `.env.example`** (committed to git — no real keys)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_SITE_URL=https://roadify.vercel.app
```

- [ ] **Step 4: Verify `.gitignore` has `.env.local`**

Check that `.gitignore` includes `.env.local`. It should already be there from the Next.js scaffold. If not, add it:

```bash
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Create `middleware.ts` at the project root**

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// All routes are public — auth is optional (users can browse without signing in)
// Add routes to isProtectedRoute if you want to require login for specific pages
const isProtectedRoute = createRouteMatcher([
  // Example: '/dashboard(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

- [ ] **Step 6: Update `src/app/layout.tsx` to wrap with ClerkProvider**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import { SearchProvider } from '@/context/SearchContext';
import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider>
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
    </ClerkProvider>
  );
}
```

- [ ] **Step 7: Create `src/app/sign-in/[[...sign-in]]/page.tsx`**

```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <SignIn />
    </main>
  );
}
```

- [ ] **Step 8: Create `src/app/sign-up/[[...sign-up]]/page.tsx`**

```tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <SignUp />
    </main>
  );
}
```

- [ ] **Step 9: Update `src/components/Navbar.tsx` to add UserButton**

```tsx
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
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
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
      <SearchModal />
    </nav>
  );
}
```

- [ ] **Step 10: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 11: Verify auth works in browser**

```bash
npm run dev
```
Open http://localhost:3001. You should see a "Sign in" button in the navbar. Clicking it opens Clerk's sign-in modal. After signing in, the button becomes a Clerk user avatar.

- [ ] **Step 12: Commit**

```bash
git add middleware.ts src/app/sign-in/ src/app/sign-up/ src/components/Navbar.tsx src/app/layout.tsx .env.example package.json package-lock.json
git commit -m "feat: add Clerk authentication with sign-in/sign-up and user button in navbar"
```

Note: Do NOT commit `.env.local`. It should be in `.gitignore`.

---

## Task 2: Playwright E2E Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`
- Create: `e2e/roadmap.spec.ts`
- Create: `e2e/skill.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

- [ ] **Step 3: Create `e2e/home.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows role cards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Roadify/);
    await expect(page.getByText('Frontend Engineer')).toBeVisible();
    await expect(page.getByText('Software Engineering')).toBeVisible();
  });

  test('shows all three categories', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Software Engineering')).toBeVisible();
    await expect(page.getByText('Data')).toBeVisible();
    await expect(page.getByText('AI & Machine Learning')).toBeVisible();
  });

  test('search filters roles by name', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search roles...').fill('frontend');
    await expect(page.getByText('Frontend Engineer')).toBeVisible();
    // Other categories should be hidden when search filters results
    const backendCard = page.getByText('Backend Engineer');
    await expect(backendCard).not.toBeVisible();
  });

  test('search shows no results message for unknown query', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search roles...').fill('zzzznotarole');
    await expect(page.getByText(/No roles match/)).toBeVisible();
  });

  test('global search opens with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.getByPlaceholder('Search roles and skills...')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder('Search roles and skills...')).not.toBeVisible();
  });

  test('clicking a role card navigates to roadmap page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Frontend Engineer').first().click();
    await expect(page).toHaveURL('/roadmap/frontend-engineer');
  });
});
```

- [ ] **Step 4: Create `e2e/roadmap.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Roadmap page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/roadmap/frontend-engineer');
    await expect(page).toHaveTitle(/Frontend Engineer/);
    await expect(page.getByRole('heading', { name: 'Frontend Engineer' })).toBeVisible();
  });

  test('shows topics in sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByText('All Topics')).toBeVisible();
    await expect(page.getByText('Foundation')).toBeVisible();
  });

  test('shows topics toggle on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/roadmap/frontend-engineer');
    const toggle = page.getByText(/Topics/);
    await expect(toggle).toBeVisible();
  });

  test('returns 404 for unknown role', async ({ page }) => {
    const response = await page.goto('/roadmap/not-a-real-role');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('Page not found')).toBeVisible();
  });

  test('shows skill count in subtitle', async ({ page }) => {
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByText(/skills · Click any node/)).toBeVisible();
  });
});
```

- [ ] **Step 5: Create `e2e/skill.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Skill page', () => {
  test('loads React skill with correct title', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page).toHaveTitle(/React/);
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible();
  });

  test('shows Topics Covered section', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page.getByText('Topics Covered')).toBeVisible();
  });

  test('shows Resources section', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page.getByText('Resources')).toBeVisible();
  });

  test('Free/Paid filter tabs work', async ({ page }) => {
    await page.goto('/skill/react');
    await page.getByText('Free').click();
    // Paid resources should not be shown
    const epicReact = page.getByText('Epic React – Kent C. Dodds');
    await expect(epicReact).not.toBeVisible();
  });

  test('All filter shows all resources', async ({ page }) => {
    await page.goto('/skill/react');
    await page.getByText('Free').click();
    await page.getByText('All').click();
    // Epic React (paid) should be visible again
    await expect(page.getByText('Epic React – Kent C. Dodds')).toBeVisible();
  });

  test('mark complete button toggles skill completion', async ({ page }) => {
    // ProgressProvider is in the root layout, so this works from any page
    await page.goto('/skill/react?from=frontend-engineer');
    const markBtn = page.getByText('Mark complete');
    await expect(markBtn).toBeVisible();
    await markBtn.click();
    await expect(page.getByText('✓ Completed')).toBeVisible();
    // Toggle back off
    await page.getByText('✓ Completed').click();
    await expect(page.getByText('Mark complete')).toBeVisible();
  });

  test('breadcrumb links back to roadmap', async ({ page }) => {
    await page.goto('/skill/react?from=frontend-engineer');
    const breadcrumb = page.getByText('← Frontend Engineer');
    await expect(breadcrumb).toBeVisible();
    await breadcrumb.click();
    await expect(page).toHaveURL('/roadmap/frontend-engineer');
  });

  test('returns 404 for unknown skill', async ({ page }) => {
    const response = await page.goto('/skill/not-a-real-skill');
    expect(response?.status()).toBe(404);
  });

  test('resource links open external URLs', async ({ page }) => {
    await page.goto('/skill/react');
    const links = page.getByRole('link').filter({ hasText: '↗' });
    const firstLink = links.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
    const target = await firstLink.getAttribute('target');
    expect(target).toBe('_blank');
  });
});
```

- [ ] **Step 6: Add Playwright script to `package.json`**

Add to the `"scripts"` section of `package.json`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 7: Run E2E tests**

Make sure the dev server is running (or Playwright will start it):
```bash
npm run test:e2e
```
Expected: All tests pass. If any fail, check the console output for the specific assertion that failed.

Common issues:
- If `Mark complete` test fails, check that `ProgressContext` wraps the skill page (it's only wrapped on the roadmap page — the skill page gets its own isolated context from `ProgressProvider` that resets on navigation). This is expected behavior for the current architecture where progress shows on the roadmap page.

- [ ] **Step 8: Add E2E workflow to GitHub Actions**

Update `.github/workflows/ci.yml` to add an E2E job:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit:
    name: Lint, typecheck & unit tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test

  e2e:
    name: E2E tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          CI: true
```

- [ ] **Step 9: Commit**

```bash
git add playwright.config.ts e2e/ .github/workflows/ci.yml package.json package-lock.json
git commit -m "feat: add Playwright E2E tests for home, roadmap, and skill pages"
```
