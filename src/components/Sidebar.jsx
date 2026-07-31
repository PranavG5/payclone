import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import { money } from '../lib/format.js'

const NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export default function Sidebar() {
  const { currentUser } = useStore()
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-[112px] hidden h-fit w-[240px] shrink-0 lg:block">
      <div className="card p-4">
        <Link to={`/u/${currentUser.id}`} className="flex items-center gap-3">
          <Avatar user={currentUser} size={48} />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">
              {currentUser.displayName}
            </div>
            <div className="truncate text-[13px] text-ink-soft">@{currentUser.handle}</div>
          </div>
        </Link>

        <div className="mt-4 rounded-xl bg-venmo-blueLight p-3">
          <div className="text-[12px] font-medium text-venmo-blueDark">Balance</div>
          <div className="text-[22px] font-bold text-ink">{money(currentUser.balance)}</div>
          <Link
            to="/pay"
            className="mt-2 block rounded-pill bg-venmo-blue py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-venmo-blueHover"
          >
            Pay or Request
          </Link>
        </div>
      </div>

      <nav className="mt-4 card p-2">
        {NAV.map((item) => {
          const active =
            item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ' +
                (active
                  ? 'bg-venmo-blueLight text-venmo-blueDark'
                  : 'text-ink-muted hover:bg-surface-hover')
              }
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <p className="mt-4 px-2 text-[11px] leading-relaxed text-ink-faint">
        Educational UI study. All people and transactions shown are fictional
        entries stored locally in your browser.
      </p>
    </aside>
  )
}
