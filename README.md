# GameHub

An App Store for **AI-generated 3D browser games** — discover, play, and rate games made by AI.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Current status — Step 1: Foundation & design system

This step sets up the project skeleton and a reusable design system. Real
marketplace pages come in later steps.

- Project structure (`components`, `lib`, `types`, mock data)
- Dark, futuristic gaming theme (Space Grotesk + Inter)
- Reusable UI components: `Button`, `Card`, `Badge`, `Input`, `StarRating`
- Domain types: `Game`, `User`, `Review`, `Category`
- 12 sample games of mock data

## Getting started

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000` — landing page
- `http://localhost:3000/design-system` — **design system preview** (verify the look here)

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build (type-checked) |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint                      |

## Project structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout, font wiring
│   ├── globals.css          # Tailwind layers + base theme
│   ├── page.tsx             # Landing page
│   └── design-system/
│       └── page.tsx         # Design system preview
├── components/
│   └── ui/                  # Button, Card, Badge, Input, StarRating
├── lib/
│   ├── utils.ts             # cn() + formatting helpers
│   └── mock-data.ts         # Categories, users, reviews, 12 games
└── types/
    └── index.ts             # Game, User, Review, Category
```

## Theme tokens

| Token           | Value     | Usage                    |
| --------------- | --------- | ------------------------ |
| `background`    | `#0a0a0f` | Page background          |
| `surface`       | `#12121a` | Cards / panels           |
| `accent`        | `#00e5ff` | Electric cyan — primary  |
| `secondary`     | `#8b5cf6` | Purple — secondary       |
