export default function FeedSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="flex gap-3">
            <div className="skeleton h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <div className="skeleton h-3.5 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/4 rounded" />
              <div className="skeleton h-3.5 w-1/2 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
