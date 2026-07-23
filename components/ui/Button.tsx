"use client"

import { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
}

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 inline-flex items-center justify-center cursor-pointer"
  const variants = {
    primary: "bg-accent text-bg hover:shadow-glow hover:brightness-110",
    secondary: "bg-secondary text-white hover:shadow-glowPurple",
    ghost: "border border-white/20 text-white hover:bg-white/10",
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
