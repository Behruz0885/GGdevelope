"use client"

import Link from "next/link"
import { Game } from "@/types"
import Badge from "./ui/Badge"
import StarRating from "./ui/StarRating"

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`} className="block group">
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 group-hover:border-accent/50 group-hover:shadow-glow transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col">
        <div className="p-0 relative overflow-hidden aspect-video bg-surface2">
          {/* Cover image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

          {/* Top Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge>{game.category}</Badge>
          </div>

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-bg/40 backdrop-blur-xs">
            <div className="w-12 h-12 rounded-full bg-accent text-bg font-bold flex items-center justify-center text-lg shadow-glow transform group-hover:scale-110 transition-transform">
              ▶
            </div>
          </div>
        </div>

        <div className="p-5 flex-col items-start gap-3 flex-1 justify-between bg-surface/80 flex">
          <div>
            <h3 className="font-heading font-bold text-lg text-white group-hover:text-accent transition-colors truncate">
              {game.title}
            </h3>
            <p className="text-xs text-muted mt-1 truncate">{game.developer}</p>
          </div>

          <div className="flex items-center justify-between w-full pt-2 border-t border-white/5">
            <StarRating rating={game.rating} />
            <span className="text-xs font-semibold text-accent/80 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
              ▶ {fmt(game.playCount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
