# GameHub

An **App Store for AI-generated 3D browser games** — discover, play, and rate the
next generation of instantly playable games. No downloads, just play.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Step 1 — Foundation & Design System

This first step sets up the project skeleton and a reusable, dark futuristic
design system. No real product pages exist yet; a temporary preview at
`/design-system` renders every component so the look can be verified.

### What's included

- **Project structure** under `src/`:
  - `components/ui/` — reusable UI components
  - `lib/` — utilities (`cn`, number formatting)
  - `types/` — domain types
  - `data/` — mock data
- **Design system**
  - Dark futuristic theme: background `#0a0a0f`, surface `#12121a`, electric
    cyan accent `#00e5ff`, purple secondary `#8b5cf6`
  - Fonts: **Space Grotesk** (headings), **Inter** (body)
  - Components: `Button` (primary/secondary/ghost), `Card`, `Badge`, `Input`,
    `StarRating`
- **Types**: `Game`, `User`, `Review`, `Category`
- **Mock data**: 12 sample games, plus categories, users, and reviews

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The homepage
redirects to the **design system preview** at `/design-system`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Project structure

```
src/
├── app/
│   ├── design-system/page.tsx   # component preview (temporary)
│   ├── globals.css
│   ├── layout.tsx               # fonts + metadata
│   └── page.tsx                 # redirects to /design-system
├── components/
│   └── ui/                      # Button, Card, Badge, Input, StarRating
├── data/                        # categories, games, users, reviews (mock)
├── lib/
│   └── utils.ts
└── types/
    └── index.ts                 # Game, User, Review, Category
```
