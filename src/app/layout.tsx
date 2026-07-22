import type { Metadata } from "next";
// Self-hosted fonts (via @fontsource) so we don't depend on Google Fonts at
// build or runtime. Space Grotesk is used for headings, Inter for body.
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameHub — AI-Generated 3D Browser Games",
  description:
    "GameHub is a marketplace for AI-generated 3D browser games. Discover, play, and rate the next generation of instantly playable games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
