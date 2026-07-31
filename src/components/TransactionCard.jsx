import { Link } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import MiniAvatar from './MiniAvatar.jsx'
import Icon from './Icon.jsx'
import { feedDate, money } from '../lib/format.js'

const PRIVACY_COPY = {
  private: { icon: 'eyeOff', both: 'Only visible to both of you', solo: 'Only visible to you' },
  friends: { icon: 'users', both: 'Visible to you and your friends', solo: 'Visible to your friends' },
  public: { icon: 'globe', both: 'Visible to everyone', solo: 'Visible to everyone' },
}

// Amounts render without trailing ".00" in the feed, the way the reference does.
function feedAmount(n) {
  const v = Number(n) || 0
  return Number.isInteger(v) ? `$${v}` : money(v)
}

function Chip({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={
        'flex h-[39px] w-[39px] items-center justify-center rounded-full bg-surface-chip transition-colors active:bg-[#E8E8EC] ' +
        (active ? 'text-state-red' : 'text-ink')
      }
    >
      <Icon name={icon} size={19} strokeWidth={1.7} className={active ? 'fill-current' : ''} />
    </button>
  )
}

export default function TransactionCard({ tx }) {
  const { getUser, toggleLike, currentUser } = useStore()
  const from = getUser(tx.fromId)
  const to = getUser(tx.toId)
  if (!from || !to) return null

  const iAmSender = tx.fromId === currentUser.id
  const iAmRecipient = tx.toId === currentUser.id
  const involved = iAmSender || iAmRecipient

  const copy = PRIVACY_COPY[tx.privacy] || PRIVACY_COPY.friends
  const privacyLabel = involved ? copy.both : copy.solo
  const verb = tx.kind === 'charge' ? 'charged' : 'paid'

  // Both parties always get an inline bubble; "you" replaces your own name.
  const subject = iAmSender ? currentUser : from
  const object = iAmSender ? to : iAmRecipient ? currentUser : to
  const subjectLabel = iAmSender ? 'You' : from.displayName
  const objectLabel = iAmRecipient ? 'you' : object.displayName

  return (
    <article className="rounded-[20px] bg-white px-4 pb-3 pt-4">
      <div className="flex items-center gap-1.5 text-[15px] text-meta-privacy">
        <Icon name={copy.icon} size={16} strokeWidth={1.7} className="shrink-0" />
        <span className="truncate">{privacyLabel}</span>
        <span aria-hidden>·</span>
        <span className="shrink-0">{feedDate(tx.createdAt)}</span>
        <button
          aria-label="More options"
          className="ml-auto -mr-1 shrink-0 px-1 text-ink"
        >
          <Icon name="dots" size={20} />
        </button>
      </div>

      <p className="mt-[17px] text-[20px] font-medium leading-[27px] text-black">
        <MiniAvatar user={subject} size={20} className="mr-1.5 translate-y-[2px]" />
        {iAmSender ? subjectLabel : <Link to={`/u/${subject.id}`}>{subjectLabel}</Link>}
        <span className="font-normal text-meta-soft"> {verb} </span>
        <MiniAvatar user={object} size={20} className="mr-1.5 translate-y-[2px]" />
        {iAmRecipient ? objectLabel : <Link to={`/u/${object.id}`}>{objectLabel}</Link>}{' '}
        {feedAmount(tx.amount)}
        {tx.note ? (
          <>
            <span className="font-normal text-meta-soft"> for </span>
            {tx.note}
          </>
        ) : null}
      </p>

      <div className="mt-[29px] flex items-center gap-2.5">
        {iAmSender && (
          <Link
            to={`/pay?to=${to.id}&mode=pay`}
            className="flex h-[39px] items-center rounded-full bg-black px-[14px] text-[15px] font-semibold text-white active:bg-[#232323]"
          >
            Pay again
          </Link>
        )}
        <Chip icon="bubble" label="Comment" />
        <Chip icon="heart" label="Like" active={tx._liked} onClick={() => toggleLike(tx.id)} />
        <Chip icon="smilePlus" label="React" />
      </div>
    </article>
  )
}
