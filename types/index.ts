export type Category =
  | "Action"
  | "Adventure"
  | "Puzzle"
  | "Racing"
  | "Simulation"
  | "Multiplayer"

export interface Game {
  id: string
  title: string
  description: string
  category: Category
  tags: string[]
  coverImage: string
  screenshots: string[]
  developer: string
  rating: number // 0–5
  playCount: number
  releaseDate: string
  version: string
  gameUrl: string // WebGL/iframe URL
  featured?: boolean
}

export interface Review {
  id: string
  gameId: string
  author: string
  rating: number
  text: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "player" | "developer"
}
