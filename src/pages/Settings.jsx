import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import MockDataManager from '../components/MockDataManager.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'
import { money } from '../lib/format.js'

function Row({ label, value, action }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-[15px] text-ink">{label}</span>
      <span className="flex items-center gap-2 text-[14px] text-ink-soft">
        {value}
        {action}
      </span>
    </div>
  )
}

export default function Settings() {
  const { currentUser, logout, db } = useStore()
  const [showManager, setShowManager] = useState(false)

  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-bold text-ink">Settings</h1>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-surface-line px-5 py-4">
          <Avatar user={currentUser} size={52} />
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold text-ink">
              {currentUser.displayName}
            </div>
            <div className="truncate text-[13px] text-ink-soft">@{currentUser.handle}</div>
          </div>
        </div>
        <div className="divide-y divide-surface-line">
          <Row label="Demo balance" value={money(currentUser.balance)} />
          <Row label="Email" value="demo@example.invalid" />
          <Row label="Phone" value="Not set" />
          <Row label="Default privacy" value="Friends" />
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-surface-line px-5 py-3">
          <h2 className="text-[15px] font-bold text-ink">About this demo</h2>
        </div>
        <div className="space-y-3 px-5 py-4 text-[13px] leading-relaxed text-ink-muted">
          <p>
            <strong className="text-ink">PayClone</strong> is a front-end study
            recreating the layout and interaction patterns of a peer-to-peer
            payments interface. It is a portfolio/learning project — it is not
            affiliated with, endorsed by, or connected to Venmo, PayPal, or any
            real financial service.
          </p>
          <p>
            Every person, balance, and transaction you see is fictional and
            generated locally. There is no backend, no network request, no real
            money, and no real account. Data lives only in this browser's
            localStorage and disappears when you clear it.
          </p>
        </div>
      </section>

      {/* Developer tools — the mock data manager */}
      <section className="card overflow-hidden">
        <button
          onClick={() => setShowManager((v) => !v)}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-hover"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
            <Icon name="settings" size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold text-ink">
              Demo Controls — Mock Data Manager
            </span>
            <span className="block text-[12.5px] text-ink-soft">
              Add, edit, or remove the fictional personas that populate this UI
            </span>
          </span>
          <span className="rounded-pill bg-surface-hover px-2.5 py-1 text-[11px] font-bold text-ink-muted">
            {db.users.length} profiles
          </span>
          <Icon
            name="chevronRight"
            size={18}
            className={
              'text-ink-faint transition-transform ' + (showManager ? 'rotate-90' : '')
            }
          />
        </button>
      </section>

      {showManager && (
        <div className="animate-slide-up">
          <MockDataManager />
        </div>
      )}

      <button
        onClick={logout}
        className="card w-full px-5 py-4 text-left text-[15px] font-semibold text-state-red transition-colors hover:bg-surface-hover"
      >
        Sign out of demo
      </button>

      <p className="px-1 pb-4 text-center text-[11px] text-ink-faint">
        PayClone · educational UI recreation · not a real payment service
      </p>
    </div>
  )
}
