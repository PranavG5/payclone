import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'

export default function Search() {
  const { searchUsers, db } = useStore()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')

  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    setParams(p, { replace: true })
  }, [q, setParams])

  const results = q.trim()
    ? searchUsers(q, 50)
    : db.users.filter((u) => !u.isDemoSelf).slice(0, 30)

  return (
    <div>
      <h1 className="mb-4 text-[22px] font-bold text-ink">Search people</h1>

      <div className="relative mb-5">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
          <Icon name="search" size={20} />
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or @handle"
          className="w-full rounded-pill border border-surface-line bg-white py-3.5 pl-12 pr-4 text-[16px] text-ink placeholder:text-ink-soft focus:border-venmo-blue focus:outline-none focus:ring-2 focus:ring-venmo-blue/15"
        />
      </div>

      <p className="mb-2 px-1 text-[13px] font-medium text-ink-soft">
        {q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Suggested people'}
      </p>

      {results.length === 0 ? (
        <div className="card px-6 py-12 text-center text-[14px] text-ink-soft">
          No people match “{q}”.
        </div>
      ) : (
        <div className="card divide-y divide-surface-line overflow-hidden">
          {results.map((u) => (
            <Link
              key={u.id}
              to={`/u/${u.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
            >
              <Avatar user={u} size={46} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold text-ink">
                  {u.displayName}
                </div>
                <div className="truncate text-[13px] text-ink-soft">
                  @{u.handle}
                  {u.bio ? <span className="text-ink-faint"> · {u.bio}</span> : null}
                </div>
              </div>
              <Icon name="chevronRight" size={18} className="text-ink-faint" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
