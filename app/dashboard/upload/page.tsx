"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveGame } from "@/lib/storage"
import { CATEGORIES } from "@/lib/data"
import { Category } from "@/types"
import Button from "@/components/ui/Button"

const STEPS = ["Ma'lumot", "Rasmlar", "O'yin fayli", "Tasdiqlash"]

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    title: "", description: "", category: "Action" as Category, tags: "",
    coverImage: "", screenshots: [] as string[], gameUrl: "", version: "1.0.0",
  })

  const set = (k: string, v: unknown) => setForm({ ...form, [k]: v })

  const onFile = (e: React.ChangeEvent<HTMLInputElement>, key: "coverImage" | "screenshots") => {
    const files = Array.from(e.target.files ?? [])
    if (key === "coverImage" && files[0]) set("coverImage", URL.createObjectURL(files[0]))
    if (key === "screenshots") set("screenshots", files.map((f) => URL.createObjectURL(f)))
  }

  const next = () => {
    setError("")
    if (step === 0 && (form.title.trim().length < 2 || form.description.trim().length < 10))
      return setError("Nom va tavsifni to'liq kiriting (tavsif kamida 10 belgi)")
    if (step === 1 && !form.coverImage) return setError("Muqova rasmini yuklang")
    if (step === 2 && !form.gameUrl) return setError("O'yin havolasini kiriting")
    setStep(step + 1)
  }

  const publish = () => {
    saveGame({
      id: form.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: form.title,
      description: form.description,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: form.coverImage,
      screenshots: form.screenshots,
      developer: JSON.parse(localStorage.getItem("gh_user") ?? "{}").name ?? "Anonim",
      rating: 0,
      playCount: 0,
      releaseDate: new Date().toISOString().slice(0, 10),
      version: form.version,
      gameUrl: form.gameUrl,
    })
    setDone(true)
  }

  if (done)
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-heading text-2xl font-bold mb-2">O'yin e'lon qilindi!</h1>
        <p className="text-muted mb-6">O'yiningiz endi marketplace'da ko'rinadi.</p>
        <Button onClick={() => router.push("/dashboard")}>Dashboardga qaytish</Button>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading text-2xl font-bold mb-6">Yangi o'yin yuklash</h1>

      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 text-center text-xs pb-2 border-b-2 ${
              i <= step ? "border-accent text-accent" : "border-white/10 text-muted"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        {step === 0 && (
          <>
            <input className="input" placeholder="O'yin nomi" value={form.title} onChange={(e) => set("title", e.target.value)} />
            <textarea className="input min-h-28" placeholder="Tavsif" value={form.description} onChange={(e) => set("description", e.target.value)} />
            <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <input className="input" placeholder="Teglar (vergul bilan): 3d, racing" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </>
        )}

        {step === 1 && (
          <>
            <label className="block text-sm text-muted">Muqova rasmi</label>
            <input type="file" accept="image/*" onChange={(e) => onFile(e, "coverImage")} className="input" />
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="" className="rounded-xl w-full aspect-video object-cover" />
            )}
            <label className="block text-sm text-muted">Skrinshotlar (bir nechta)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => onFile(e, "screenshots")} className="input" />
          </>
        )}

        {step === 2 && (
          <>
            <input className="input" placeholder="O'yin havolasi (WebGL/HTML5 URL)" value={form.gameUrl} onChange={(e) => set("gameUrl", e.target.value)} />
            <input className="input" placeholder="Versiya" value={form.version} onChange={(e) => set("version", e.target.value)} />
            <p className="text-xs text-muted">Fayl yuklash (zip) real backend ulangach qo'shiladi — hozircha havola kiriting.</p>
          </>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted">Nom:</span> {form.title}</p>
            <p><span className="text-muted">Kategoriya:</span> {form.category}</p>
            <p><span className="text-muted">Teglar:</span> {form.tags || "—"}</p>
            <p><span className="text-muted">Havola:</span> {form.gameUrl}</p>
            <p><span className="text-muted">Versiya:</span> {form.version}</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Orqaga</Button>
          {step < 3
            ? <Button onClick={next}>Keyingisi →</Button>
            : <Button variant="secondary" onClick={publish}>🚀 E'lon qilish</Button>}
        </div>
      </div>

      <p className="mt-4 text-sm"><Link href="/dashboard" className="text-muted hover:text-white">← Dashboardga qaytish</Link></p>
    </div>
  )
}
