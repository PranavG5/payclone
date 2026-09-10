import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Icon from './Icon.jsx'
import { HomeGlyph, CardGlyph, CryptoGlyph, VeeMark } from './NavGlyph.jsx'

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
  // The reference carries a notification dot here; it is decorative.
  { to: '/cards', label: 'Cards', icon: 'card', badge: true },
  { to: '/pay', label: 'Pay/Request', center: true },
  { to: '/crypto', label: 'Crypto', icon: 'crypto' },
  // "Me" is the account hub — profile, demo controls, sign out.
  { to: '/settings', label: 'Me', avatar: true },
]

const GLYPH = { home: HomeGlyph, card: CardGlyph, crypto: CryptoGlyph }

function BottomNav() {
  const { pathname } = useLocation()
  const { currentUser } = useStore()

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const initials = (currentUser.displayName || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <nav className="relative z-20 shrink-0 bg-white pb-[env(safe-area-inset-bottom)]">
      {/* 12px above the glyph row, and the centre disc is pulled up so its
          midpoint lands exactly on the bar's top edge. */}
      <div className="flex items-start pb-2.5 pt-3">
        {TABS.map((t) => {
          const active = isActive(t.to)
          const tint = active ? 'text-nav-active' : 'text-nav-idle'

          if (t.center) {
            return (
              <Link
                key={t.to}
                to={t.to}
                className="flex flex-[1.35] flex-col items-center"
                aria-label="Pay or Request"
              >
                <span className="-mt-[40px] flex h-14 w-14 items-center justify-center rounded-full bg-nav-idle ring-[5px] ring-white">
                  <VeeMark size={34} />
                </span>
                <span className="mt-[18px] whitespace-nowrap text-[15px] font-semibold text-nav-idle">
                  {t.label}
                </span>
              </Link>
            )
          }

          const Glyph = GLYPH[t.icon]
          return (
            <Link key={t.to} to={t.to} className="flex flex-1 flex-col items-center">
              <span className="relative">
                {t.avatar ? (
                  <span
                    className={
                      'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ' +
                      (active ? 'bg-nav-active' : 'bg-nav-idle')
                    }
                  >
                    {initials}
                  </span>
                ) : (
                  <Glyph className={tint} />
                )}
                {t.badge && (
                  <span className="absolute -right-[12px] top-0 h-2 w-2 rounded-full bg-nav-badge" />
                )}
              </span>
              <span
                className={
                  'mt-[10px] whitespace-nowrap text-[15px] font-semibold ' + tint
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
