# Roadmap App — Design Spec

**Date:** 2026-06-03  
**Status:** Approved

---

## Overview

A mobile-compatible web app where users can discover curated learning roadmaps for different tech roles across software engineering, data, and AI. Each role has an interactive visual node graph; clicking a skill node navigates to a dedicated resource page with curated links, topics covered, and free/paid filtering.

**Core value:** Curated resources per skill — quality links to docs, videos, and courses, not just a diagram.

---

## Audience

General — from beginners exploring tech careers to experienced developers upskilling or switching roles.

---

## Auth

No authentication at launch. Fully public. Auth (for progress tracking, bookmarks) is a future addition.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Graph | React Flow |
| Content | MDX + JSON flat files |
| Deployment | Vercel (free tier) |

No database, no backend. All content is flat files in the repo.

---

## Roles & Categories

Roles are grouped into three categories on the home page:

- **Software Engineering** — Frontend Engineer, Backend Engineer, Full Stack, DevOps/Cloud, Mobile Engineer, etc.
- **Data** — Data Scientist, Data Engineer, Data Analyst, etc.
- **AI & Machine Learning** — AI/ML Engineer, LLM Engineer, MLOps, etc.

New roles are added by creating one JSON file + skill MDX files.

---

## Routes

| Route | Description |
|---|---|
| `/` | Home — browse all roles grouped by category, with search |
| `/roadmap/[role]` | Interactive node graph for a role, with topics sidebar |
| `/skill/[slug]` | Dedicated resource page for a skill |

---

## Page Designs

### Home `/`

- Navbar with logo and category anchor links
- Search bar to filter roles by name
- Role cards grouped under category headings (Software Engineering / Data / AI & ML)
- Each card shows: role title, short description, skill count, and a "→" link

### Roadmap `/roadmap/[role]`

- Role title and subtitle ("X skills · Click any node to explore resources")
- **Left sidebar** listing all topics/skills for the role, grouped by phase (Foundation / Core / Advanced), each tagged `req` or `opt`
- **Main area** — React Flow interactive graph; nodes color-coded by phase; each node shows its label and a small `req`/`opt` badge
- Clicking a node navigates to `/skill/[slug]`
- Mobile: sidebar collapses to a toggle drawer

### Skill `/skill/[slug]`

- Breadcrumb: shows "← [Role Name]" when navigated from a roadmap (via query param `?from=frontend-engineer`); falls back to "← All Roadmaps" when accessed directly (e.g. via search or direct URL)
- Skill title + **REQUIRED** or **OPTIONAL** badge
- Short description paragraph
- **Topics Covered** — chip list of sub-topics (e.g. Components, Hooks, useEffect)
- **Prerequisites** — linked skill chips
- **Resources** — filter tabs (All / Free / Paid), then resource cards each showing: title, type icon (📄 docs / 🎥 video / 🎓 course), free/paid badge, source domain, external link

---

## Content Model

### `content/roadmaps/[role].json`

```json
{
  "id": "frontend-engineer",
  "title": "Frontend Engineer",
  "category": "software",
  "description": "Build interactive UIs for the web",
  "nodes": [
    {
      "id": "react",
      "label": "React",
      "required": true,
      "phase": "core",
      "position": { "x": 300, "y": 200 }
    }
  ],
  "edges": [
    { "source": "javascript", "target": "react" }
  ]
}
```

- `id` on each node maps directly to a `content/skills/[id].mdx` file
- `phase`: `"foundation"` | `"core"` | `"advanced"`

### `content/skills/[slug].mdx`

```mdx
---
title: React
description: A JS library for building UIs with components and hooks
topics: ["Components", "Props & State", "Hooks", "useEffect", "Context API", "React Router"]
prerequisites: ["javascript", "html-css"]
resources:
  - title: React Official Docs
    url: https://react.dev
    type: docs
    free: true
  - title: Epic React – Kent C. Dodds
    url: https://epicreact.dev
    type: course
    free: false
---

Optional long-form markdown content here.
```

- `type`: `"docs"` | `"video"` | `"course"` | `"article"`

### `content/categories.json`

```json
[
  { "id": "software", "label": "Software Engineering", "color": "indigo" },
  { "id": "data", "label": "Data", "color": "sky" },
  { "id": "ai", "label": "AI & Machine Learning", "color": "emerald" }
]
```

---

## Component Structure

```
src/
  app/
    page.tsx                  ← Home
    roadmap/[role]/page.tsx   ← Roadmap graph page
    skill/[slug]/page.tsx     ← Skill resource page
  components/
    RoleCard.tsx              ← Card on home page
    RoadmapGraph.tsx          ← React Flow wrapper
    TopicsSidebar.tsx         ← Sidebar with topic list + req/opt tags
    SkillNode.tsx             ← Custom React Flow node
    ResourceCard.tsx          ← Single resource item
    ResourceFilter.tsx        ← All / Free / Paid filter tabs
    TopicsChips.tsx           ← Topics covered chip list
  lib/
    content.ts                ← Helpers to read/parse JSON + MDX files (uses gray-matter for frontmatter, next-mdx-remote for rendering)
```

---

## Mobile Behaviour

- Home: single-column card grid on small screens
- Roadmap: sidebar collapses to a "Topics ▾" toggle drawer; graph is scrollable/zoomable via React Flow's built-in touch support
- Skill page: fully linear, stacks naturally on mobile

---

## Out of Scope (for now)

- User accounts / authentication
- Progress tracking
- Community features
- CMS / admin UI for editing content
