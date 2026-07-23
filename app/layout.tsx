import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Providers } from "./providers"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })

export const metadata: Metadata = {
  title: "GameHub — AI o'yinlar marketplace'i",
  description: "AI yaratilgan 3D o'yinlarni o'ynang va o'z o'yiningizni yuklang.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className={`${inter.variable} ${grotesk.variable}`}>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
