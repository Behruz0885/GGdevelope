/**
 * Core domain types for GameHub — a marketplace for AI-generated 3D browser games.
 * These types are the single source of truth shared across UI, mock data, and (later)
 * any real API layer.
 */

/** A category / genre used to group and filter games. */
export interface Category {
  id: string;
  /** Human-readable label, e.g. "Racing". */
  name: string;
  /** URL-friendly identifier, e.g. "racing". */
  slug: string;
  /** Short description shown on category pages. */
  description: string;
  /** Emoji or icon key used for quick visual identification. */
  icon: string;
}

/** A person on the platform: a player and/or a game developer. */
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  /** Whether this user has published at least one game. */
  isDeveloper: boolean;
  /** Optional short profile blurb. */
  bio?: string;
  joinedAt: string; // ISO-8601 date string
}

/** A single player review left on a game. */
export interface Review {
  id: string;
  gameId: string;
  author: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  /** Rating from 1 to 5 (whole stars). */
  rating: number;
  comment: string;
  createdAt: string; // ISO-8601 date string
}

/** A published, playable game listing. */
export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** Category slug this game belongs to. */
  category: string;
  /** Average rating from 0 to 5 (may be fractional). */
  rating: number;
  /** Total number of ratings that produced `rating`. */
  ratingCount: number;
  /** Lifetime number of plays. */
  playCount: number;
  /** Cover art shown in cards and hero sections. */
  coverImage: string;
  /** Display name of the developer / studio. */
  developer: string;
  /** Free-form tags used for search and discovery. */
  tags: string[];
  /** Whether the game is highlighted on the homepage. */
  featured: boolean;
  createdAt: string; // ISO-8601 date string
}
