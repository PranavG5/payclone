import { Link } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import { relativeTime, money } from '../lib/format.js'

function PrivacyIcon({ privacy }) {
  const map = { public: 'globe', friends: 'users', private: 'lock' }
  const label = { public: 'Public', friends: 'Friends', private: 'Private' }
  return (
    <span title={label[privacy]} className="text-ink-faint">
      <Icon name={map[privacy] || 'users'} size={13} strokeWidth={2} />
    </span>
  )
}

export default function TransactionCard({ tx }) {
  const { getUser, toggleLike, currentUser } = useStore()
  const from = getUser(tx.fromId)
  const to = getUser(tx.toId)
  if (!from || !to) return null

  const verb = tx.kind === 'charge' ? 'charged' : 'paid'

  // Amounts are only surfaced on transactions you're part of — other people's
  // amounts stay hidden in the social feed, the way the real app behaves.
  const involved = tx.fromId === currentUser.id || tx.toId === currentUser.id
  const incoming = tx.toId === currentUser.id

  return (
    <article className="card p-4 transition-shadow hover:shadow-cardHover">
      <div className="flex gap-3">
        <Link to={`/u/${from.id}`} className="shrink-0">
          <Avatar user={from} size={44} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] leading-snug text-ink">
              <Link to={`/u/${from.id}`} className="font-semibold hover:underline">
                {from.displayName}
              </Link>
              <span className="text-ink-muted"> {verb} </span>
              <Link to={`/u/${to.id}`} className="font-semibold hover:underline">
                {to.displayName}
              </Link>
            </p>
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-soft">
            <span>{relativeTime(tx.createdAt)}</span>
            <span aria-hidden>·</span>
            <PrivacyIcon privacy={tx.privacy} />
          </div>

          {tx.note && <p className="mt-2 text-[15px] text-ink">{tx.note}</p>}

          <div className="mt-3 flex items-center gap-5 border-t border-surface-line pt-2.5 text-ink-soft">
            <button
              onClick={() => toggleLike(tx.id)}
              className={
                'flex items-center gap-1.5 text-[13px] transition-colors hover:text-state-red ' +
                (tx._liked ? 'text-state-red' : '')
              }
            >
              <Icon
                name="heart"
                size={16}
                className={tx._liked ? 'fill-current' : ''}
              />
              {tx.likes > 0 && <span>{tx.likes}</span>}
            </button>
            <button className="flex items-center gap-1.5 text-[13px] transition-colors hover:text-venmo-blue">
              <Icon name="comment" size={16} />
              {tx.comments > 0 && <span>{tx.comments}</span>}
            </button>
          </div>
        </div>

        {involved ? (
          <div
            className={
              'shrink-0 self-start text-[15px] font-semibold tabular-nums ' +
              (incoming ? 'text-state-green' : 'text-ink')
            }
          >
            {incoming ? '+ ' : '- '}
            {money(tx.amount)}
          </div>
        ) : tx.kind === 'charge' ? (
          <div className="shrink-0 self-start rounded-pill bg-venmo-blueLight px-2.5 py-1 text-[12px] font-semibold text-venmo-blueDark">
            requested
          </div>
        ) : null}
      </div>
    </article>
  )
}
