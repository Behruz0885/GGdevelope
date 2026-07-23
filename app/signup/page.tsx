"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import Button from "@/components/ui/Button"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"player" | "developer">("player")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError("Ismingizni kiriting")
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Email noto'g'ri formatda")
    if (password.length < 6) return setError("Parol kamida 6 ta belgi bo'lsin")
    setLoading(true)
    setError("")
    const success = await signup(name, email, password, role)
    setLoading(false)
    if (!success) return setError("Bu email allaqachon ro'yxatdan o'tgan yoki xatolik yuz berdi")
    router.push(role === "developer" ? "/dashboard" : "/")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass rounded-3xl p-8">
        <h1 className="font-heading text-2xl font-bold mb-6 text-center">Ro'yxatdan o'tish</h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["player", "developer"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-xl p-4 text-center border transition ${
                role === r ? "border-accent bg-accent/10 shadow-glow" : "border-white/10 bg-surface"
              }`}
            >
              <div className="text-2xl mb-1">{r === "player" ? "🎮" : "👨‍💻"}</div>
              <p className="text-sm font-semibold">{r === "player" ? "O'yinchi" : "Developer"}</p>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Ism" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Parol (kamida 6 belgi)" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button className="w-full" variant="secondary" disabled={loading}>
            {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
          </Button>
        </form>
        <p className="text-sm text-muted text-center mt-4">
          Akkaunt bormi? <Link href="/login" className="text-accent">Kirish</Link>
        </p>
      </div>
    </div>
  )
}
