import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import MockDataManager from '../components/MockDataManager.jsx'
import ProfileEditor from '../components/ProfileEditor.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'
import { money } from '../lib/format.js'

const PRIVACY_LABEL = { public: 'Public', friends: 'Friends', private: 'Private' }

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-[15px] text-ink">{label}</span>
      <span className="truncate text-[14px] text-ink-soft">{value}</span>
    </div>
  )
}

export default function Settings() {
  const { currentUser, logout, db } = useStore()
  const [showManager, setShowManager] = useState(false)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState('')

  function finishEditing(msg) {
    setEditing(false)
    if (msg) {
      setToast(msg)
      setTimeout(() => setToast(''), 2200)
    }
  }

  return (
    <div className="space-y-5 px-4 pb-8 pt-4">

      {toast && (
        <div className="rounded-xl bg-state-green/10 px-4 py-2.5 text-[13px] font-medium text-state-green animate-fade-in">
          {toast}
        </div>
      )}

      <section className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-surface-line px-5 py-4">
          <Avatar user={currentUser} size={52} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-semibold text-ink">
              {currentUser.displayName}
            </div>
            <div className="truncate text-[13px] text-ink-soft">@{currentUser.handle}</div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary shrink-0 px-4 py-1.5 text-[13px]"
            >
              <Icon name="edit" size={14} className="mr-1.5" />
              Edit profile
            </button>
          )}
        </div>

        {editing ? (
          <div className="animate-fade-in">
            <ProfileEditor onDone={finishEditing} />
          </div>
        ) : (
          <div className="divide-y divide-surface-line">
            <Row label="Bio" value={currentUser.bio || 'Not set'} />
            <Row label="Balance" value={money(currentUser.balance)} />
            <Row label="Email" value={currentUser.email || 'Not set'} />
            <Row label="Phone" value={currentUser.phone || 'Not set'} />
            <Row
              label="Default privacy"
              value={PRIVACY_LABEL[currentUser.defaultPrivacy] || 'Friends'}
            />
          </div>
        )}
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
              Add, edit, or remove the personas that populate this UI
            </span>
          </span>
          <span className="hidden rounded-pill bg-surface-hover px-2.5 py-1 text-[11px] font-bold text-ink-muted sm:inline">
            {db.users.length} profiles
          </span>
          <Icon
            name="chevronRight"
            size={18}
            className={
              'shrink-0 text-ink-faint transition-transform ' + (showManager ? 'rotate-90' : '')
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
        Sign out
      </button>
    </div>
  )
}
