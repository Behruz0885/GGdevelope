import type { Category, Game, Review, User } from "@/types";

/** Stable placeholder cover art from picsum (seeded so images don't change between loads). */
const cover = (seed: string) => `https://picsum.photos/seed/${seed}/640/400`;
const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

export const categories: Category[] = [
  {
    id: "cat-racing",
    name: "Racing",
    slug: "racing",
    description: "High-speed circuits, drifts, and neon streets.",
    icon: "🏎️",
  },
  {
    id: "cat-shooter",
    name: "Shooter",
    slug: "shooter",
    description: "Fast reflexes and precise aim across arenas.",
    icon: "🎯",
  },
  {
    id: "cat-puzzle",
    name: "Puzzle",
    slug: "puzzle",
    description: "Brain-bending logic and spatial challenges.",
    icon: "🧩",
  },
  {
    id: "cat-adventure",
    name: "Adventure",
    slug: "adventure",
    description: "Explore worlds and uncover hidden stories.",
    icon: "🗺️",
  },
  {
    id: "cat-strategy",
    name: "Strategy",
    slug: "strategy",
    description: "Outthink opponents and command your forces.",
    icon: "♟️",
  },
  {
    id: "cat-arcade",
    name: "Arcade",
    slug: "arcade",
    description: "Pick-up-and-play classics with a modern twist.",
    icon: "👾",
  },
  {
    id: "cat-rpg",
    name: "RPG",
    slug: "rpg",
    description: "Level up, build a party, and shape your destiny.",
    icon: "⚔️",
  },
  {
    id: "cat-simulation",
    name: "Simulation",
    slug: "simulation",
    description: "Build, manage, and simulate living systems.",
    icon: "🛰️",
  },
];

export const users: User[] = [
  {
    id: "user-nova",
    name: "Nova Labs",
    username: "novalabs",
    avatarUrl: avatar("novalabs"),
    isDeveloper: true,
    bio: "Generative game studio pushing WebGL to its limits.",
    joinedAt: "2025-01-14",
  },
  {
    id: "user-pixel",
    name: "Pixel Forge",
    username: "pixelforge",
    avatarUrl: avatar("pixelforge"),
    isDeveloper: true,
    bio: "AI-assisted arcade experiences.",
    joinedAt: "2025-03-02",
  },
  {
    id: "user-mira",
    name: "Mira Chen",
    username: "mirac",
    avatarUrl: avatar("mirac"),
    isDeveloper: false,
    joinedAt: "2025-05-20",
  },
  {
    id: "user-dev42",
    name: "Dev42",
    username: "dev42",
    avatarUrl: avatar("dev42"),
    isDeveloper: false,
    joinedAt: "2025-06-11",
  },
];

export const games: Game[] = [
  {
    id: "game-neon-drift",
    title: "Neon Drift",
    slug: "neon-drift",
    description:
      "Tear through a synthwave metropolis in this AI-crafted arcade racer. Drift, boost, and chain combos across procedurally generated night circuits.",
    category: "racing",
    rating: 4.7,
    ratingCount: 1284,
    playCount: 152300,
    coverImage: cover("neon-drift"),
    developer: "Nova Labs",
    tags: ["racing", "synthwave", "3d", "multiplayer"],
    featured: true,
    createdAt: "2025-02-10",
  },
  {
    id: "game-void-breakers",
    title: "Void Breakers",
    slug: "void-breakers",
    description:
      "A zero-gravity arena shooter where every map is generated on the fly. Master momentum and outgun rivals in stylish low-poly space stations.",
    category: "shooter",
    rating: 4.4,
    ratingCount: 902,
    playCount: 98120,
    coverImage: cover("void-breakers"),
    developer: "Pixel Forge",
    tags: ["shooter", "space", "fast-paced", "3d"],
    featured: true,
    createdAt: "2025-03-18",
  },
  {
    id: "game-cube-logic",
    title: "Cube Logic",
    slug: "cube-logic",
    description:
      "Rotate, fold, and align impossible geometry to solve 60 hand-tuned puzzles. Relaxing, meditative, and surprisingly deep.",
    category: "puzzle",
    rating: 4.8,
    ratingCount: 2043,
    playCount: 210400,
    coverImage: cover("cube-logic"),
    developer: "Nova Labs",
    tags: ["puzzle", "relaxing", "geometry", "single-player"],
    featured: true,
    createdAt: "2025-01-29",
  },
  {
    id: "game-lost-atlas",
    title: "Lost Atlas",
    slug: "lost-atlas",
    description:
      "Sail an endless procedural ocean and chart forgotten islands. An atmospheric exploration adventure that runs entirely in your browser.",
    category: "adventure",
    rating: 4.2,
    ratingCount: 671,
    playCount: 64230,
    coverImage: cover("lost-atlas"),
    developer: "Pixel Forge",
    tags: ["adventure", "exploration", "open-world", "relaxing"],
    featured: false,
    createdAt: "2025-04-05",
  },
  {
    id: "game-hex-command",
    title: "Hex Command",
    slug: "hex-command",
    description:
      "Command armies on shifting hex battlefields. An accessible turn-based strategy game with AI opponents that adapt to your playstyle.",
    category: "strategy",
    rating: 4.5,
    ratingCount: 813,
    playCount: 77980,
    coverImage: cover("hex-command"),
    developer: "Nova Labs",
    tags: ["strategy", "turn-based", "tactics", "ai"],
    featured: false,
    createdAt: "2025-03-27",
  },
  {
    id: "game-pixel-blaster",
    title: "Pixel Blaster",
    slug: "pixel-blaster",
    description:
      "A retro-flavored arcade shoot-'em-up with modern juice. Dodge bullet storms and rack up score multipliers to top the global ladder.",
    category: "arcade",
    rating: 4.1,
    ratingCount: 559,
    playCount: 51200,
    coverImage: cover("pixel-blaster"),
    developer: "Pixel Forge",
    tags: ["arcade", "retro", "high-score", "bullet-hell"],
    featured: false,
    createdAt: "2025-05-12",
  },
  {
    id: "game-ember-realm",
    title: "Ember Realm",
    slug: "ember-realm",
    description:
      "A browser RPG with a living, AI-driven world. Build a party, learn spells, and shape a branching story that remembers your choices.",
    category: "rpg",
    rating: 4.6,
    ratingCount: 1490,
    playCount: 133700,
    coverImage: cover("ember-realm"),
    developer: "Nova Labs",
    tags: ["rpg", "story", "party", "fantasy"],
    featured: true,
    createdAt: "2025-02-22",
  },
  {
    id: "game-orbital-city",
    title: "Orbital City",
    slug: "orbital-city",
    description:
      "Design and run a self-sustaining space colony. Balance power, oxygen, and morale in this cozy management sim generated fresh each run.",
    category: "simulation",
    rating: 4.3,
    ratingCount: 726,
    playCount: 68410,
    coverImage: cover("orbital-city"),
    developer: "Pixel Forge",
    tags: ["simulation", "management", "space", "building"],
    featured: false,
    createdAt: "2025-04-19",
  },
  {
    id: "game-apex-circuit",
    title: "Apex Circuit",
    slug: "apex-circuit",
    description:
      "Precision time-trial racing on gravity-defying tracks. Shave milliseconds, unlock ghosts, and chase leaderboard perfection.",
    category: "racing",
    rating: 4.0,
    ratingCount: 431,
    playCount: 39800,
    coverImage: cover("apex-circuit"),
    developer: "Nova Labs",
    tags: ["racing", "time-trial", "leaderboard", "3d"],
    featured: false,
    createdAt: "2025-05-30",
  },
  {
    id: "game-mind-maze",
    title: "Mind Maze",
    slug: "mind-maze",
    description:
      "Navigate 3D labyrinths that rearrange as you think. A first-person puzzle experience with a haunting generative soundtrack.",
    category: "puzzle",
    rating: 4.9,
    ratingCount: 3122,
    playCount: 298700,
    coverImage: cover("mind-maze"),
    developer: "Pixel Forge",
    tags: ["puzzle", "first-person", "atmospheric", "3d"],
    featured: true,
    createdAt: "2025-01-08",
  },
  {
    id: "game-shadow-run",
    title: "Shadow Run",
    slug: "shadow-run",
    description:
      "A neon stealth-action platformer. Slip past patrols, hack terminals, and vanish into the dark in this stylish cyberpunk romp.",
    category: "adventure",
    rating: 4.4,
    ratingCount: 984,
    playCount: 91560,
    coverImage: cover("shadow-run"),
    developer: "Nova Labs",
    tags: ["adventure", "stealth", "cyberpunk", "platformer"],
    featured: false,
    createdAt: "2025-06-02",
  },
  {
    id: "game-star-siege",
    title: "Star Siege",
    slug: "star-siege",
    description:
      "Defend the last outpost in a fast, tactical tower-defense hybrid. Mix towers and hero units against relentless generative waves.",
    category: "strategy",
    rating: 4.2,
    ratingCount: 604,
    playCount: 57340,
    coverImage: cover("star-siege"),
    developer: "Pixel Forge",
    tags: ["strategy", "tower-defense", "tactics", "waves"],
    featured: false,
    createdAt: "2025-06-21",
  },
];

export const reviews: Review[] = [
  {
    id: "review-1",
    gameId: "game-neon-drift",
    author: {
      id: "user-mira",
      name: "Mira Chen",
      username: "mirac",
      avatarUrl: avatar("mirac"),
    },
    rating: 5,
    comment:
      "The drifting feels incredible and the soundtrack is unreal. Can't believe this runs in a browser tab.",
    createdAt: "2025-06-01",
  },
  {
    id: "review-2",
    gameId: "game-neon-drift",
    author: {
      id: "user-dev42",
      name: "Dev42",
      username: "dev42",
      avatarUrl: avatar("dev42"),
    },
    rating: 4,
    comment: "Great arcade feel. Would love more track variety, but a blast.",
    createdAt: "2025-06-14",
  },
  {
    id: "review-3",
    gameId: "game-mind-maze",
    author: {
      id: "user-mira",
      name: "Mira Chen",
      username: "mirac",
      avatarUrl: avatar("mirac"),
    },
    rating: 5,
    comment: "Genuinely unsettling in the best way. The shifting walls got me.",
    createdAt: "2025-05-22",
  },
];

/** Convenience lookups used across pages. */
export const featuredGames = games.filter((g) => g.featured);

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGamesByCategory(categorySlug: string): Game[] {
  return games.filter((g) => g.category === categorySlug);
}

export function getReviewsForGame(gameId: string): Review[] {
  return reviews.filter((r) => r.gameId === gameId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
