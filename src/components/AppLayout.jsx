import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Drawer from './Drawer.jsx'
import Icon from './Icon.jsx'

const BOTTOM_NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/pay', label: 'Pay', icon: 'plus', primary: true },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

// Header title per route. The reference screen is titled "Pay & Request".
// Read straight off the pathname — a parent layout route can't see the
// child's :id via useParams.
function useTitle() {
  const { pathname } = useLocation()
  const { getUser } = useStore()
  if (pathname === '/') return 'Home'
  if (pathname.startsWith('/search')) return 'Search'
  if (pathname.startsWith('/pay')) return 'Pay & Request'
  if (pathname.startsWith('/settings')) return 'Settings'
  const profile = pathname.match(/^\/u\/([^/]+)/)
  if (profile) return getUser(profile[1])?.displayName || 'Profile'
  return 'payclone'
}

function MobileHeader({ onMenu }) {
  const title = useTitle()
  return (
    // 72px tall with no bottom rule — matches the reference, where the first
    // horizontal line on the page is the "To" field's own border.
    <header className="relative flex h-[72px] shrink-0 items-center bg-white px-2">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="relative z-10 rounded-full p-2.5 text-ink transition-colors active:bg-surface-hover"
      >
        <Icon name="menu" size={22} strokeWidth={2.2} />
      </button>
      <h1 className="pointer-events-none absolute inset-x-0 truncate px-14 text-center text-[20px] font-bold text-ink">
        {title}
      </h1>
    </header>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="shrink-0 border-t border-surface-line bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {BOTTOM_NAV.map((item) => {
          const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-venmo-blue text-white shadow-fab"
                aria-label="Pay or Request"
              >
                <Icon name="plus" size={24} strokeWidth={2.6} />
              </Link>
            )
          }
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ' +
                (active ? 'text-venmo-blue' : 'text-ink-soft')
              }
            >
              <Icon name={item.icon} size={21} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    // Phone-shaped column centred on larger screens. Built for phones —
    // wider viewports letterbox it rather than reflowing to a desktop layout.
    // The column owns its own scrolling so the header and nav stay fixed,
    // exactly like a native app shell.
    <div className="flex h-[100dvh] justify-center bg-surface-app">
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-surface-page shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MobileHeader onMenu={() => setMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <BottomNav />
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  )
}
