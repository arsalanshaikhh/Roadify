# Roadify

> Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill.

**Live:** [roadify.vercel.app](https://roadify.vercel.app)

---

## What is Roadify?

Roadify helps developers, students, and career-switchers find their learning path. Pick a role, explore an interactive skill graph, and get curated free resources — docs, videos, courses, and books — for every skill on the map.

**Roles covered:**
- Software Engineering — Frontend, Backend, Full Stack, DevOps/Cloud
- Data — Data Scientist, Data Engineer
- AI & Machine Learning — AI/ML Engineer

---

## Features

- **Interactive roadmap graph** — Visual node graph per role, built with React Flow. Click any node to open its resource page.
- **Curated resources per skill** — 7–10 hand-picked free resources (docs, videos, courses, books) per skill, filterable by Free / Paid.
- **Topics covered** — Each skill shows the sub-topics it covers so you know what you're signing up for.
- **Prerequisites** — Skills show what you need to know first, with direct links.
- **30+ roles and skills** — Covering the full software + data + AI landscape.
- **Mobile-friendly** — Responsive layout; sidebar collapses to a toggle drawer on small screens.
- **Fast & SEO-ready** — Statically generated, sitemap.xml, robots.txt, Open Graph meta per page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Graph | @xyflow/react v12 |
| Content | MDX + JSON flat files |
| Testing | Vitest + React Testing Library |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |

---

## Project Structure

```
roadify/
├── content/
│   ├── categories.json          # Category definitions (software, data, ai)
│   ├── roadmaps/                # One JSON file per role (graph nodes + edges)
│   │   ├── frontend-engineer.json
│   │   ├── backend-engineer.json
│   │   └── ...
│   └── skills/                  # One MDX file per skill (topics + resources)
│       ├── react.mdx
│       ├── python.mdx
│       └── ...
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home — role cards with search
│   │   ├── roadmap/[role]/      # Interactive node graph page
│   │   ├── skill/[slug]/        # Skill resource page
│   │   ├── sitemap.ts           # Auto-generated sitemap.xml
│   │   ├── robots.ts            # Auto-generated robots.txt
│   │   ├── not-found.tsx        # Custom 404 page
│   │   └── error.tsx            # Error boundary
│   ├── components/
│   │   ├── RoadmapGraph.tsx     # React Flow graph wrapper
│   │   ├── TopicsSidebar.tsx    # Phase-grouped skill list with req/opt tags
│   │   ├── SkillNode.tsx        # Custom React Flow node
│   │   ├── ResourceCard.tsx     # Single resource item
│   │   ├── ResourceFilter.tsx   # All / Free / Paid filter tabs
│   │   └── ...
│   └── lib/
│       ├── content.ts           # File-reading helpers (gray-matter)
│       └── types.ts             # Shared TypeScript types
└── .github/
    └── workflows/
        └── ci.yml               # Lint + typecheck + test on push/PR
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/roadify.git
cd roadify

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding a New Role

1. Create `content/roadmaps/your-role.json` — define the graph nodes and edges:

```json
{
  "id": "your-role",
  "title": "Your Role",
  "category": "software",
  "description": "Short description of the role.",
  "nodes": [
    { "id": "skill-slug", "label": "Skill Name", "required": true, "phase": "foundation", "position": { "x": 250, "y": 0 } }
  ],
  "edges": [
    { "source": "skill-slug", "target": "next-skill-slug" }
  ]
}
```

2. Create `content/skills/skill-slug.mdx` for each new skill node:

```mdx
---
title: Skill Name
description: What this skill is about.
topics:
  - Topic One
  - Topic Two
prerequisites:
  - other-skill-slug
resources:
  - title: Resource Title
    url: https://example.com
    type: docs
    free: true
---
```

3. That's it — the home page, roadmap graph, and sitemap update automatically.

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://roadify.vercel.app` | Used in sitemap and robots.txt |

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm test           # Run Vitest test suite
npm run test:watch # Watch mode
```

---

## Deployment

Push to GitHub and connect to [Vercel](https://vercel.com) — it deploys automatically on every push to `main`.

Set `NEXT_PUBLIC_SITE_URL` to your production domain in Vercel's environment variables.

---

## Roadmap

- [ ] User accounts & authentication
- [ ] Progress tracking (mark skills as learned)
- [ ] Bookmarked resources
- [ ] Subscription tiers with premium resources
- [ ] Personalized path recommendations
- [ ] Community contributions for new roles/resources

---

## License

MIT
