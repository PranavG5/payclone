import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import AvatarPicker from './AvatarPicker.jsx'
import Icon from './Icon.jsx'

const PRIVACY = [
  { id: 'public', label: 'Public', icon: 'globe' },
  { id: 'friends', label: 'Friends', icon: 'users' },
  { id: 'private', label: 'Private', icon: 'lock' },
]

function Field({ label, hint, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-ink-muted">{label}</span>
      <input
        className={
          'field ' + (error ? 'border-state-red focus:border-state-red focus:ring-state-red/20' : '')
        }
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-[11.5px] text-state-red">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11.5px] text-ink-faint">{hint}</span>
      ) : null}
    </label>
  )
}

export default function ProfileEditor({ onDone }) {
  const { currentUser, updateProfile, isHandleTaken } = useStore()

  const [form, setForm] = useState({
    displayName: currentUser.displayName || '',
    handle: currentUser.handle || '',
    bio: currentUser.bio || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    balance: String(currentUser.balance ?? 0),
    avatar: currentUser.avatar || '',
    defaultPrivacy: currentUser.defaultPrivacy || 'friends',
  })
  const [fileError, setFileError] = useState('')

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const cleanHandle = form.handle.toLowerCase().replace(/[^a-z0-9_.]/g, '')
  const errors = {
    displayName: form.displayName.trim() ? '' : 'Display name is required.',
    handle: !cleanHandle
      ? 'Handle is required.'
      : isHandleTaken(cleanHandle, currentUser.id)
        ? 'That handle is already used by another persona.'
        : '',
    balance: Number.isFinite(Number(form.balance)) ? '' : 'Enter a number.',
  }
  const valid = !errors.displayName && !errors.handle && !errors.balance

  function save() {
    if (!valid) return
    updateProfile({
      displayName: form.displayName.trim(),
      handle: cleanHandle,
      bio: form.bio.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      balance: Number(form.balance),
      avatar: form.avatar,
      defaultPrivacy: form.defaultPrivacy,
    })
    onDone?.('Profile updated.')
  }

  return (
    <div className="px-5 py-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <AvatarPicker
          value={form.avatar}
          onChange={(v) => {
            setFileError('')
            set('avatar', v)
          }}
          seed={cleanHandle || currentUser.id}
          label={form.displayName}
          size={84}
          onError={setFileError}
        />

        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field
            label="Display name"
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            placeholder="Your name"
            error={errors.displayName}
          />
          <Field
            label="Handle"
            value={form.handle}
            onChange={(e) => set('handle', e.target.value)}
            placeholder="your_handle"
            error={errors.handle}
            hint={cleanHandle ? `Shown as @${cleanHandle}` : 'Letters, numbers, dots, underscores'}
          />
          <div className="sm:col-span-2">
            <Field
              label="Bio"
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Add a short bio"
              maxLength={120}
            />
          </div>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@example.com"
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="(555) 010-1234"
          />
          <Field
            label="Balance"
            type="number"
            step="0.01"
            value={form.balance}
            onChange={(e) => set('balance', e.target.value)}
            placeholder="0.00"
            error={errors.balance}
          />

          <div>
            <span className="mb-1 block text-[12px] font-medium text-ink-muted">
              Default privacy
            </span>
            <div className="flex gap-1.5">
              {PRIVACY.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set('defaultPrivacy', p.id)}
                  className={
                    'flex flex-1 items-center justify-center gap-1 rounded-xl border py-2.5 text-[12px] font-medium transition-colors ' +
                    (form.defaultPrivacy === p.id
                      ? 'border-venmo-blue bg-venmo-blueLight text-venmo-blueDark'
                      : 'border-surface-line text-ink-muted hover:bg-surface-hover')
                  }
                >
                  <Icon name={p.icon} size={15} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {fileError && (
        <p className="mt-3 rounded-xl bg-state-red/10 px-4 py-2.5 text-[12.5px] font-medium text-state-red">
          {fileError}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={() => onDone?.()} className="btn-ghost">
          Cancel
        </button>
        <button onClick={save} disabled={!valid} className="btn-primary py-2 text-[14px]">
          Save changes
        </button>
      </div>
    </div>
  )
}
