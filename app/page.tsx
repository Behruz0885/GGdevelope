import Link from "next/link"
import { GAMES, CATEGORIES } from "@/lib/data"
import GameCard from "@/components/GameCard"
import Button from "@/components/ui/Button"
import FadeIn from "@/components/FadeIn"
import Counter from "@/components/Counter"

export default function HomePage() {
  const featured = GAMES.filter((g) => g.featured)
  const trending = [...GAMES].sort((a, b) => b.playCount - a.playCount).slice(0, 8)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      {/* Hero Section */}
      <FadeIn>
        <section className="relative text-center py-24 md:py-36 overflow-hidden">
          {/* Cyberpunk ambient glow backgrounds */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-accent/20 via-secondary/20 to-accent-pink/20 blur-[120px] -z-10 pointer-events-none rounded-full" />

          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-xs font-bold text-accent shadow-glow mb-8 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>🚀 NEXT-GEN AI 3D MARKETPLACE</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            AI YARATGAN <span className="text-gradient">3D O'YINLAR</span>
            <br />
            <span className="text-white">O'YNANG VA YARATING</span>
          </h1>

          <p className="text-slate-400 mt-6 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Dunyodagi eng birinchi AI protsedural 3D WebGL o'yinlar platformasi. Birgina so'rov bilan o'yinlar generatsiya qiling va darhol o'ynang!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link href="/games">
              <Button className="px-8 py-4 text-base">
                🎮 O'yinlarni kashf qilish
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="secondary" className="px-8 py-4 text-base">
                ✨ AI Bilan Yaratish
              </Button>
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* Featured Carousel / Slider Grid */}
      <FadeIn delay={0.1}>
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                <span>⭐ HIGHLIGHTS</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-white">Tanlangan 3D O'yinlar</h2>
            </div>
            <Link href="/games" className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
              Barchasi →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Categories Grid */}
      <FadeIn delay={0.2}>
        <section className="py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-heading text-3xl font-bold text-white">Kategoriyalar Bo'yicha Qidiruv</h2>
            <p className="text-muted text-sm mt-2">O'zingizga yoqqan janrdagi protsedural 3D o'yinlarni tanlang</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/games?category=${c.name}`}
                className="group glass-card rounded-2xl p-6 text-center border border-white/10 hover:border-accent/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                  {c.icon}
                </div>
                <p className="font-heading font-bold text-sm text-white group-hover:text-accent transition-colors">
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Trending Games */}
      <FadeIn delay={0.3}>
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-accent-pink uppercase tracking-wider mb-1">
                <span>🔥 TOP PLAYED</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-white">Trenddagi Protsedural O'yinlar</h2>
            </div>
            <Link href="/games?sort=popular" className="text-sm font-semibold text-accent hover:underline">
              Ko'proq ko'rish →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Futuristic Stats Widget */}
      <FadeIn delay={0.4}>
        <section className="py-12">
          <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-secondary/5 to-accent-pink/5" />
            <div className="relative z-10 space-y-2">
              <p className="font-heading text-4xl lg:text-5xl font-black text-gradient">
                <Counter target={120} suffix="+" />
              </p>
              <p className="text-slate-300 font-semibold">Generatsiya Qilingan O'yinlar</p>
            </div>
            <div className="relative z-10 space-y-2 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
              <p className="font-heading text-4xl lg:text-5xl font-black text-gradient">
                <Counter target={45} suffix="+" />
              </p>
              <p className="text-slate-300 font-semibold">Faol AI Developerlar</p>
            </div>
            <div className="relative z-10 space-y-2">
              <p className="font-heading text-4xl lg:text-5xl font-black text-gradient">
                <Counter target={800000} suffix="+" />
              </p>
              <p className="text-slate-300 font-semibold">Jami Seanslar & O'ynashlar</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Developer CTA Card */}
      <FadeIn delay={0.5}>
        <section className="py-12 my-6">
          <div className="glass rounded-3xl p-10 md:p-16 text-center border border-accent/30 relative overflow-hidden shadow-glow">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            <span className="text-5xl mb-4 inline-block">🚀</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              O'yin yaratuvchisi bo'ling va o'zingizning 3D dunyongizni monetizatsiya qiling
            </h2>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto text-base">
              WebXR hamda WebGL o'yinlaringizni joylang. Minglab o'yinchilarga bir necha soniyada yetib boring.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <Button variant="secondary" className="px-8 py-4 text-base">
                  👨‍💻 Developer Hisobini Ochish
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
