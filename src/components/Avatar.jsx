export default function Avatar({ user, size = 44, ring = false, className = '' }) {
  const src = user?.avatar
  const alt = user?.displayName || 'avatar'
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={
        'shrink-0 rounded-full bg-surface-hover object-cover ' +
        (ring ? 'ring-2 ring-white ' : '') +
        className
      }
      draggable={false}
    />
  )
}
