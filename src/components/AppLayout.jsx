import { Link, useLocation, Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Icon from './Icon.jsx'

const MOBILE_NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/pay', label: 'Pay', icon: 'plus', primary: true },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

function MobileNav() {
  const { pathname } = useLocation()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-[1000px] items-center justify-around">
        {MOBILE_NAV.map((item) => {
          const active =
            item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-venmo-blue text-white shadow-fab"
                aria-label="Pay or Request"
              >
                <Icon name="plus" size={26} strokeWidth={2.6} />
              </Link>
            )
          }
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ' +
                (active ? 'text-venmo-blue' : 'text-ink-soft')
              }
            >
              <Icon name={item.icon} size={22} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function AppLayout() {
  return (
    <div className="min-h-full">
      <Header />
      <div className="mx-auto flex max-w-[1000px] gap-6 px-4 pb-24 pt-6 lg:pb-10">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
