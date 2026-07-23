export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/30 font-medium">
      {children}
    </span>
  )
}
