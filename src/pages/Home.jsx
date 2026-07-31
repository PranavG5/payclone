import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import TransactionCard from '../components/TransactionCard.jsx'
import FeedSkeleton from '../components/FeedSkeleton.jsx'
import Icon from '../components/Icon.jsx'

const TABS = [
  { id: 'friends', label: 'Friends', icon: 'users' },
  { id: 'mine', label: 'You', icon: 'wallet' },
  { id: 'public', label: 'Public', icon: 'globe' },
]

const PAGE = 12

export default function Home() {
  const { feedFor } = useStore()
  const [tab, setTab] = useState('friends')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(PAGE)

  // Simulate a network fetch each time the tab changes.
  useEffect(() => {
    setLoading(true)
    setVisible(PAGE)
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [tab])

  const feed = useMemo(() => feedFor(tab), [feedFor, tab])
  const shown = feed.slice(0, visible)

  return (
    <div className="px-4 pb-6 pt-4">
      <div className="mb-4">
        <Link
          to="/pay"
          className="flex items-center justify-center gap-2 rounded-pill bg-venmo-blue py-3 text-[15px] font-semibold text-white"
        >
          <Icon name="plus" size={18} strokeWidth={2.6} />
          Pay or Request
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-pill bg-white p-1 shadow-card">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              'flex flex-1 items-center justify-center gap-1.5 rounded-pill py-2 text-[14px] font-semibold transition-colors ' +
              (tab === t.id
                ? 'bg-venmo-blue text-white'
                : 'text-ink-muted hover:bg-surface-hover')
            }
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <FeedSkeleton />
      ) : shown.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
          <Icon name="wallet" size={34} className="text-ink-faint" />
          <p className="text-[15px] font-semibold text-ink">No activity yet</p>
          <p className="text-[13px] text-ink-soft">
            Make a payment to see it appear in your feed.
          </p>
          <Link to="/pay" className="btn-primary mt-2">
            Pay or Request
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 animate-fade-in">
            {shown.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
          {visible < feed.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE)}
              className="btn-secondary mx-auto mt-5 flex"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  )
}
