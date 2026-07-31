import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'
import { money } from '../lib/format.js'

const PRIVACY_OPTIONS = [
  { id: 'public', label: 'Public', icon: 'globe', desc: 'Everyone' },
  { id: 'friends', label: 'Friends', icon: 'users', desc: 'You and your friends' },
  { id: 'private', label: 'Private', icon: 'lock', desc: 'Only you and them' },
]

// --- Step 1: pick a recipient --------------------------------------------
function PickRecipient({ onPick }) {
  const { searchUsers, db } = useStore()
  const [q, setQ] = useState('')
  const list = q.trim()
    ? searchUsers(q, 30)
    : db.users.filter((u) => !u.isDemoSelf).slice(0, 12)

  return (
    <div>
      <h1 className="mb-4 text-[22px] font-bold text-ink">Pay or Request</h1>
      <div className="relative mb-4">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
          <Icon name="search" size={20} />
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for someone to pay"
          className="w-full rounded-pill border border-surface-line bg-white py-3.5 pl-12 pr-4 text-[16px] focus:border-venmo-blue focus:outline-none focus:ring-2 focus:ring-venmo-blue/15"
        />
      </div>
      <div className="card divide-y divide-surface-line overflow-hidden">
        {list.map((u) => (
          <button
            key={u.id}
            onClick={() => onPick(u)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
          >
            <Avatar user={u} size={44} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-ink">{u.displayName}</div>
              <div className="truncate text-[13px] text-ink-soft">@{u.handle}</div>
            </div>
            <Icon name="chevronRight" size={18} className="text-ink-faint" />
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Step 2: amount + note + privacy -------------------------------------
function Compose({ recipient, mode, setMode, onBack, onSubmit, defaultPrivacy }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [privacy, setPrivacy] = useState(defaultPrivacy)

  const numeric = parseFloat(amount)
  const valid = numeric > 0 && note.trim().length > 0

  return (
    <div>
      <button onClick={onBack} className="mb-3 flex items-center gap-1 text-[14px] font-medium text-ink-muted hover:text-ink">
        <Icon name="arrowLeft" size={18} /> Back
      </button>

      <div className="card overflow-hidden">
        {/* recipient header */}
        <div className="flex items-center gap-3 border-b border-surface-line px-5 py-4">
          <Avatar user={recipient} size={44} />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">{recipient.displayName}</div>
            <div className="truncate text-[13px] text-ink-soft">@{recipient.handle}</div>
          </div>
        </div>

        {/* pay / request toggle */}
        <div className="flex gap-1 p-1.5">
          {['pay', 'request'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                'flex-1 rounded-pill py-2 text-[14px] font-semibold capitalize transition-colors ' +
                (mode === m ? 'bg-venmo-blue text-white' : 'text-ink-muted hover:bg-surface-hover')
              }
            >
              {m}
            </button>
          ))}
        </div>

        {/* amount entry */}
        <div className="flex flex-col items-center px-5 py-8">
          <label className="text-[13px] font-medium text-ink-soft">
            {mode === 'pay' ? 'You pay' : 'You request'}
          </label>
          <div className="mt-2 flex items-baseline justify-center">
            <span className="text-[40px] font-semibold text-ink">$</span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              // Width tracks the digits so the "$" stays glued to the number.
              style={{ width: `${Math.max(4, (amount || '0.00').length) * 0.62}em` }}
              className="bg-transparent text-[56px] font-semibold tabular-nums text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
        </div>

        {/* note */}
        <div className="px-5 pb-4">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's it for?"
            maxLength={140}
            className="field text-center"
          />
        </div>

        {/* privacy toggle */}
        <div className="border-t border-surface-line px-5 py-4">
          <div className="mb-2 text-[13px] font-medium text-ink-soft">Privacy</div>
          <div className="flex gap-2">
            {PRIVACY_OPTIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPrivacy(p.id)}
                title={p.desc}
                className={
                  'flex flex-1 flex-col items-center gap-1 rounded-xl border py-2.5 text-[12px] font-medium transition-colors ' +
                  (privacy === p.id
                    ? 'border-venmo-blue bg-venmo-blueLight text-venmo-blueDark'
                    : 'border-surface-line text-ink-muted hover:bg-surface-hover')
                }
              >
                <Icon name={p.icon} size={18} />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={() => onSubmit({ amount: numeric, note: note.trim(), privacy })}
        className="btn-primary mt-4 w-full py-3.5 text-[16px]"
      >
        {mode === 'pay' ? `Pay ${numeric > 0 ? money(numeric) : ''}` : `Request ${numeric > 0 ? money(numeric) : ''}`}
      </button>
    </div>
  )
}

// --- Step 3: processing + success ----------------------------------------
function Success({ recipient, mode, amount, note, onDone }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-state-green/15 animate-pop-in">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-state-green">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            className="animate-check-draw"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-[22px] font-bold text-ink">
        {mode === 'pay' ? 'Payment sent!' : 'Request sent!'}
      </h2>
      <p className="mt-1 text-[15px] text-ink-muted">
        {mode === 'pay' ? 'You paid ' : 'You requested '}
        <span className="font-semibold text-ink">{money(amount)}</span>
        {mode === 'pay' ? ' to ' : ' from '}
        <span className="font-semibold text-ink">{recipient.displayName}</span>
      </p>
      {note && <p className="mt-2 text-[14px] text-ink-soft">“{note}”</p>}

      <div className="mt-8 flex w-full max-w-[280px] flex-col gap-2">
        <Link to="/" className="btn-primary w-full">Back to feed</Link>
        <button onClick={onDone} className="btn-secondary w-full">
          Make another {mode === 'pay' ? 'payment' : 'request'}
        </button>
      </div>
    </div>
  )
}

export default function Pay() {
  const { getUser, currentUser, createTransaction } = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const initialTo = params.get('to')
  const [recipient, setRecipient] = useState(() => (initialTo ? getUser(initialTo) : null))
  const [mode, setMode] = useState(params.get('mode') === 'request' ? 'request' : 'pay')
  const [status, setStatus] = useState('compose') // compose | processing | done
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (initialTo) setRecipient(getUser(initialTo))
  }, [initialTo, getUser])

  const step = !recipient ? 'pick' : status

  function submit({ amount, note, privacy }) {
    setStatus('processing')
    setResult({ amount, note, privacy })
    setTimeout(() => {
      createTransaction({
        fromId: mode === 'pay' ? currentUser.id : recipient.id,
        toId: mode === 'pay' ? recipient.id : currentUser.id,
        amount,
        note,
        privacy,
        kind: mode === 'pay' ? 'payment' : 'charge',
      })
      setStatus('done')
    }, 1200)
  }

  const wrap = 'mx-auto max-w-[480px]'

  if (step === 'pick') {
    return (
      <div className={wrap}>
        <PickRecipient onPick={setRecipient} />
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div className={wrap}>
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <span className="h-12 w-12 animate-spin-smooth rounded-full border-[3px] border-venmo-blue/25 border-t-venmo-blue" />
          <p className="mt-5 text-[15px] font-medium text-ink-muted">
            {mode === 'pay' ? 'Sending payment…' : 'Sending request…'}
          </p>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className={wrap}>
        <Success
          recipient={recipient}
          mode={mode}
          amount={result.amount}
          note={result.note}
          onDone={() => {
            setStatus('compose')
            setResult(null)
            navigate('/pay', { replace: true })
          }}
        />
      </div>
    )
  }

  return (
    <div className={wrap}>
      <Compose
        recipient={recipient}
        mode={mode}
        setMode={setMode}
        defaultPrivacy={currentUser.defaultPrivacy || 'friends'}
        onBack={() => (initialTo ? navigate(-1) : setRecipient(null))}
        onSubmit={submit}
      />
    </div>
  )
}
