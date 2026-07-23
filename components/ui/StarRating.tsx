export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-yellow-400">
        {"★".repeat(Math.round(rating))}
        <span className="text-white/20">{"★".repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-muted">{rating.toFixed(1)}</span>
    </div>
  )
}
