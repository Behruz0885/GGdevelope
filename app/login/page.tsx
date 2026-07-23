"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import Button from "@/components/ui/Button"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Email noto'g'ri formatda")
    setLoading(true)
    setError("")
    const success = await login(email, password)
    setLoading(false)
    if (!success) return setError("Email yoki parol xato")
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass rounded-3xl p-8">
        <h1 className="font-heading text-2xl font-bold mb-6 text-center">Kirish</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Kirilmoqda..." : "Kirish"}</Button>
        </form>
        <p className="text-sm text-muted text-center mt-4">
          Akkaunt yo'qmi? <Link href="/signup" className="text-accent">Ro'yxatdan o'ting</Link>
        </p>
      </div>
    </div>
  )
}
