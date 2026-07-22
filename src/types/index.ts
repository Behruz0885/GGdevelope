/**
 * Core domain types for GameHub — a marketplace for AI-generated
 * 3D browser games.
 */

/** A game category / genre used to organize the catalog. */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Emoji or short glyph used as a lightweight icon. */
  icon: string;
  /** Tailwind-friendly accent color token for UI theming. */
  accentColor: "accent" | "secondary" | "success" | "warning" | "danger";
}

/** A platform user. Users can be players and/or developers. */
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  /** Whether the user publishes games on the platform. */
  isDeveloper: boolean;
  /** ISO date string for when the user joined. */
  joinedAt: string;
}

/** A user-submitted review for a specific game. */
export interface Review {
  id: string;
  gameId: string;
  /** Lightweight author reference for display purposes. */
  author: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  /** Star rating from 1 to 5. */
  rating: number;
  title?: string;
  comment: string;
  /** ISO date string for when the review was posted. */
  createdAt: string;
  /** Number of users who found this review helpful. */
  helpfulCount: number;
}

/** A published game listing in the marketplace. */
export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** One-line summary used in compact cards. */
  shortDescription: string;
  /** References {@link Category.id}. */
  categoryId: string;
  /** Average rating from 0 to 5 (one decimal). */
  rating: number;
  /** Total number of ratings that produced `rating`. */
  ratingCount: number;
  /** Total number of times the game has been played. */
  playCount: number;
  /** URL of the cover / thumbnail image. */
  coverImage: string;
  /** Display name of the developer / studio. */
  developer: string;
  /** Free-form discovery tags. */
  tags: string[];
  /** Whether the game is highlighted on the homepage. */
  featured: boolean;
  /** ISO date string for the release date. */
  releaseDate: string;
}
