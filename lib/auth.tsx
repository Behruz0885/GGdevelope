"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@/types"
import { supabase } from "@/lib/supabase"

type Role = "player" | "developer"

type AuthCtx = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: Role) => Promise<boolean>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

const isSupabaseConfigured = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-supabase-project.supabase.co" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) return setUser(null)
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        if (profile) {
          setUser({ id: profile.id, name: profile.name, email: session.user.email!, role: profile.role })
        } else {
          setUser({ id: session.user.id, name: session.user.email?.split("@")[0] || "Foydalanuvchi", email: session.user.email!, role: "player" })
        }
      })
      return () => sub.subscription.unsubscribe()
    } else {
      const raw = localStorage.getItem("gh_user")
      if (raw) setUser(JSON.parse(raw))
    }
  }, [])

  const signup = async (name: string, email: string, password: string, role: Role): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error || !data.user) return false
      await supabase.from("profiles").insert({ id: data.user.id, name, role })
      return true
    } else {
      const users = JSON.parse(localStorage.getItem("gh_users") ?? "[]") as Array<User & { password: string }>
      if (users.some((u) => u.email === email)) return false
      const newUser: User = { id: crypto.randomUUID(), name, email, role }
      localStorage.setItem("gh_users", JSON.stringify([...users, { ...newUser, password }]))
      localStorage.setItem("gh_user", JSON.stringify(newUser))
      setUser(newUser)
      return true
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return !error
    } else {
      const users = JSON.parse(localStorage.getItem("gh_users") ?? "[]") as Array<User & { password: string }>
      const found = users.find((u) => u.email === email && u.password === password)
      if (!found) return false
      const { password: _pw, ...safe } = found
      localStorage.setItem("gh_user", JSON.stringify(safe))
      setUser(safe)
      return true
    }
  }

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem("gh_user")
      setUser(null)
    }
  }

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak")
  return ctx
}
