import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Icon from './Icon.jsx'

// Header title per route. Home has no header at all — the reference puts the
// search row at the very top of the screen.
function useTitle() {
  const { pathname } = useLocation()
  const { getUser } = useStore()
  if (pathname === '/') return null
  if (pathname.startsWith('/search')) return 'Search'
  if (pathname.startsWith('/pay')) return 'Pay & Request'
  if (pathname.startsWith('/settings')) return 'Me'
  if (pathname.startsWith('/cards')) return 'Cards'
  if (pathname.startsWith('/crypto')) return 'Crypto'
  const profile = pathname.match(/^\/u\/([^/]+)/)
  if (profile) return getUser(profile[1])?.displayName || 'Profile'
  return 'payclone'
}

// Tab destinations are roots; a profile is a pushed screen and gets a back
// arrow. Navigation itself lives in the tab bar, so there is no drawer.
function MobileHeader({ title, canGoBack }) {
  const navigate = useNavigate()
  return (
    <header className="relative flex h-[72px] shrink-0 items-center bg-white px-2">
      {canGoBack && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="relative z-10 rounded-full p-2.5 text-ink transition-colors active:bg-surface-hover"
        >
          <Icon name="arrowLeft" size={22} strokeWidth={2.2} />
        </button>
      )}
      <h1 className="pointer-events-none absolute inset-x-0 truncate px-14 text-center text-[20px] font-bold text-ink">
        {title}
      </h1>
    </header>
  )
}

// Five tabs with a raised centre action, matching the reference.
const TABS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/cards', label: 'Cards', icon: 'card' },
  { to: '/pay', label: 'Pay/Request', center: true },
  { to: '/crypto', label: 'Crypto', icon: 'crypto' },
  // "Me" is the account hub — profile, demo controls, sign out.
  { to: '/settings', label: 'Me', avatar: true },
]

function BottomNav() {
  const { pathname } = useLocation()
  const { currentUser } = useStore()

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <nav className="relative z-20 shrink-0 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-end justify-around px-1 pb-2 pt-2">
        {TABS.map((t) => {
          const active = isActive(t.to)
          if (t.center) {
            return (
              <Link
                key={t.to}
                to={t.to}
                className="flex flex-1 flex-col items-center"
                aria-label="Pay or Request"
              >
                <span className="-mt-[30px] flex h-14 w-14 items-center justify-center rounded-full bg-nav-idle ring-[5px] ring-white">
                  <Icon name="wallet" size={26} strokeWidth={2.2} className="text-white" />
                </span>
                <span className="mt-1.5 text-[15px] font-semibold text-nav-idle">
                  {t.label}
                </span>
              </Link>
            )
          }
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-1 flex-col items-center gap-1"
            >
              {t.avatar ? (
                <span
                  className={
                    'flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-bold text-white ' +
                    (active ? 'bg-nav-active' : 'bg-nav-idle')
                  }
                >
                  {(currentUser.displayName || '?')
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()}
                </span>
              ) : (
                <Icon
                  name={t.icon}
                  size={26}
                  strokeWidth={active ? 2.4 : 2}
                  className={active ? 'text-nav-active' : 'text-nav-idle'}
                />
              )}
              <span
                className={
                  'text-[15px] font-semibold ' +
                  (active ? 'text-nav-active' : 'text-nav-idle')
                }
              >
                {t.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const title = useTitle()
  const canGoBack = pathname.startsWith('/u/')

  return (
    // Phone-shaped column centred on larger screens. Built for phones —
    // wider viewports letterbox it rather than reflowing to a desktop layout.
    // The column owns its own scrolling so the chrome stays fixed, exactly
    // like a native app shell.
    <div className="flex h-[100dvh] justify-center bg-surface-app">
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-surface-feed shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        {title && <MobileHeader title={title} canGoBack={canGoBack} />}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
