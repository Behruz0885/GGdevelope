"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getUploadedGames, deleteGame } from "@/lib/storage"
import { Game } from "@/types"
import Button from "@/components/ui/Button"

export default function DashboardPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("gh_user")
    if (!raw || JSON.parse(raw).role !== "developer") {
      router.replace("/login")
      return
    }
    setGames(getUploadedGames())
    setReady(true)
  }, [router])

  if (!ready) return null

  const totalPlays = games.reduce((s, g) => s + g.playCount, 0)
  const avgRating = games.length
    ? (games.reduce((s, g) => s + g.rating, 0) / games.length).toFixed(1)
    : "—"

  const remove = (id: string) => {
    deleteGame(id)
    setGames(getUploadedGames())
    setConfirmId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Developer Dashboard</h1>
        <Link href="/dashboard/upload"><Button>+ Yangi o'yin</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { l: "O'yinlar", v: games.length },
          { l: "Jami o'ynalgan", v: totalPlays.toLocaleString() },
          { l: "O'rtacha reyting", v: avgRating },
          { l: "Sharhlar", v: 0 },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5">
            <p className="text-muted text-sm">{s.l}</p>
            <p className="font-heading text-2xl font-bold text-accent mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <h2 className="font-heading text-xl font-bold mb-4">Mening o'yinlarim</h2>
      {games.length === 0 ? (
        <p className="text-muted glass rounded-2xl p-8 text-center">
          Hali o'yin yuklamagansiz.{" "}
          <Link href="/dashboard/upload" className="text-accent">Birinchisini yuklang →</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div key={g.id} className="glass rounded-xl p-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.coverImage} alt="" className="w-24 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{g.title}</p>
                <p className="text-xs text-muted">{g.category} · v{g.version} · ▶ {g.playCount}</p>
              </div>
              <Link href={`/games/${g.id}`} className="text-sm text-accent">Ko'rish</Link>
              <button onClick={() => setConfirmId(g.id)} className="text-sm text-red-400">O'chirish</button>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="mb-4">Bu o'yinni o'chirishga ishonchingiz komilmi?</p>
            <div className="flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setConfirmId(null)}>Bekor qilish</Button>
              <Button onClick={() => remove(confirmId)}>O'chirish</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
