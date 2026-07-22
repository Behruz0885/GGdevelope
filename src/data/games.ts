import type { Game } from "@/types";

/**
 * A cover image URL from picsum.photos, seeded per-game so the image
 * stays stable between renders. Replace with real assets later.
 */
function cover(seed: string): string {
  return `https://picsum.photos/seed/${seed}/600/400`;
}

export const games: Game[] = [
  {
    id: "game-01",
    slug: "neon-drift",
    title: "Neon Drift",
    description:
      "Tear through a synthwave megacity in this high-octane arcade racer. Drift around neon corners, chain boosts, and top the global leaderboards. Every track is procedurally lit for a fresh vibe each run.",
    shortDescription: "Synthwave arcade racing through a neon megacity.",
    categoryId: "cat-racing",
    rating: 4.7,
    ratingCount: 2841,
    playCount: 128400,
    coverImage: cover("neon-drift"),
    developer: "Vortex Labs",
    tags: ["racing", "synthwave", "arcade", "multiplayer"],
    featured: true,
    releaseDate: "2025-11-02",
  },
  {
    id: "game-02",
    slug: "cube-cascade",
    title: "Cube Cascade",
    description:
      "A meditative 3D block puzzle where gravity bends to your will. Rotate the world, align the falling cubes, and clear cascading combos across 60 hand-crafted levels.",
    shortDescription: "Gravity-bending 3D block puzzle with combo chains.",
    categoryId: "cat-puzzle",
    rating: 4.5,
    ratingCount: 1520,
    playCount: 74200,
    coverImage: cover("cube-cascade"),
    developer: "Quiet Pixel",
    tags: ["puzzle", "relaxing", "logic", "singleplayer"],
    featured: false,
    releaseDate: "2025-09-18",
  },
  {
    id: "game-03",
    slug: "starforge-tactics",
    title: "Starforge Tactics",
    description:
      "Command a fleet in this turn-based space strategy game. Mine asteroids, research tech trees, and outmaneuver rival admirals in tense grid-based battles across the galaxy.",
    shortDescription: "Turn-based space strategy across a living galaxy.",
    categoryId: "cat-strategy",
    rating: 4.8,
    ratingCount: 3390,
    playCount: 96700,
    coverImage: cover("starforge-tactics"),
    developer: "Orbital Nine",
    tags: ["strategy", "space", "turn-based", "sci-fi"],
    featured: true,
    releaseDate: "2025-12-05",
  },
  {
    id: "game-04",
    slug: "shadow-runner",
    title: "Shadow Runner",
    description:
      "Sprint, wall-run, and slide through a collapsing cyber-dungeon. Reflex-driven action where a split-second decision means survival or a spectacular wipeout.",
    shortDescription: "Reflex-driven parkour through a collapsing dungeon.",
    categoryId: "cat-action",
    rating: 4.3,
    ratingCount: 1985,
    playCount: 110300,
    coverImage: cover("shadow-runner"),
    developer: "Pulse Forge",
    tags: ["action", "parkour", "endless", "arcade"],
    featured: false,
    releaseDate: "2025-08-27",
  },
  {
    id: "game-05",
    slug: "arena-breakout-x",
    title: "Arena Breakout X",
    description:
      "A browser-native arena shooter with buttery-smooth 3D gunplay. Drop into 6v6 matches, unlock loadouts, and climb the ranked ladder — no downloads, just play.",
    shortDescription: "6v6 browser arena shooter with ranked play.",
    categoryId: "cat-shooter",
    rating: 4.6,
    ratingCount: 4120,
    playCount: 203800,
    coverImage: cover("arena-breakout-x"),
    developer: "Nova Interactive",
    tags: ["shooter", "multiplayer", "competitive", "fps"],
    featured: true,
    releaseDate: "2026-01-14",
  },
  {
    id: "game-06",
    slug: "whispering-isles",
    title: "Whispering Isles",
    description:
      "Set sail across a hand-painted archipelago and piece together the mystery of its vanished inhabitants. A cozy exploration adventure with light puzzles and no fail states.",
    shortDescription: "Cozy sailing adventure across a mysterious archipelago.",
    categoryId: "cat-adventure",
    rating: 4.4,
    ratingCount: 1240,
    playCount: 58900,
    coverImage: cover("whispering-isles"),
    developer: "Lantern Studio",
    tags: ["adventure", "exploration", "cozy", "story"],
    featured: false,
    releaseDate: "2025-10-09",
  },
  {
    id: "game-07",
    slug: "dungeon-of-eldra",
    title: "Dungeon of Eldra",
    description:
      "Roll a hero, delve procedurally generated dungeons, and grow from scrappy adventurer to legend. Loot, skill trees, and permadeath give every run real stakes.",
    shortDescription: "Roguelite RPG dungeon crawler with deep loot.",
    categoryId: "cat-rpg",
    rating: 4.9,
    ratingCount: 5210,
    playCount: 141200,
    coverImage: cover("dungeon-of-eldra"),
    developer: "Emberforge",
    tags: ["rpg", "roguelite", "loot", "fantasy"],
    featured: true,
    releaseDate: "2025-12-20",
  },
  {
    id: "game-08",
    slug: "hyper-hoops",
    title: "Hyper Hoops",
    description:
      "Fast, flashy 3-on-3 arcade basketball with gravity-defying dunks and over-the-top power-ups. Easy to learn, endlessly fun to master with friends.",
    shortDescription: "Over-the-top 3-on-3 arcade basketball.",
    categoryId: "cat-arcade",
    rating: 4.2,
    ratingCount: 980,
    playCount: 47600,
    coverImage: cover("hyper-hoops"),
    developer: "Bounce House",
    tags: ["arcade", "sports", "multiplayer", "casual"],
    featured: false,
    releaseDate: "2025-07-30",
  },
  {
    id: "game-09",
    slug: "mech-uprising",
    title: "Mech Uprising",
    description:
      "Pilot a customizable battle mech through a war-torn 3D frontier. Blend action and light strategy as you manage heat, ammo, and positioning against relentless waves.",
    shortDescription: "Pilot a custom battle mech against endless waves.",
    categoryId: "cat-action",
    rating: 4.5,
    ratingCount: 2260,
    playCount: 88100,
    coverImage: cover("mech-uprising"),
    developer: "Iron Cortex",
    tags: ["action", "mech", "sci-fi", "waves"],
    featured: false,
    releaseDate: "2025-11-22",
  },
  {
    id: "game-10",
    slug: "gravity-golf",
    title: "Gravity Golf",
    description:
      "Putt across floating islands where each course has its own gravity rules. A relaxed physics puzzler that gets deviously clever the deeper you go.",
    shortDescription: "Physics mini-golf across low-gravity floating islands.",
    categoryId: "cat-puzzle",
    rating: 4.6,
    ratingCount: 1710,
    playCount: 65400,
    coverImage: cover("gravity-golf"),
    developer: "Quiet Pixel",
    tags: ["puzzle", "physics", "relaxing", "casual"],
    featured: false,
    releaseDate: "2026-02-03",
  },
  {
    id: "game-11",
    slug: "velocity-royale",
    title: "Velocity Royale",
    description:
      "A 30-player racing battle royale — the track shrinks, hazards multiply, and only one racer crosses the final line. Pure chaotic fun in your browser.",
    shortDescription: "30-player racing battle royale on a shrinking track.",
    categoryId: "cat-racing",
    rating: 4.1,
    ratingCount: 1330,
    playCount: 99200,
    coverImage: cover("velocity-royale"),
    developer: "Vortex Labs",
    tags: ["racing", "battle-royale", "multiplayer", "chaos"],
    featured: false,
    releaseDate: "2026-01-28",
  },
  {
    id: "game-12",
    slug: "empire-of-sand",
    title: "Empire of Sand",
    description:
      "Build a desert civilization from a single oasis. Balance trade, water, and defense in this approachable real-time strategy game with a striking low-poly art style.",
    shortDescription: "Low-poly desert city-builder and RTS.",
    categoryId: "cat-strategy",
    rating: 4.7,
    ratingCount: 2040,
    playCount: 71800,
    coverImage: cover("empire-of-sand"),
    developer: "Dune & Co.",
    tags: ["strategy", "city-builder", "rts", "low-poly"],
    featured: true,
    releaseDate: "2025-10-31",
  },
];

/** Look up a game by its slug. */
export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

/** Get all games belonging to a category id. */
export function getGamesByCategory(categoryId: string): Game[] {
  return games.filter((game) => game.categoryId === categoryId);
}

/** Get the games flagged as featured. */
export function getFeaturedGames(): Game[] {
  return games.filter((game) => game.featured);
}
