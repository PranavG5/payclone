// Minimal inline icon set (stroke-based, 24px grid) — no icon library needed.
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20h5v-5h4v5h5V9.5" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
  comment: <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />,
  arrowLeft: <path d="M19 12H5m7-7-7 7 7 7" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />,
  edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  refresh: <path d="M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  wallet: <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4Z" />,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" /><circle cx="12" cy="13" r="4" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  // Privacy indicator on feed cards — the reference uses a lashes/eye-off mark.
  eyeOff: <path d="M2 10c1.6 2.2 5 5 10 5s8.4-2.8 10-5M4 14l-1.6 2.4M20 14l1.6 2.4M9 16l-.7 2.6M15 16l.7 2.6" />,
  dots: <><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  bubble: <path d="M20 11.5c0 3.6-3.6 6.5-8 6.5-.9 0-1.8-.1-2.6-.3L4 20l1.3-3.4C4.2 15.3 3.5 13.5 3.5 11.5 3.5 7.9 7.1 5 11.5 5s8.5 2.9 8.5 6.5Z" />,
  smilePlus: <><circle cx="11" cy="12" r="8" /><path d="M8 11h.01M14 11h.01M8.5 15c.7.8 1.6 1.2 2.5 1.2s1.8-.4 2.5-1.2M19 4v4M17 6h4" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></>,
  crypto: <><circle cx="12" cy="12" r="9" /><path d="M10 8h3.2a2.4 2.4 0 0 1 0 4.8H10V8Zm0 4.8h3.6a2.4 2.4 0 0 1 0 4.8H10v-4.8ZM11.5 6v2m0 8v2" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M20 20v.01M17 20v.01M14 20v.01M20 17v.01" /></>,
}

// Solid-fill glyphs (the stroke-based set above doesn't cover these).
const filled = {
  person: (
    <path
      d="M12 12.4a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 1.8c-3.6 0-7 1.9-7 4.2v1.4a.8.8 0 0 0 .8.8h12.4a.8.8 0 0 0 .8-.8v-1.4c0-2.3-3.4-4.2-7-4.2Z"
      fill="currentColor"
    />
  ),
  globe: (
    <path
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.6a15.6 15.6 0 0 0-1.4-3.5A8 8 0 0 1 18.9 8ZM12 4.2c.7 1 1.3 2.3 1.7 3.8h-3.4c.4-1.5 1-2.8 1.7-3.8ZM4.3 14a7.9 7.9 0 0 1 0-4h3a17.6 17.6 0 0 0 0 4Zm.8 2h2.6c.3 1.3.8 2.5 1.4 3.5A8 8 0 0 1 5.1 16Zm2.6-8H5.1a8 8 0 0 1 4-3.5C8.5 5.5 8 6.7 7.7 8ZM12 19.8c-.7-1-1.3-2.3-1.7-3.8h3.4c-.4 1.5-1 2.8-1.7 3.8ZM14.1 14H9.9a15.5 15.5 0 0 1 0-4h4.2a15.5 15.5 0 0 1 0 4Zm.8 5.5c.6-1 1.1-2.2 1.4-3.5h2.6a8 8 0 0 1-4 3.5Zm1.8-5.5a17.6 17.6 0 0 0 0-4h3a7.9 7.9 0 0 1 0 4Z"
      fill="currentColor"
    />
  ),
  lock: (
    <path
      d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4Z"
      fill="currentColor"
    />
  ),
  users: (
    <path
      d="M9 11.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm7.2.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 13.2c-3.3 0-6.4 1.7-6.4 3.9v1.4c0 .4.3.7.8.7h11.2c.5 0 .8-.3.8-.7v-1.4c0-2.2-3.1-3.9-6.4-3.9Zm7.2.3c-.6 0-1.2.1-1.7.2 1.1.9 1.8 2 1.8 3.4v1.4c0 .3 0 .5-.1.7h4.6c.4 0 .7-.3.7-.7v-1.2c0-1.9-2.4-3.8-5.3-3.8Z"
      fill="currentColor"
    />
  ),
}

export function FilledIcon({ name, size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {filled[name] || null}
    </svg>
  )
}

export default function Icon({ name, size = 22, className = '', strokeWidth = 2, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  )
}
