import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-action",
    name: "Action",
    slug: "action",
    description: "Fast-paced games full of combat, reflexes, and adrenaline.",
    icon: "⚔️",
    accentColor: "danger",
  },
  {
    id: "cat-puzzle",
    name: "Puzzle",
    slug: "puzzle",
    description: "Brain-teasers and logic challenges that test your wits.",
    icon: "🧩",
    accentColor: "accent",
  },
  {
    id: "cat-racing",
    name: "Racing",
    slug: "racing",
    description: "High-speed driving and time-trial thrills.",
    icon: "🏎️",
    accentColor: "warning",
  },
  {
    id: "cat-adventure",
    name: "Adventure",
    slug: "adventure",
    description: "Explore vast worlds and uncover hidden stories.",
    icon: "🗺️",
    accentColor: "success",
  },
  {
    id: "cat-shooter",
    name: "Shooter",
    slug: "shooter",
    description: "Aim, shoot, and survive in intense arenas.",
    icon: "🎯",
    accentColor: "secondary",
  },
  {
    id: "cat-strategy",
    name: "Strategy",
    slug: "strategy",
    description: "Outsmart opponents with planning and tactics.",
    icon: "♟️",
    accentColor: "accent",
  },
  {
    id: "cat-rpg",
    name: "RPG",
    slug: "rpg",
    description: "Level up heroes and shape epic role-playing journeys.",
    icon: "🐉",
    accentColor: "secondary",
  },
  {
    id: "cat-arcade",
    name: "Arcade",
    slug: "arcade",
    description: "Pick-up-and-play classics with instant fun.",
    icon: "👾",
    accentColor: "warning",
  },
];

/** Look up a category by its id. */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

/** Look up a category by its slug. */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
