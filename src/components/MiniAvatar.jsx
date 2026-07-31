// Small solid-colour initial bubble used inline inside feed sentences.
// The reference renders these as a saturated circle with a white letter,
// which reads far better at ~20px than the full initials avatar.

const COLORS = [
  '#8CC63E', '#E6399B', '#F2A93B', '#4A90D9', '#7C4DFF',
  '#00B8D4', '#FF6E40', '#1DB954', '#D81B60', '#3949AB',
]

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return h >>> 0
}

export default function MiniAvatar({ user, size = 20, className = '' }) {
  const seed = user?.id || user?.handle || '?'
  const bg = COLORS[hash(String(seed)) % COLORS.length]
  const letter = (user?.displayName || user?.handle || '?').trim()[0]?.toUpperCase() || '?'
  return (
    <span
      style={{ width: size, height: size, background: bg, fontSize: size * 0.56 }}
      className={
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold leading-none text-white ' +
        className
      }
      aria-hidden="true"
    >
      {letter}
    </span>
  )
}
