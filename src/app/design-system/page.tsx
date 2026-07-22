"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  StarRating,
} from "@/components/ui";
import { games, getCategoryById } from "@/data";
import { formatCompactNumber } from "@/lib/utils";

const swatches = [
  { name: "background", hex: "#0a0a0f", className: "bg-background" },
  { name: "surface", hex: "#12121a", className: "bg-surface" },
  { name: "surface.light", hex: "#1a1a26", className: "bg-surface-light" },
  { name: "accent (cyan)", hex: "#00e5ff", className: "bg-accent" },
  { name: "secondary (purple)", hex: "#8b5cf6", className: "bg-secondary" },
  { name: "success", hex: "#22c55e", className: "bg-success" },
  { name: "warning", hex: "#f59e0b", className: "bg-warning" },
  { name: "danger", hex: "#ef4444", className: "bg-danger" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/5 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [rating, setRating] = useState(3);
  const sampleGames = games.slice(0, 4);

  return (
    <main className="min-h-screen bg-background bg-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <header className="animate-fade-in">
          <Badge variant="accent" className="mb-4">
            Design System · v0.1
          </Badge>
          <h1 className="text-5xl font-bold leading-tight">
            <span className="text-gradient">GameHub</span> Design System
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-foreground-muted">
            A dark, futuristic component library for the marketplace of
            AI-generated 3D browser games. This is a temporary preview page for
            verifying the look before we build the real pages.
          </p>
        </header>

        {/* Colors */}
        <Section
          title="Colors"
          description="Dark futuristic palette with an electric cyan accent and purple secondary."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {swatches.map((swatch) => (
              <div key={swatch.name}>
                <div
                  className={`h-20 rounded-lg border border-white/10 ${swatch.className}`}
                />
                <p className="mt-2 text-sm font-medium text-foreground">
                  {swatch.name}
                </p>
                <p className="text-xs uppercase text-foreground-subtle">
                  {swatch.hex}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          description="Space Grotesk for headings, Inter for body copy."
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-foreground-subtle">
              Space Grotesk · Headings
            </p>
            <h1 className="text-5xl font-bold">Heading 1 — Play the future</h1>
            <h2 className="text-3xl font-bold">Heading 2 — Discover games</h2>
            <h3 className="text-xl font-semibold">Heading 3 — Top rated</h3>
            <p className="pt-4 text-xs uppercase tracking-widest text-foreground-subtle">
              Inter · Body
            </p>
            <p className="max-w-2xl text-base text-foreground-muted">
              Body text uses Inter for excellent readability. GameHub is an app
              store for AI-generated 3D browser games — no downloads, just
              instant play. Browse by genre, rate what you love, and follow your
              favorite developers.
            </p>
          </div>
        </Section>

        {/* Buttons */}
        <Section
          title="Buttons"
          description="Three variants (primary, secondary, ghost) across three sizes."
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section
          title="Badges"
          description="Compact labels for categories, tags, and statuses."
        >
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">New</Badge>
            <Badge variant="warning">Beta</Badge>
            <Badge variant="danger">Hot</Badge>
          </div>
        </Section>

        {/* Inputs */}
        <Section
          title="Inputs"
          description="Text fields with label, placeholder, and error states."
        >
          <div className="grid max-w-xl gap-5">
            <Input
              label="Search games"
              placeholder="Try 'Neon Drift'…"
              leftIcon={<span className="text-base">🔍</span>}
            />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input
              label="Username"
              defaultValue="taken_name"
              error="That username is already in use."
            />
            <Input label="Disabled" placeholder="Unavailable" disabled />
          </div>
        </Section>

        {/* Star rating */}
        <Section
          title="Star Rating"
          description="Supports fractional display, sizes, counts, and an interactive mode."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <StarRating value={4.7} size="sm" showValue count={2841} />
              <span className="text-xs text-foreground-subtle">small</span>
            </div>
            <div className="flex items-center gap-4">
              <StarRating value={4.5} size="md" showValue count={1520} />
              <span className="text-xs text-foreground-subtle">medium</span>
            </div>
            <div className="flex items-center gap-4">
              <StarRating value={3.2} size="lg" showValue />
              <span className="text-xs text-foreground-subtle">large</span>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <StarRating
                value={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
              <span className="text-sm text-foreground-muted">
                interactive → you picked{" "}
                <span className="font-semibold text-accent">{rating}</span>
              </span>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section
          title="Cards"
          description="Surface containers, including a sample game card composed from Button, Badge, and StarRating."
        >
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardBody>
                <CardTitle>Static Card</CardTitle>
                <p className="mt-2 text-sm text-foreground-muted">
                  A plain surface card with a subtle border. Use it to group
                  related content.
                </p>
              </CardBody>
            </Card>
            <Card interactive>
              <CardBody>
                <CardTitle>Interactive Card</CardTitle>
                <p className="mt-2 text-sm text-foreground-muted">
                  Hover me — interactive cards lift and glow with the cyan
                  accent.
                </p>
              </CardBody>
            </Card>
          </div>

          <p className="mb-4 text-xs uppercase tracking-widest text-foreground-subtle">
            Sample game cards (from mock data)
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sampleGames.map((game) => {
              const category = getCategoryById(game.categoryId);
              return (
                <Card key={game.id} interactive className="overflow-hidden">
                  <div className="relative aspect-[3/2] w-full bg-surface-light">
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                    {game.featured && (
                      <Badge
                        variant="accent"
                        className="absolute left-2 top-2 backdrop-blur"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardBody className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      {category && (
                        <Badge variant="outline">
                          {category.icon} {category.name}
                        </Badge>
                      )}
                      <span className="text-xs text-foreground-subtle">
                        {formatCompactNumber(game.playCount)} plays
                      </span>
                    </div>
                    <CardTitle className="text-base">{game.title}</CardTitle>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">
                      {game.shortDescription}
                    </p>
                    <p className="mt-2 text-xs text-foreground-subtle">
                      by {game.developer}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <StarRating
                        value={game.rating}
                        size="sm"
                        showValue
                        count={game.ratingCount}
                      />
                      <Button size="sm">Play</Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Section>

        <footer className="border-t border-white/5 py-10 text-center text-sm text-foreground-subtle">
          GameHub · {games.length} mock games loaded · design system preview
        </footer>
      </div>
    </main>
  );
}
