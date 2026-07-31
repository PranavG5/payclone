import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

// Cards and Crypto exist so the five-tab bar in the reference is complete.
// They are deliberately stubs — this project is a study of the home, search,
// profile, payment, and demo-data surfaces.
const CONTENT = {
  cards: {
    icon: 'card',
    title: 'Cards',
    body: 'A card hub would live here — balance, spending activity, and card controls.',
  },
  crypto: {
    icon: 'crypto',
    title: 'Crypto',
    body: 'A crypto hub would live here — holdings, price charts, and buy/sell flows.',
  },
}

export default function Placeholder({ kind }) {
  const c = CONTENT[kind]
  return (
    <div className="min-h-full bg-surface-feed px-2 pt-4">
      <div className="rounded-[20px] bg-white px-6 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-chip text-nav-idle">
          <Icon name={c.icon} size={26} />
        </span>
        <h2 className="mt-4 text-[20px] font-semibold text-ink">{c.title}</h2>
        <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-[21px] text-meta-soft">
          {c.body}
        </p>
        <p className="mt-3 text-[13px] text-ink-faint">
          Not built out — this screen is a placeholder.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-[42px] items-center rounded-full bg-nav-idle px-6 text-[15px] font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
