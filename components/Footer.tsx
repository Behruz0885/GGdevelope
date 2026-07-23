import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 bg-surface/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid gap-10 sm:grid-cols-2 md:grid-cols-5 text-sm">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-secondary p-[1px] shadow-glow">
              <div className="w-full h-full bg-bg rounded-[11px] flex items-center justify-center font-heading font-black text-accent">
                G
              </div>
            </div>
            <span className="font-heading text-xl font-black text-white">
              Game<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <p className="text-muted max-w-sm text-sm leading-relaxed">
            AI tomonidan yaratilgan va generatsiya qilinadigan 3D WebGL o'yinlar uchun keyingi avlod marketplace platformasi.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Platforma faol va ishlamoqda</span>
          </div>
        </div>

        <div>
          <p className="font-heading font-bold text-white mb-4 uppercase tracking-wider text-xs">Platforma</p>
          <ul className="space-y-2.5 text-muted">
            <li><Link href="/games" className="hover:text-accent transition">Barcha o'yinlar</Link></li>
            <li><Link href="/games?sort=top" className="hover:text-accent transition">Top reyting</Link></li>
            <li><Link href="/create" className="hover:text-accent transition">✨ AI Generator</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-heading font-bold text-white mb-4 uppercase tracking-wider text-xs">Developerlar</p>
          <ul className="space-y-2.5 text-muted">
            <li><Link href="/dashboard/upload" className="hover:text-accent transition">O'yin yuklash</Link></li>
            <li><Link href="/dashboard" className="hover:text-accent transition">Developer Panel</Link></li>
            <li><a href="#" className="hover:text-accent transition">WebGL SDK</a></li>
          </ul>
        </div>

        <div>
          <p className="font-heading font-bold text-white mb-4 uppercase tracking-wider text-xs">Jamiyat</p>
          <ul className="space-y-2.5 text-muted">
            <li><a href="#" className="hover:text-accent transition">Discord Server</a></li>
            <li><a href="#" className="hover:text-accent transition">Twitter (X)</a></li>
            <li><a href="#" className="hover:text-accent transition">GitHub Repo</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-muted">
        <p>© 2026 GameHub Inc. HeroUI v3 & Next.js 14 bilan yaratilgan.</p>
      </div>
    </footer>
  )
}
