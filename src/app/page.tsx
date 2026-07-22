import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent" />
        Step 1 · Design system ready
      </span>
      <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">
        <span className="text-gradient">GameHub</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        An App Store for AI-generated 3D browser games. The foundation is set —
        preview the design system before we build the real pages.
      </p>
      <div className="mt-8">
        <Link href="/design-system">
          <Button size="lg">View the design system →</Button>
        </Link>
      </div>
    </main>
  );
}
