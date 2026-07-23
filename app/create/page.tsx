"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import GameCard from "@/components/GameCard"
import { GAMES } from "@/lib/data"
import FadeIn from "@/components/FadeIn"

const GEN_STEPS = [
  "Dunyo va 3D shaderlar tayyorlanmoqda...",
  "Protsedural assetlar generatsiya qilinmoqda...",
  "O'yin va AI NPC logikasi qurilmoqda...",
  "Yakuniy WebGL sozlash va kompilyatsiya...",
]

export default function CreatePage() {
  const [prompt, setPrompt] = useState("")
  const [genStep, setGenStep] = useState(-1)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  const generate = () => {
    if (!prompt.trim()) return
    setGenStep(0)
    GEN_STEPS.forEach((_, i) =>
      setTimeout(() => {
        setGenStep(i + 1)
        if (i === GEN_STEPS.length - 1)
          setTimeout(() => { setGenStep(-1); setShowModal(true) }, 600)
      }, (i + 1) * 900)
    )
  }

  const examples = GAMES.slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 space-y-16">
      <FadeIn>
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-xs font-bold text-accent shadow-glow">
            <span>✨ AI STUDIO LABS</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-white">
            O'yiningizni <span className="text-gradient">ta'riflang</span>.<br />AI uni quradi.
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Masalan: "Neon shaharda uchar mashinalar poygasi" yoki "Kvant fizikasi bilan 3D puzzle labirinti"
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass rounded-3xl p-3 flex gap-3 shadow-glow border border-accent/30 bg-surface2/60">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Qanday 3D o'yin yaratishni xohlaysiz?"
            className="flex-1 bg-transparent px-5 outline-none text-white placeholder:text-muted text-base"
          />
          <Button onClick={generate} disabled={genStep >= 0} className="px-8 py-4 text-base shadow-glow">
            ✨ Generatsiya
          </Button>
        </div>
      </FadeIn>

      {genStep >= 0 && (
        <FadeIn>
          <div className="glass rounded-3xl p-8 space-y-3 border border-accent/40 shadow-glow">
            {GEN_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${i < genStep ? "bg-accent shadow-glow" : i === genStep ? "bg-accent-pink animate-ping" : "bg-white/10"}`} />
                <p className={`text-sm font-semibold ${i < genStep ? "text-accent" : i === genStep ? "text-white animate-pulse" : "text-muted"}`}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.2}>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "✍️", t: "1. Prompt Yozing", d: "G'oyangizni matn shaklida bering" },
            { icon: "👀", t: "2. Real-Time Play", d: "Yaratilgan WebGL o'yinni sinang" },
            { icon: "🚀", t: "3. Bir Bosishda Nashr", d: "Marketplace'ga chiqarib daromad qiling" },
          ].map((f) => (
            <div key={f.t} className="glass-card rounded-3xl p-6 text-center border border-white/10 space-y-2">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-heading font-bold text-white text-lg">{f.t}</h3>
              <p className="text-sm text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-white">AI Yaratgan O'yin Namunalari</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {examples.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      </FadeIn>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 max-w-sm w-full text-center border border-accent/40 shadow-glow space-y-4">
            {joined ? (
              <>
                <div className="text-5xl">✅</div>
                <h3 className="font-heading font-bold text-2xl text-white">Tabriklaymiz!</h3>
                <p className="text-sm text-slate-300">Siz VIP Waitlist ro'yxatiga qo'shildingiz.</p>
                <Button onClick={() => setShowModal(false)} className="w-full">Yopish</Button>
              </>
            ) : (
              <>
                <div className="text-5xl">🔜</div>
                <h3 className="font-heading text-2xl font-bold text-white">Tez Kunda!</h3>
                <p className="text-sm text-slate-300">
                  AI Live Studio hozirda sinovda. Birinchilardan bo'lib kirish uchun email-ni yozing:
                </p>
                <input className="input" placeholder="Sizning email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button className="w-full" onClick={() => email.includes("@") && setJoined(true)}>Waitlistga qo'shilish</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
