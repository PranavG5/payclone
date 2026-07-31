import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import TransactionCard from '../components/TransactionCard.jsx'
import Icon from '../components/Icon.jsx'

const PAGE = 10

// Generic placeholder promos. The reference carries real third-party brands
// here; these stand in for that slot without imitating anyone.
const PROMOS = [
  {
    id: 'brands',
    title: 'Link brands,\npay faster',
    marks: ['#E6399B', '#E4572E'],
    width: 165,
  },
  {
    id: 'tickets',
    title: 'Get event tickets',
    subtitle: 'Powered by DemoTix',
    marks: ['#2F4FCD'],
    width: 202,
  },
]

function SearchRow() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-2 px-2 pt-2">
      <button
        onClick={() => navigate('/search')}
        className="flex h-[42px] flex-1 items-center gap-3 rounded-full bg-surface-field px-4 text-left"
      >
        <Icon name="search" size={20} className="shrink-0 text-ink" strokeWidth={2.2} />
        <span className="text-[17px] text-ink-faint">Find by phone</span>
      </button>
      <button
        aria-label="Scan code"
        className="flex h-[42px] w-12 shrink-0 items-center justify-center rounded-[14px] bg-surface-field text-ink"
      >
        <Icon name="qr" size={22} strokeWidth={1.8} />
      </button>
    </div>
  )
}

function PromoTile({ promo }) {
  return (
    <button
      style={{ width: promo.width }}
      className="flex h-[65px] shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl bg-white px-3 text-left"
    >
      <span className="flex shrink-0 items-center">
        {promo.marks.map((color, i) => (
          <span
            key={i}
            style={{ background: color, marginLeft: i ? -11 : 0 }}
            className="h-8 w-8 rounded-full ring-2 ring-white"
          />
        ))}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block whitespace-pre text-[14px] font-semibold leading-[18px] text-ink">
          {promo.title}
        </span>
        {promo.subtitle && (
          <span className="block truncate text-[13px] leading-[17px] text-meta-soft">
            {promo.subtitle}
          </span>
        )}
      </span>
    </button>
  )
}

export default function Home() {
  const { feedFor } = useStore()
  const [visible, setVisible] = useState(PAGE)

  // The reference home feed is the signed-in persona's own activity.
  const feed = useMemo(() => feedFor('mine'), [feedFor])
  const shown = feed.slice(0, visible)

  useEffect(() => setVisible(PAGE), [feed.length])

  return (
    <div className="min-h-full bg-surface-feed pb-4">
      <SearchRow />

      <div className="mt-[19px] flex gap-2 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROMOS.map((p) => (
          <PromoTile key={p.id} promo={p} />
        ))}
      </div>

      <div className="mt-7 space-y-[19px] px-2">
        {shown.length === 0 ? (
          <div className="rounded-[20px] bg-white px-6 py-14 text-center">
            <Icon name="wallet" size={34} className="mx-auto text-ink-faint" />
            <p className="mt-2 text-[17px] font-semibold text-ink">No activity yet</p>
            <p className="mt-1 text-[15px] text-meta-soft">
              Payments you send or receive show up here.
            </p>
          </div>
        ) : (
          shown.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
        )}
      </div>

      {visible < feed.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE)}
          className="mx-auto mt-5 flex h-[42px] items-center rounded-full bg-white px-6 text-[15px] font-semibold text-nav-idle"
        >
          Load more
        </button>
      )}
    </div>
  )
}
