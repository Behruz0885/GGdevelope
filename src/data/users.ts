import type { User } from "@/types";

/** Avatar URL from picsum.photos, seeded per-user for stability. */
function avatar(seed: string): string {
  return `https://picsum.photos/seed/${seed}/128/128`;
}

export const users: User[] = [
  {
    id: "user-01",
    name: "Aria Kwon",
    username: "ariaplays",
    avatarUrl: avatar("aria-kwon"),
    bio: "Speedrunner and puzzle enthusiast. Always chasing the next leaderboard.",
    isDeveloper: false,
    joinedAt: "2025-03-11",
  },
  {
    id: "user-02",
    name: "Marcus Bell",
    username: "mbell",
    avatarUrl: avatar("marcus-bell"),
    bio: "Indie dev by day, RPG grinder by night.",
    isDeveloper: true,
    joinedAt: "2024-12-02",
  },
  {
    id: "user-03",
    name: "Lena Fischer",
    username: "lenaf",
    avatarUrl: avatar("lena-fischer"),
    bio: "Competitive shooter player. GG or GTFO.",
    isDeveloper: false,
    joinedAt: "2025-06-19",
  },
  {
    id: "user-04",
    name: "Diego Alvarez",
    username: "diegoa",
    avatarUrl: avatar("diego-alvarez"),
    bio: "Casual gamer who loves cozy adventures.",
    isDeveloper: false,
    joinedAt: "2025-01-27",
  },
  {
    id: "user-05",
    name: "Priya Nair",
    username: "priyanair",
    avatarUrl: avatar("priya-nair"),
    bio: "Strategy nerd. If it has a tech tree, I'm in.",
    isDeveloper: true,
    joinedAt: "2024-10-08",
  },
];

/** Look up a user by id. */
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}
