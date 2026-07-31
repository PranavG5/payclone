import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'

export default function SearchBox({ compact = false }) {
  const { searchUsers } = useStore()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  const results = q.trim() ? searchUsers(q, 6) : []

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => setActive(0), [q])

  function go(user) {
    setOpen(false)
    setQ('')
    navigate(`/u/${user.id}`)
  }

  function onKeyDown(e) {
    if (!open || results.length === 0) {
      if (e.key === 'Enter' && q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
        <Icon name="search" size={18} />
      </div>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search people"
        className={
          'w-full rounded-pill border border-transparent bg-surface-hover pl-10 pr-4 text-[14px] text-ink placeholder:text-ink-soft focus:border-venmo-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-venmo-blue/15 ' +
          (compact ? 'py-2' : 'py-2.5')
        }
      />

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl bg-white shadow-dropdown animate-fade-in">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[14px] text-ink-soft">
              No people found for “{q}”
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1">
              {results.map((u, i) => (
                <li key={u.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(u)}
                    className={
                      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ' +
                      (i === active ? 'bg-venmo-blueLight' : 'hover:bg-surface-hover')
                    }
                  >
                    <Avatar user={u} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold text-ink">
                        {u.displayName}
                      </div>
                      <div className="truncate text-[13px] text-ink-soft">@{u.handle}</div>
                    </div>
                    <Icon name="chevronRight" size={16} className="text-ink-faint" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate(`/search?q=${encodeURIComponent(q)}`)
                  }}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-semibold text-venmo-blue hover:bg-surface-hover"
                >
                  See all results for “{q}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
