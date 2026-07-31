import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import SearchBox from './SearchBox.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 select-none">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-venmo-blue text-white">
        <Icon name="wallet" size={18} strokeWidth={2.4} />
      </span>
      <span className="text-[20px] font-bold tracking-tight text-venmo-blue">
        payclone
      </span>
    </Link>
  )
}

export default function Header() {
  const { currentUser } = useStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1000px] items-center gap-4 px-4">
        <Wordmark />

        <div className="mx-auto hidden w-full max-w-[380px] md:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            className="rounded-full p-2.5 text-ink-muted transition-colors hover:bg-surface-hover md:hidden"
            onClick={() => navigate('/search')}
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </button>
          <button
            className="rounded-full p-2.5 text-ink-muted transition-colors hover:bg-surface-hover"
            aria-label="Notifications"
          >
            <Icon name="bell" size={20} />
          </button>
          <Link
            to="/settings"
            className="rounded-full p-2.5 text-ink-muted transition-colors hover:bg-surface-hover"
            aria-label="Settings"
          >
            <Icon name="settings" size={20} />
          </Link>
          <Link to={`/u/${currentUser.id}`} className="ml-1">
            <Avatar user={currentUser} size={34} />
          </Link>
        </div>
      </div>
    </header>
  )
}
