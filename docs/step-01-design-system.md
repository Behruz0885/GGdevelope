# GameHub — Step 1: Design System (Explainer)

> [!NOTE]
> This doc explains the first step of building **GameHub** — an "App Store" for
> AI-generated 3D browser games. It accompanies
> [PR #3](https://github.com/Behruz0885/GGdevelope/pull/3).

## Background

**For beginners (skip if you know Next.js):** [Next.js](https://nextjs.org) is a
React framework. Its modern **App Router** treats each folder under `src/app/`
as a route, and a `page.tsx` inside it becomes a visitable URL. Components are
**Server Components** by default (rendered on the server, zero JS shipped)
unless a file starts with the `"use client"` directive, which opts into
interactivity (state, event handlers) in the browser.

[Tailwind CSS](https://tailwindcss.com) is a utility-first styling system:
instead of writing CSS files, you compose classes like `bg-surface` or
`text-accent` directly in markup. A `tailwind.config.ts` file defines the
**design tokens** (colors, fonts, shadows) that those utilities map to.

**Narrow background for this change:** The repository `GGdevelope` was empty.
GameHub needs a consistent visual language before any real feature pages are
built. So this step establishes the skeleton (folders, config), a **design
system** (tokens + reusable components), the **domain types**, and **mock
data** — plus a throwaway preview page to eyeball everything.

> [!TIP]
> **Design system:** a single source of truth for reusable UI — color tokens,
> typography, and components — so every future page looks consistent without
> re-inventing buttons and cards.

## Intuition

The core idea is **separation of concerns** across four layers:

1. **Tokens** live in `tailwind.config.ts`. Change `#00e5ff` in one place and
   every cyan accent across the app updates.
2. **Components** (`Button`, `Card`, `Badge`, `Input`, `StarRating`) consume
   those tokens. They know *how* things look, not *what* data they show.
3. **Types** (`Game`, `User`, `Review`, `Category`) describe the shape of data,
   independent of UI.
4. **Mock data** provides realistic content so we can build and preview UI
   before a backend exists.

A concrete example — rendering a 4.7-star rating. `StarRating` doesn't store the
number; it receives `value={4.7}` and paints stars. For the `.7`, it overlays a
gold star clipped to 70% width on top of a grey star:

```
fraction = clamp(4.7 - 4, 0, 1) = 0.7   // the 5th star
width = `${0.7 * 100}%` = "70%"          // clip the gold overlay
```

That one trick handles any fractional rating with no special cases.

## Code

### 1. Design tokens (`tailwind.config.ts`)
The theme is extended with the GameHub palette, dual font families, and glow
shadows:

```ts
colors: {
  background: "#0a0a0f",
  surface: { DEFAULT: "#12121a", light: "#1a1a26", lighter: "#22222f" },
  accent:  { DEFAULT: "#00e5ff", hover: "#33ebff" },   // electric cyan
  secondary: { DEFAULT: "#8b5cf6", hover: "#a78bfa" }, // purple
},
fontFamily: {
  sans:    ['"Inter Variable"', "system-ui", "sans-serif"],
  heading: ['"Space Grotesk Variable"', '"Inter Variable"', "sans-serif"],
},
boxShadow: { glow: "0 0 20px rgba(0, 229, 255, 0.35)", /* ... */ },
```

### 2. Fonts, self-hosted (`layout.tsx`)
Instead of `next/font/google` (which fetches from Google at build time), fonts
are self-hosted via `@fontsource` packages installed from npm:

```tsx
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
```

### 3. The `cn()` helper (`lib/utils.ts`)
Every component merges class names with `cn()`, which combines `clsx`
(conditional joining) and `tailwind-merge` (conflict resolution, so a later
`p-4` overrides an earlier `p-5`).

### 4. Components (`components/ui/`)
`Button`, `Card`, `Badge`, and `Input` are token-driven with variant maps, e.g.:

```ts
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:shadow-glow ...",
  secondary: "bg-secondary text-white hover:shadow-glow-purple ...",
  ghost: "bg-transparent border border-white/10 hover:border-accent ...",
};
```

`StarRating` is the only `"use client"` component because it supports an
interactive (hover/click) mode with `useState`.

### 5. Types & mock data (`types/`, `data/`)
`Game` references a `Category` by `categoryId` (normalized), and helper
functions like `getCategoryById`, `getGamesByCategory`, and `getFeaturedGames`
resolve relationships. 12 games use seeded `picsum.photos` cover URLs.

### 6. Preview page (`app/design-system/page.tsx`)
A single page that renders the palette, typography, and every component —
including a sample game card composed from `Card` + `Badge` + `StarRating` +
`Button`. The home route `/` simply `redirect()`s here for now.

## Verification

> [!IMPORTANT]
> Everything was verified from a **fresh clone of the pushed branch**, not just
> the local working copy — this guarantees the exact tree on GitHub compiles.

- `npx tsc --noEmit` → **0 errors**.
- `npm run build` → **compiles successfully**, ESLint clean, routes generated.
- Headless screenshot of `/design-system` confirmed fonts, colors, all
  component states, and the interactive star rating render correctly.

**Manual QA steps:**
1. `git clone` the repo and `git checkout claude/gamehub-design-system-3a5aee4c`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000` → you'll be redirected to `/design-system`.
5. Check: headings use Space Grotesk, body uses Inter; buttons/badges/inputs
   match the dark theme; hover the interactive star row and click to set a
   rating; the sample game cards show real cover images (they load in the
   browser even though they're blocked in the CI sandbox).

## Alternatives

**Fonts: `@fontsource` (chosen) vs `next/font/google`**

| Pros of `@fontsource` (self-hosted) | Cons of `@fontsource` |
| --- | --- |
| Builds offline; no dependency on Google at build or runtime | Slightly larger repo/deps; manual if you want non-standard axes |
| No third-party request for users (privacy + reliability) | Doesn't auto-inline per-page font subsets like `next/font` |
| Deterministic builds in restricted CI | You pick the family name (`"Inter Variable"`) yourself |

**Preview: home `/` redirect (chosen) vs a dedicated `/design-system` only**

| Pros of redirecting `/` | Cons |
| --- | --- |
| Anyone opening the site immediately sees the components | `/` must be reclaimed for the real homepage next step |
| Zero guessing about the preview URL | A leftover redirect could surprise a future dev if forgotten |

## Suggested people to talk to

> [!NOTE]
> This is a **greenfield repository** — every file in this PR was authored in
> this session (co-authored with you). There is no prior commit history or other
> contributors to consult yet. As the project grows, this section will point to
> the people who last touched the files being changed.

## Quiz

<details>
<summary>1. Why is StarRating the only component marked "use client"?</summary>

- A. It imports an image — ❌ images don't require client components.
- B. It uses `useState` for interactive hover/click mode — ✅ correct; state and event handlers only work in client components.
- C. Tailwind requires it — ❌ Tailwind is build-time CSS, unrelated.
- D. It fetches data — ❌ it receives data via props.
</details>

<details>
<summary>2. How does StarRating render a fractional rating like 4.7?</summary>

- A. It rounds to the nearest whole star — ❌ that would lose the fraction.
- B. It uses 4.7 separate SVGs — ❌ not how it works.
- C. It overlays a gold star clipped to (fraction × 100)% width over a grey star — ✅ correct; the 5th star is clipped to 70%.
- D. It changes the star color opacity to 0.7 — ❌ it clips width, not opacity.
</details>

<details>
<summary>3. What problem does the cn() helper solve beyond joining strings?</summary>

- A. It fetches fonts — ❌ unrelated.
- B. It resolves conflicting Tailwind classes so later ones win (via `tailwind-merge`) — ✅ correct.
- C. It minifies CSS — ❌ that's the build step.
- D. It validates types — ❌ TypeScript does that.
</details>

<details>
<summary>4. Why does Game store categoryId instead of embedding the full Category?</summary>

- A. To normalize data — a single source of truth per category, resolved via `getCategoryById` — ✅ correct; avoids duplicated/inconsistent category data.
- B. Because TypeScript can't nest objects — ❌ it can.
- C. To make the JSON smaller for the network — ❌ it's mock data, not fetched.
- D. It's required by Tailwind — ❌ unrelated.
</details>

<details>
<summary>5. Why were the fonts switched from next/font/google to @fontsource?</summary>

- A. `@fontsource` looks different — ❌ same fonts, same look.
- B. `next/font/google` fetches from Google at build time, which fails in a network-restricted environment; `@fontsource` ships the files via npm — ✅ correct.
- C. Tailwind doesn't support Google Fonts — ❌ it does.
- D. To reduce the number of components — ❌ unrelated.
</details>
