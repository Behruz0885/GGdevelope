import type { Review } from "@/types";
import { users } from "./users";

/** Build a lightweight author reference from a full user record. */
function authorOf(userId: string) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new Error(`Unknown user id in mock reviews: ${userId}`);
  }
  const { id, name, username, avatarUrl } = user;
  return { id, name, username, avatarUrl };
}

export const reviews: Review[] = [
  {
    id: "review-01",
    gameId: "game-01",
    author: authorOf("user-01"),
    rating: 5,
    title: "Absolutely electric",
    comment:
      "The drift mechanics feel incredible and the soundtrack is a whole mood. Instantly addictive.",
    createdAt: "2025-11-15",
    helpfulCount: 214,
  },
  {
    id: "review-02",
    gameId: "game-01",
    author: authorOf("user-03"),
    rating: 4,
    comment:
      "Great racer, but I wish there were more tracks at launch. Still, the boost chaining is chef's kiss.",
    createdAt: "2025-11-20",
    helpfulCount: 88,
  },
  {
    id: "review-03",
    gameId: "game-07",
    author: authorOf("user-02"),
    rating: 5,
    title: "My new roguelite obsession",
    comment:
      "The skill trees are deep and every run feels different. Permadeath actually matters here.",
    createdAt: "2026-01-02",
    helpfulCount: 341,
  },
  {
    id: "review-04",
    gameId: "game-07",
    author: authorOf("user-05"),
    rating: 5,
    comment: "Emberforge cooked. The loot loop is dangerously satisfying.",
    createdAt: "2026-01-05",
    helpfulCount: 127,
  },
  {
    id: "review-05",
    gameId: "game-05",
    author: authorOf("user-03"),
    rating: 4,
    title: "Smooth gunplay, no install",
    comment:
      "Can't believe this runs in a browser this well. Matchmaking could be faster though.",
    createdAt: "2026-01-25",
    helpfulCount: 156,
  },
  {
    id: "review-06",
    gameId: "game-06",
    author: authorOf("user-04"),
    rating: 5,
    title: "Pure comfort",
    comment:
      "Exactly the relaxing evening game I needed. The art direction is gorgeous.",
    createdAt: "2025-10-18",
    helpfulCount: 73,
  },
];

/** Get all reviews for a given game id, newest first. */
export function getReviewsForGame(gameId: string): Review[] {
  return reviews
    .filter((review) => review.gameId === gameId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
