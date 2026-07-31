import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/store.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import { avatarFor } from '../data/avatar.js'
import { money } from '../lib/format.js'

const BLANK = { displayName: '', handle: '', balance: '', bio: '', avatar: '' }
const PAGE = 12

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-ink-muted">{label}</span>
      <input className="field" {...props} />
    </label>
  )
}

// Create / edit form for a single fictional persona.
function PersonaForm({ initial, onCancel, onSave, saveLabel }) {
  const [form, setForm] = useState({ ...BLANK, ...initial })
  const fileRef = useRef(null)

  const preview =
    form.avatar || avatarFor(form.handle || 'preview', form.displayName || form.handle || '?')

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 400 * 1024) {
      alert('Please choose an image under 400KB — it is stored inline in localStorage.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('avatar', String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="rounded-xl border border-surface-line bg-surface-page p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <img
            src={preview}
            alt=""
            className="h-16 w-16 rounded-full bg-white object-cover"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 text-[11px] font-semibold text-venmo-blue hover:underline"
          >
            <Icon name="camera" size={13} /> Upload
          </button>
          {form.avatar && (
            <button
              onClick={() => set('avatar', '')}
              className="text-[11px] text-ink-soft hover:underline"
            >
              Use generated
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <Field
            label="Display name"
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            placeholder="Jamie Rivera"
          />
          <Field
            label="Handle"
            value={form.handle}
            onChange={(e) => set('handle', e.target.value)}
            placeholder="jamie_rivera"
          />
          <Field
            label="Mock balance"
            type="number"
            step="0.01"
            value={form.balance}
            onChange={(e) => set('balance', e.target.value)}
            placeholder="120.00"
          />
          <Field
            label="Bio"
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            placeholder="📍 NYC"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost">Cancel</button>
        <button
          disabled={!form.displayName.trim() && !form.handle.trim()}
          onClick={() => onSave(form)}
          className="btn-primary py-2 text-[14px]"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

export default function MockDataManager() {
  const {
    db, addMockUser, updateMockUser, deleteMockUser,
    regenerateAvatar, resetData, clearAllData,
  } = useStore()

  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [visible, setVisible] = useState(PAGE)
  const [toast, setToast] = useState('')

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return db.users
    return db.users.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q)
    )
  }, [db.users, query])

  const shown = filtered.slice(0, visible)

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-surface-line bg-gradient-to-r from-ink to-[#44464b] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <Icon name="settings" size={18} />
          <h2 className="text-[16px] font-bold">Mock Data Manager</h2>
          <span className="ml-auto rounded-pill bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
            DEV TOOL
          </span>
        </div>
        <p className="mt-1 text-[12px] text-white/70">
          Create and edit the fictional personas used to populate this demo UI.
          Everything lives in your browser's localStorage — nothing is sent anywhere.
        </p>
      </div>

      <div className="px-5 py-4">
        {/* stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-page p-3">
            <div className="text-[11px] font-medium text-ink-soft">Mock profiles</div>
            <div className="text-[20px] font-bold text-ink">{db.users.length}</div>
          </div>
          <div className="rounded-xl bg-surface-page p-3">
            <div className="text-[11px] font-medium text-ink-soft">Transactions</div>
            <div className="text-[20px] font-bold text-ink">{db.transactions.length}</div>
          </div>
          <div className="rounded-xl bg-surface-page p-3">
            <div className="text-[11px] font-medium text-ink-soft">Mock volume</div>
            <div className="text-[20px] font-bold text-ink">
              {money(db.transactions.reduce((s, t) => s + t.amount, 0))}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setCreating(true); setEditingId(null) }}
            className="btn-primary py-2 text-[14px]"
          >
            <Icon name="plus" size={16} className="mr-1" /> New persona
          </button>
          <button onClick={() => setConfirmReset(true)} className="btn-secondary py-2 text-[14px]">
            <Icon name="refresh" size={15} className="mr-1.5" /> Reset to defaults
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            className="btn-ghost text-[14px] text-state-red hover:bg-state-red/10"
          >
            Clear all data
          </button>
        </div>

        {toast && (
          <div className="mb-3 rounded-xl bg-state-green/10 px-4 py-2.5 text-[13px] font-medium text-state-green animate-fade-in">
            {toast}
          </div>
        )}

        {confirmReset && (
          <div className="mb-3 rounded-xl border border-state-amber/40 bg-state-amber/10 p-4">
            <p className="text-[14px] font-semibold text-ink">Reset the mock database?</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              This regenerates the default personas and transaction feed. Any
              personas you created or edited will be discarded.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  resetData()
                  setConfirmReset(false)
                  setVisible(PAGE)
                  flash('Mock database reset to defaults.')
                }}
                className="btn-primary py-2 text-[14px]"
              >
                Yes, reset
              </button>
              <button onClick={() => setConfirmReset(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {confirmClear && (
          <div className="mb-3 rounded-xl border border-state-red/40 bg-state-red/10 p-4">
            <p className="text-[14px] font-semibold text-ink">Delete every mock persona and transaction?</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              This empties the local database, leaving only your demo profile. You
              can rebuild it with “Reset to defaults”.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  clearAllData()
                  setConfirmClear(false)
                  flash('Local mock database cleared.')
                }}
                className="rounded-pill bg-state-red px-6 py-2 text-[14px] font-semibold text-white"
              >
                Yes, clear everything
              </button>
              <button onClick={() => setConfirmClear(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {creating && (
          <div className="mb-4">
            <PersonaForm
              initial={BLANK}
              saveLabel="Create persona"
              onCancel={() => setCreating(false)}
              onSave={(form) => {
                const u = addMockUser(form)
                setCreating(false)
                flash(`Created @${u.handle}.`)
              }}
            />
          </div>
        )}

        {/* search within the manager */}
        <div className="relative mb-3">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
            <Icon name="search" size={17} />
          </div>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE) }}
            placeholder="Filter personas…"
            className="w-full rounded-pill border border-surface-line bg-white py-2.5 pl-10 pr-4 text-[14px] focus:border-venmo-blue focus:outline-none focus:ring-2 focus:ring-venmo-blue/15"
          />
        </div>

        {/* persona list */}
        <div className="divide-y divide-surface-line rounded-xl border border-surface-line">
          {shown.map((u) =>
            editingId === u.id ? (
              <div key={u.id} className="p-3">
                <PersonaForm
                  initial={u}
                  saveLabel="Save changes"
                  onCancel={() => setEditingId(null)}
                  onSave={(form) => {
                    updateMockUser(u.id, form)
                    setEditingId(null)
                    flash('Persona updated.')
                  }}
                />
              </div>
            ) : (
              <div key={u.id} className="flex items-center gap-3 px-3 py-2.5">
                <Avatar user={u} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-semibold text-ink">
                      {u.displayName}
                    </span>
                    {u.isDemoSelf && (
                      <span className="rounded-pill bg-venmo-blueLight px-2 py-0.5 text-[10px] font-bold text-venmo-blueDark">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[12px] text-ink-soft">
                    @{u.handle} · {money(u.balance)}
                  </div>
                </div>

                {confirmDelete === u.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-ink-muted">Delete?</span>
                    <button
                      onClick={() => {
                        deleteMockUser(u.id)
                        setConfirmDelete(null)
                        flash(`Deleted @${u.handle}.`)
                      }}
                      className="rounded-pill bg-state-red px-3 py-1 text-[12px] font-semibold text-white"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-pill px-3 py-1 text-[12px] font-semibold text-ink-muted hover:bg-surface-hover"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => regenerateAvatar(u.id)}
                      title="Regenerate avatar"
                      className="rounded-full p-2 text-ink-soft hover:bg-surface-hover hover:text-venmo-blue"
                    >
                      <Icon name="refresh" size={15} />
                    </button>
                    <button
                      onClick={() => { setEditingId(u.id); setCreating(false) }}
                      title="Edit"
                      className="rounded-full p-2 text-ink-soft hover:bg-surface-hover hover:text-venmo-blue"
                    >
                      <Icon name="edit" size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(u.id)}
                      disabled={u.isDemoSelf}
                      title={u.isDemoSelf ? 'Cannot delete your demo profile' : 'Delete'}
                      className="rounded-full p-2 text-ink-soft hover:bg-surface-hover hover:text-state-red disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-soft"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                )}
              </div>
            )
          )}
          {shown.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-ink-soft">
              No personas match “{query}”.
            </div>
          )}
        </div>

        {visible < filtered.length && (
          <button
            onClick={() => setVisible((v) => v + PAGE * 2)}
            className="btn-secondary mx-auto mt-4 flex py-2 text-[14px]"
          >
            Show more ({filtered.length - visible} remaining)
          </button>
        )}
      </div>
    </section>
  )
}
