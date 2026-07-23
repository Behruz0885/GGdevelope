# 🚀 GameHub — AI-Powered 3D WebGL Games Marketplace

![GameHub Banner](https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80)

**GameHub** is a next-generation 3D WebGL gaming marketplace and procedural AI creation platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **HeroUI v3**, **Framer Motion**, and **Supabase**.

---

## ✨ Features

- 🎮 **Native 3D WebGL Player**: Play games directly inside the platform without external redirects.
- 🎨 **Futuristic Cyberpunk UI**: Dark mode `#030712`, glowing cyan `#00f3ff` & purple neon accents, glassmorphic UI panels (`backdrop-blur-xl`).
- 🤖 **AI Creation Studio (Teaser & Generator)**: Prompt-based procedural 3D game generator console with live progress simulation.
- 📊 **Developer Dashboard**: Game management, live analytics widgets, and 4-step interactive game upload wizard.
- ⚡ **Supabase Auth & Database**: Asynchronous authentication (`signIn`, `signUp`, `signOut`) with automatic `localStorage` fallback for offline / demo mode.
- 🏎️ **Marketplace & Filters**: Real-time title search, category filter pills, and rating/popularity sorting.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [@heroui/theme](https://heroui.com/) (HeroUI v3)
- **UI Primitives**: [@heroui/react](https://heroui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth**: [Supabase JS](https://supabase.com/) & LocalStorage fallback

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/YOUR_USERNAME/gamehub.git
cd gamehub
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

MIT License. Designed with ❤️ by the GameHub team.
