"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import Button from "./ui/Button"

const LINKS = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/games", label: "O'yinlar" },
  { href: "/create", label: "✨ AI bilan yaratish" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-2xl">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-20">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-secondary to-accent-pink p-[1px] shadow-glow">
            <div className="w-full h-full bg-bg rounded-[11px] flex items-center justify-center font-heading font-black text-xl text-accent group-hover:scale-105 transition-transform">
              G
            </div>
          </div>
          <span className="font-heading text-2xl font-black tracking-tight text-white">
            Game<span className="text-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-surface2/60 p-1.5 rounded-2xl border border-white/5">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-accent/10 text-accent border border-accent/20 shadow-glow"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          {user?.role === "developer" && (
            <Link
              href="/dashboard"
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                pathname.startsWith("/dashboard")
                  ? "bg-secondary/20 text-secondary border border-secondary/30 shadow-glowPurple"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right CTA / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-surface2 border border-white/10 hover:border-accent/40 transition-all"
              >
                <span className="text-sm font-semibold text-white max-w-[100px] truncate">{user.name}</span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary to-accent-pink font-bold text-white flex items-center justify-center text-sm shadow-glowPurple">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
              </button>

              {menu && (
                <div className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 text-sm z-50 border border-white/10 shadow-2xl space-y-1">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-accent/10 text-accent border border-accent/20">
                      {user.role}
                    </span>
                  </div>
                  {user.role === "developer" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMenu(false)}
                      className="block px-3 py-2.5 rounded-xl hover:bg-white/10 text-slate-200 font-medium transition"
                    >
                      📊 Developer Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMenu(false)
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 font-medium transition"
                  >
                    🚪 Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Kirish</Button>
              </Link>
              <Link href="/signup">
                <Button>Ro'yxatdan o'tish</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl bg-surface2 border border-white/10 text-2xl text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="md:hidden px-4 pb-6 pt-2 space-y-3 bg-surface/95 backdrop-blur-2xl border-b border-white/10">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 px-4 rounded-xl text-slate-200 hover:bg-white/5 font-medium"
            >
              {l.label}
            </Link>
          ))}
          {user?.role === "developer" && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block py-3 px-4 rounded-xl text-secondary hover:bg-secondary/10 font-medium"
            >
              Developer Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="w-full text-left py-3 px-4 rounded-xl text-red-400 hover:bg-red-500/10 font-medium"
            >
              Chiqish ({user.name})
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full">Kirish</Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full">Ro'yxatdan o'tish</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
