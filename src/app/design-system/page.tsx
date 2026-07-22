"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  StarRating,
} from "@/components/ui";
import { games } from "@/lib/mock-data";
import { formatCount } from "@/lib/utils";

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
    <section className="border-t border-border py-10">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const swatches = [
  { name: "Background", value: "#0a0a0f", className: "bg-background" },
  { name: "Surface", value: "#12121a", className: "bg-surface" },
  { name: "Surface 2", value: "#1b1b26", className: "bg-surface-2" },
  { name: "Accent (cyan)", value: "#00e5ff", className: "bg-accent" },
  { name: "Secondary (purple)", value: "#8b5cf6", className: "bg-secondary" },
  { name: "Border", value: "#26263a", className: "bg-border" },
];

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20l-3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function DesignSystemPage() {
  const [rating, setRating] = useState(0);
  const sampleGame = games[0];

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header>
        <Badge variant="accent">Design System</Badge>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
          <span className="text-gradient">GameHub</span> UI Kit
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          A preview of the dark, futuristic gaming theme and the reusable
          building blocks we&apos;ll use to build the marketplace.
        </p>
      </header>

      {/* Colors */}
      <Section title="Colors" description="The core palette of the theme.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((s) => (
            <div key={s.name}>
              <div
                className={`h-20 w-full rounded-lg border border-border ${s.className}`}
              />
              <p className="mt-2 text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted">{s.value}</p>
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
          <p className="font-heading text-5xl font-bold">Heading / 5xl</p>
          <p className="font-heading text-3xl font-semibold">Heading / 3xl</p>
          <p className="font-heading text-xl font-semibold">Heading / xl</p>
          <p className="text-base text-foreground">
            Body / base — Inter. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-muted">
            Body / muted — supporting text and metadata.
          </p>
          <p className="text-2xl">
            <span className="text-gradient font-heading font-bold">
              Gradient text utility
            </span>
          </p>
        </div>
      </Section>

      {/* Buttons */}
      <Section
        title="Buttons"
        description="Three variants (primary, secondary, ghost) across three sizes."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges" description="Labels for categories, tags, status.">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent">Featured</Badge>
          <Badge variant="secondary">New</Badge>
          <Badge variant="neutral">Racing</Badge>
          <Badge variant="outline">3D</Badge>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs" description="Text fields tuned for the dark theme.">
        <div className="grid max-w-md gap-4">
          <Input placeholder="Plain input" />
          <Input leadingIcon={SearchIcon} placeholder="Search games…" />
          <Input placeholder="Disabled input" disabled />
        </div>
      </Section>

      {/* Star rating */}
      <Section
        title="Star Rating"
        description="Read-only (with fractional fill) and interactive modes."
      >
        <div className="space-y-4">
          <StarRating value={4.7} showValue count={1284} />
          <StarRating value={3.5} size="lg" showValue />
          <StarRating value={2} size="sm" />
          <div>
            <p className="mb-2 text-sm text-muted">
              Interactive (click to rate):{" "}
              <span className="font-medium text-foreground">
                {rating > 0 ? `${rating} / 5` : "not rated"}
              </span>
            </p>
            <StarRating value={rating} size="lg" onChange={setRating} />
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section
        title="Cards"
        description="Surface containers, including a sample game card composed from mock data."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Simple card */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              A basic surface with header, content, and footer slots.
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost">
                Action
              </Button>
            </CardFooter>
          </Card>

          {/* Game card built from mock data */}
          <Card interactive className="overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-secondary/30 to-accent/20">
              <Image
                src={sampleGame.coverImage}
                alt={sampleGame.title}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
              <Badge variant="accent" className="absolute left-3 top-3">
                Featured
              </Badge>
            </div>
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{sampleGame.title}</CardTitle>
              </div>
              <p className="line-clamp-2 text-sm text-muted">
                {sampleGame.description}
              </p>
              <StarRating
                value={sampleGame.rating}
                size="sm"
                showValue
                count={sampleGame.ratingCount}
              />
              <div className="flex items-center justify-between pt-1 text-xs text-muted">
                <span>by {sampleGame.developer}</span>
                <span>{formatCount(sampleGame.playCount)} plays</span>
              </div>
            </CardContent>
          </Card>

          {/* Interactive hover card */}
          <Card interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              Hover me — I lift and glow. Used for clickable listings.
            </CardContent>
            <CardFooter className="gap-2">
              {sampleGame.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </div>
      </Section>
    </main>
  );
}
