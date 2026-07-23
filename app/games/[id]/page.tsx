"use client"

import { useState } from "react"
import Link from "next/link"
import { getAllGames } from "@/lib/storage"
import { REVIEWS } from "@/lib/data"
import Badge from "@/components/ui/Badge"
import StarRating from "@/components/ui/StarRating"
import Button from "@/components/ui/Button"
import GameCard from "@/components/GameCard"
import FadeIn from "@/components/FadeIn"

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const allGames = getAllGames()
  const game = allGames.find((g) => g.id === params.id)
  if (!game) return <p className="text-center text-muted py-32 font-bold text-xl">O'yin topilmadi 😕</p>

  const reviews = REVIEWS.filter((r) => r.gameId === game.id)
  const similar = allGames.filter((g) => g.category === game.category && g.id !== game.id).slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      <FadeIn>
        {/* Game Header Banner or Inline WebGL Player */}
        {isPlaying ? (
          <div className="glass rounded-3xl overflow-hidden border border-accent/40 shadow-glow p-4 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="font-heading font-bold text-lg text-white">{game.title} — GameHub WebGL Player</h2>
              </div>
              <Button variant="ghost" onClick={() => setIsPlaying(false)} className="text-xs">
                ✕ O'yinni yopish
              </Button>
            </div>
            
            {/* Embedded WebGL Player Container */}
            <div className="w-full h-[500px] md:h-[600px] bg-black rounded-2xl overflow-hidden relative border border-white/10 flex items-center justify-center">
              {game.gameUrl.startsWith("http") ? (
                <iframe
                  src={game.gameUrl}
                  title={game.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl animate-bounce">🎮</div>
                  <h3 className="font-heading text-2xl font-bold text-white">{game.title}</h3>
                  <p className="text-muted text-sm max-w-md mx-auto">
                    Ushbu o'yin GameHub platformasiga to'g'ridan-to'g'ri yuklangan.
                  </p>
                  <div className="inline-block px-6 py-3 rounded-xl bg-accent/20 text-accent font-bold border border-accent/40 shadow-glow">
                    ⚡ GameHub WebGL 3D Seans Faol
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden border border-white/10 glass shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.coverImage} alt={game.title} className="w-full h-80 md:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{game.category}</Badge>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    v{game.version}
                  </span>
                </div>
                <h1 className="font-heading text-4xl md:text-6xl font-black text-white">{game.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span className="font-semibold text-accent">👨‍💻 {game.developer}</span>
                  <span>•</span>
                  <StarRating rating={game.rating} />
                  <span>•</span>
                  <span>▶ {game.playCount.toLocaleString()} o'ynalgan</span>
                </div>
              </div>
              <Button onClick={() => setIsPlaying(true)} className="text-lg px-10 py-4 shadow-glow">
                ▶ GameHub-da O'ynash
              </Button>
            </div>
          </div>
        )}
      </FadeIn>

      {/* Main Info Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <h2 className="font-heading text-2xl font-bold text-white">Tavsif</h2>
            <p className="text-slate-300 leading-relaxed text-base">{game.description}</p>
          </section>

          <section className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <h2 className="font-heading text-2xl font-bold text-white">Skrinshotlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {game.screenshots.map((s, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 aspect-video group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 border border-white/10 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Sharhlar ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.length === 0 && <p className="text-muted text-sm">Hozircha sharhlar yozilmagan.</p>}
              {reviews.map((r) => (
                <div key={r.id} className="bg-surface2/60 rounded-2xl p-5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{r.author}</p>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-slate-300 text-sm">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Metadata */}
        <aside className="space-y-6">
          <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 text-sm">
            <h3 className="font-heading font-bold text-lg text-white border-b border-white/10 pb-3">Platforma Meta Ma'lumotlari</h3>
            <div className="flex justify-between"><span className="text-muted">Yuklagan Developer</span><span className="font-semibold text-accent">{game.developer}</span></div>
            <div className="flex justify-between"><span className="text-muted">Versiya</span><span className="font-semibold text-white">{game.version}</span></div>
            <div className="flex justify-between"><span className="text-muted">Yuklangan sana</span><span className="font-semibold text-white">{game.releaseDate}</span></div>
            <div className="flex justify-between"><span className="text-muted">Reyting</span><span className="font-semibold text-yellow-400">★ {game.rating} / 5</span></div>
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-xs text-muted block">Teglar:</span>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((t) => <Badge key={t}>#{t}</Badge>)}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Games */}
      {similar.length > 0 && (
        <section className="space-y-6 pt-6">
          <h2 className="font-heading text-2xl font-bold text-white">Boshqa Yuklangan O'yinlar</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </section>
      )}

      <div>
        <Link href="/games" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
          ← Barcha o'yinlarga qaytish
        </Link>
      </div>
    </div>
  )
}
