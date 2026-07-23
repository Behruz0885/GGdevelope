import { Game, Review } from "@/types"

export const GAMES: Game[] = [
  {
    id: "neon-drift-3d",
    title: "Neon Drift 3D",
    description: "GameHub platformasiga to'g'ridan-to'g'ri yuklangan futuristik 3D WebGL poyga o'yini.",
    category: "Racing",
    tags: ["3d", "neon", "webgl"],
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    ],
    developer: "GameHub Studio",
    rating: 5.0,
    playCount: 12800,
    releaseDate: "2026-07-20",
    version: "1.0.0",
    gameUrl: "https://slowroads.io/",
    featured: true,
  },
  {
    id: "cyber-arena-3d",
    title: "Cyber Arena 3D",
    description: "GameHub loyihasiga yuklangan 3D kibernetik jangovar arena o'yini.",
    category: "Action",
    tags: ["3d", "action", "arena"],
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    ],
    developer: "Vertex Labs",
    rating: 4.8,
    playCount: 9400,
    releaseDate: "2026-07-21",
    version: "1.1.0",
    gameUrl: "https://hexgl.bkcore.com/play/",
    featured: true,
  },
]

export const REVIEWS: Review[] = [
  {
    id: "r1",
    gameId: "neon-drift-3d",
    author: "Aziz K.",
    rating: 5,
    text: "GameHub platformasida bevosita o'ynash juda qulay va tez!",
    date: "2026-07-22",
  },
]

export const CATEGORIES = [
  { name: "Action", icon: "⚔️" },
  { name: "Adventure", icon: "🗺️" },
  { name: "Puzzle", icon: "🧩" },
  { name: "Racing", icon: "🏎️" },
  { name: "Simulation", icon: "🏗️" },
  { name: "Multiplayer", icon: "👥" },
] as const
