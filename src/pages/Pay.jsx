import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon, { FilledIcon } from '../components/Icon.jsx'
import { money } from '../lib/format.js'

// Copy mirrors the reference screen's privacy explainer.
const PRIVACY = [
  {
    id: 'private',
    label: 'Private',
    icon: 'person',
    desc: 'This info can be viewed by the sender and recipient only',
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: 'users',
    desc: 'This info can be viewed by the sender, recipient, and their friends',
  },
  {
    id: 'public',
    label: 'Public',
    icon: 'globe',
    desc: 'This info can be viewed by everyone',
  },
]

// Keep the amount to digits with at most one dot and two decimals.
function sanitizeAmount(raw) {
  let v = raw.replace(/[^\d.]/g, '')
  const firstDot = v.indexOf('.')
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '')
    const [int, dec] = v.split('.')
    v = int + '.' + dec.slice(0, 2)
  }
  if (v.length > 1 && v[0] === '0' && v[1] !== '.') v = v.replace(/^0+/, '') || '0'
  return v
}

// --- Success -------------------------------------------------------------
function Success({ recipient, mode, amount, note, onAnother }) {
  return (
    <div className="flex flex-col items-center px-6 pb-10 pt-16 text-center animate-fade-in">
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

      <div className="mt-8 flex w-full max-w-[300px] flex-col gap-2">
        <Link to="/" className="btn-primary w-full">Back to feed</Link>
        <button onClick={onAnother} className="btn-secondary w-full">
          Make another {mode === 'pay' ? 'payment' : 'request'}
        </button>
      </div>
    </div>
  )
}

export default function Pay() {
  const { getUser, currentUser, createTransaction, searchUsers } = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const initialTo = params.get('to')
  const [recipient, setRecipient] = useState(() => (initialTo ? getUser(initialTo) : null))
  const [toQuery, setToQuery] = useState(() => (initialTo ? getUser(initialTo)?.displayName || '' : ''))
  const [toOpen, setToOpen] = useState(false)

  const [amount, setAmount] = useState('0')
  const [note, setNote] = useState('')
  const [privacy, setPrivacy] = useState(currentUser.defaultPrivacy || 'private')
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const [error, setError] = useState('')
  const [status, setStatus] = useState('compose') // compose | processing | done
  const [result, setResult] = useState(null)

  const toWrapRef = useRef(null)

  useEffect(() => {
    if (!initialTo) return
    const u = getUser(initialTo)
    if (u) {
      setRecipient(u)
      setToQuery(u.displayName)
    }
  }, [initialTo, getUser])

  useEffect(() => {
    function onDown(e) {
      if (toWrapRef.current && !toWrapRef.current.contains(e.target)) setToOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const suggestions = toQuery.trim() && !recipient ? searchUsers(toQuery, 6) : []
  const active = PRIVACY.find((p) => p.id === privacy) || PRIVACY[0]
  const numeric = parseFloat(amount) || 0

  function submit(mode) {
    if (!recipient) {
      setError('Choose someone to ' + (mode === 'pay' ? 'pay' : 'request from') + '.')
      return
    }
    if (numeric <= 0) {
      setError('Enter an amount greater than $0.')
      return
    }
    setError('')
    setResult({ mode, amount: numeric, note: note.trim() })
    setStatus('processing')
    setTimeout(() => {
      createTransaction({
        fromId: mode === 'pay' ? currentUser.id : recipient.id,
        toId: mode === 'pay' ? recipient.id : currentUser.id,
        amount: numeric,
        note: note.trim(),
        privacy,
        kind: mode === 'pay' ? 'payment' : 'charge',
      })
      setStatus('done')
    }, 1200)
  }

  function reset() {
    setStatus('compose')
    setResult(null)
    setAmount('0')
    setNote('')
    setRecipient(null)
    setToQuery('')
    navigate('/pay', { replace: true })
  }

  if (status === 'processing') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-24 text-center">
        <span className="h-12 w-12 animate-spin-smooth rounded-full border-[3px] border-venmo-blue/25 border-t-venmo-blue" />
        <p className="mt-5 text-[15px] font-medium text-ink-muted">
          {result.mode === 'pay' ? 'Sending payment…' : 'Sending request…'}
        </p>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="min-h-full bg-white">
        <Success
          recipient={recipient}
          mode={result.mode}
          amount={result.amount}
          note={result.note}
          onAnother={reset}
        />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white px-4 pb-10">
      {/* Amount — "$" sits at the top of the digits, both centred as a unit */}
      <div className="flex items-start justify-center pb-[37px] pt-[11px]">
        <span className="mt-[11px] text-[25px] font-normal leading-none text-ink">$</span>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(sanitizeAmount(e.target.value))
            setError('')
          }}
          onFocus={(e) => {
            if (amount === '0') setAmount('')
            requestAnimationFrame(() => e.target.setSelectionRange(99, 99))
          }}
          onBlur={() => !amount && setAmount('0')}
          inputMode="decimal"
          aria-label="Amount"
          // Width tracks the digit count so the pair stays optically centred.
          style={{ width: `${Math.max(1, amount.length) * 0.62}em` }}
          className="bg-transparent text-[53px] font-normal leading-none tabular-nums text-ink caret-venmo-blue focus:outline-none"
        />
      </div>

      {/* To */}
      <div ref={toWrapRef} className="relative">
        <div className="flex h-[50px] items-center rounded-lg border border-surface-line px-4">
          <span className="mr-4 shrink-0 text-[17px] text-ink-soft">To</span>
          <input
            value={toQuery}
            onChange={(e) => {
              setToQuery(e.target.value)
              setRecipient(null)
              setToOpen(true)
              setError('')
            }}
            onFocus={() => setToOpen(true)}
            placeholder="Business, name or @username"
            className="w-full min-w-0 bg-transparent text-[17px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {recipient && (
            <button
              onClick={() => {
                setRecipient(null)
                setToQuery('')
              }}
              aria-label="Clear recipient"
              className="ml-2 shrink-0 text-ink-faint"
            >
              <Icon name="close" size={17} />
            </button>
          )}
        </div>

        {toOpen && suggestions.length > 0 && (
          <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-20 max-h-[260px] overflow-y-auto rounded-xl bg-white py-1 shadow-dropdown">
            {suggestions.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => {
                    setRecipient(u)
                    setToQuery(u.displayName)
                    setToOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-hover"
                >
                  <Avatar user={u} size={38} />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-ink">
                      {u.displayName}
                    </div>
                    <div className="truncate text-[13px] text-ink-soft">@{u.handle}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What's this for?"
        maxLength={280}
        className="mt-4 h-[149px] w-full resize-none rounded-lg border border-surface-line px-4 py-3 text-[17px] leading-snug text-ink placeholder:text-ink-soft focus:outline-none"
      />

      {/* Privacy */}
      <div className="relative mt-2">
        <button
          onClick={() => setPrivacyOpen((v) => !v)}
          className="flex w-full items-start gap-2 text-left"
        >
          <FilledIcon name={active.icon} size={20} className="mt-px shrink-0 text-venmo-blue" />
          <span className="shrink-0 text-[15px] text-venmo-blue">{active.label}</span>
          <span className="ml-2 text-[15px] leading-[19px] text-ink">{active.desc}</span>
        </button>

        {privacyOpen && (
          <ul className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl bg-white py-1 shadow-dropdown">
            {PRIVACY.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    setPrivacy(p.id)
                    setPrivacyOpen(false)
                  }}
                  className={
                    'flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-surface-hover ' +
                    (p.id === privacy ? 'bg-venmo-blueLight' : '')
                  }
                >
                  <FilledIcon name={p.icon} size={19} className="shrink-0 text-venmo-blue" />
                  <span className="flex-1 text-[15px] font-medium text-ink">{p.label}</span>
                  {p.id === privacy && (
                    <Icon name="check" size={16} className="text-venmo-blue" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="mt-4 text-[13.5px] font-medium text-state-red">{error}</p>
      )}

      {/* Pay / Request */}
      <div className="mt-[25px] flex gap-2">
        <button
          onClick={() => submit('pay')}
          className="h-[46px] flex-1 rounded-pill bg-venmo-blue text-[17px] font-bold text-white transition-colors active:bg-venmo-blueHover"
        >
          Pay
        </button>
        <button
          onClick={() => submit('request')}
          className="h-[46px] flex-1 rounded-pill bg-venmo-blue text-[17px] font-bold text-white transition-colors active:bg-venmo-blueHover"
        >
          Request
        </button>
      </div>
    </div>
  )
}
