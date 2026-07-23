import { Game } from "@/types"
import { GAMES } from "./data"

const KEY = "gh_games"

export const getUploadedGames = (): Game[] =>
  typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem(KEY) ?? "[]")

export const getAllGames = (): Game[] => [...getUploadedGames(), ...GAMES]

export const saveGame = (game: Game) =>
  localStorage.setItem(KEY, JSON.stringify([game, ...getUploadedGames()]))

export const deleteGame = (id: string) =>
  localStorage.setItem(KEY, JSON.stringify(getUploadedGames().filter((g) => g.id !== id)))
