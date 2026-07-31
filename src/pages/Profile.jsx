import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import Avatar from '../components/Avatar.jsx'
import TransactionCard from '../components/TransactionCard.jsx'
import Icon from '../components/Icon.jsx'
import { money, fullDate } from '../lib/format.js'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUser, userTransactions, currentUser } = useStore()
  const user = getUser(id)

  const txns = useMemo(() => (user ? userTransactions(user.id) : []), [user, userTransactions])

  if (!user) {
    return (
      <div className="card px-6 py-14 text-center">
        <p className="text-[15px] font-semibold text-ink">Person not found</p>
        <p className="mt-1 text-[13px] text-ink-soft">
          This profile may have been removed from the demo database.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          Back home
        </Link>
      </div>
    )
  }

  const isSelf = user.id === currentUser.id

  return (
    <div className="px-4 pb-6 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 flex items-center gap-1 text-[14px] font-medium text-ink-muted hover:text-ink"
      >
        <Icon name="arrowLeft" size={18} /> Back
      </button>

      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-venmo-blue to-venmo-blueDark" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar user={user} size={80} ring className="ring-4" />
            {!isSelf && (
              <div className="flex gap-2">
                <Link to={`/pay?to=${user.id}&mode=request`} className="btn-secondary py-2 text-[14px]">
                  Request
                </Link>
                <Link to={`/pay?to=${user.id}&mode=pay`} className="btn-primary py-2 text-[14px]">
                  Pay
                </Link>
              </div>
            )}
          </div>

          <h1 className="mt-3 text-[22px] font-bold text-ink">{user.displayName}</h1>
          <p className="text-[14px] text-ink-soft">@{user.handle}</p>
          {user.bio && <p className="mt-2 text-[14px] text-ink">{user.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-ink-soft">
            <span>Joined {fullDate(new Date(user.joined).getTime())}</span>
            {isSelf && (
              <span className="font-semibold text-ink">
                Balance {money(user.balance)}
              </span>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-2 mt-6 px-1 text-[16px] font-bold text-ink">
        {isSelf ? 'Your activity' : 'Public activity'}
      </h2>

      {txns.length === 0 ? (
        <div className="card px-6 py-12 text-center text-[14px] text-ink-soft">
          No transactions to show yet.
        </div>
      ) : (
        <div className="space-y-3">
          {txns.slice(0, 40).map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  )
}
