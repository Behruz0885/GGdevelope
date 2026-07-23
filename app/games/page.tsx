"use client"

import { useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@heroui/react"
import { getAllGames } from "@/lib/storage"
import { CATEGORIES } from "@/lib/data"
import GameCard from "@/components/GameCard"
import FadeIn from "@/components/FadeIn"

type Sort = "newest" | "popular" | "top"

function GamesContent() {
  const params = useSearchParams()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(params.get("category") ?? "")
  const [sort, setSort] = useState<Sort>("popular")
  const [allGames] = useState(() => getAllGames())

  const filtered = useMemo(() => {
    let list = allGames.filter(
      (g) =>
        (!category || g.category === category) &&
        (g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.tags.some((t) => t.includes(query.toLowerCase())))
    )
    if (sort === "newest")
      list = [...list].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    if (sort === "popular") list = [...list].sort((a, b) => b.playCount - a.playCount)
    if (sort === "top") list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [allGames, query, category, sort])

  return (
    <>
      {/* Search & Filters Console */}
      <div className="glass rounded-3xl p-6 mb-10 border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search bar */}
          <div className="flex-1 w-full">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O'yin nomi yoki tegini yozing..."
              className="w-full"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-60 bg-surface2 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent text-sm"
          >
            <option value="" className="bg-surface text-white">Barcha kategoriyalar</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-surface text-white">
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full md:w-56 bg-surface2 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent text-sm"
          >
            <option value="popular" className="bg-surface text-white">🔥 Eng ko'p o'ynalgan</option>
            <option value="newest" className="bg-surface text-white">✨ Eng yangi</option>
            <option value="top" className="bg-surface text-white">⭐ Eng yuqori reyting</option>
          </select>
        </div>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !category
                ? "bg-accent text-bg shadow-glow"
                : "bg-surface2 text-muted hover:text-white"
            }`}
          >
            Barchasi ({allGames.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(category === c.name ? "" : c.name)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                category === c.name
                  ? "bg-accent text-bg shadow-glow"
                  : "bg-surface2 text-muted hover:text-white"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center max-w-md mx-auto space-y-4 my-12">
          <span className="text-5xl inline-block">🛸</span>
          <h3 className="font-heading font-bold text-xl text-white">O'yin topilmadi</h3>
          <p className="text-muted text-sm">
            Qidiruv mezonlarini o'zgartiring yoki filtrlarni tozalang.
          </p>
          <button
            onClick={() => { setQuery(""); setCategory("") }}
            className="px-5 py-2.5 rounded-xl bg-accent/10 text-accent font-semibold border border-accent/20 hover:bg-accent/20 transition"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </>
  )
}

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
              <span>EXPLORE MARKETPLACE</span>
            </div>
            <h1 className="font-heading text-4xl font-black text-white">3D O'yinlar Katalogi</h1>
          </div>
          <p className="text-muted text-sm max-w-md">
            AI generatsiya qilgan hamda developerlar tomonidan yuklangan futuristik 3D WebGL o'yinlarni kashf qiling.
          </p>
        </div>

        <Suspense fallback={<div className="glass rounded-3xl p-20 text-center text-muted animate-pulse">Yuklanmoqda...</div>}>
          <GamesContent />
        </Suspense>
      </FadeIn>
    </div>
  )
}
