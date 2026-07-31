import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import { money } from '../lib/format.js'

const NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/pay', label: 'Pay & Request', icon: 'plus' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export default function Drawer({ open, onClose }) {
  const { currentUser, logout } = useStore()
  const { pathname } = useLocation()

  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        className={
          'absolute inset-0 z-50 bg-black/40 transition-opacity duration-200 ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
      />

      <aside
        className={
          'absolute inset-y-0 left-0 z-50 flex w-[290px] max-w-[85%] flex-col bg-white shadow-dropdown transition-transform duration-200 ease-out ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <span className="text-[18px] font-bold text-venmo-blue">payclone</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-1 rounded-full p-2 text-ink-muted hover:bg-surface-hover"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <Link
          to={`/u/${currentUser.id}`}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover"
        >
          <Avatar user={currentUser} size={48} />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">
              {currentUser.displayName}
            </div>
            <div className="truncate text-[13px] text-ink-soft">@{currentUser.handle}</div>
          </div>
        </Link>

        <div className="mx-4 mt-1 rounded-xl bg-venmo-blueLight p-3">
          <div className="text-[12px] font-medium text-venmo-blueDark">Balance</div>
          <div className="text-[22px] font-bold text-ink">{money(currentUser.balance)}</div>
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-2">
          {NAV.map((item) => {
            const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ' +
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

        <button
          onClick={() => {
            onClose()
            logout()
          }}
          className="border-t border-surface-line px-5 py-4 text-left text-[15px] font-semibold text-state-red hover:bg-surface-hover"
        >
          Sign out
        </button>
      </aside>
    </>
  )
}
