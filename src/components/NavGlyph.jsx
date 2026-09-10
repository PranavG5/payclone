// Solid 24px tab-bar glyphs. The reference tab bar uses filled marks rather
// than the stroked icons used elsewhere in the app, so these live apart from
// the general Icon set.

function Svg({ children, className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function HomeGlyph({ className }) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 3 22 11.3v7.9a1.6 1.6 0 0 1-1.6 1.6h-4.9v-5.2a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v5.2H3.6A1.6 1.6 0 0 1 2 19.2v-7.9Z"
      />
    </Svg>
  )
}

export function CardGlyph({ className }) {
  // Outer rounded card with a slot knocked out, so the bar colour shows through.
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.4 5h15.2A2.4 2.4 0 0 1 22 7.4v9.2a2.4 2.4 0 0 1-2.4 2.4H4.4A2.4 2.4 0 0 1 2 16.6V7.4A2.4 2.4 0 0 1 4.4 5Zm-2.4 4.4h20v2.5H2Z"
      />
    </Svg>
  )
}

export function CryptoGlyph({ className }) {
  // Filled disc with a knocked-out bitcoin "B".
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.6 3.9h1.5v1.3h.9V5.9h1.5v1.4c1.3.2 2.1 1 2.1 2.1 0 .7-.3 1.3-.9 1.6.8.3 1.2 1 1.2 1.8 0 1.2-.9 2.1-2.4 2.3v1.4h-1.5v-1.3h-.9v1.3h-1.5v-1.3H8.6v-1.4h.9V9.2h-.9V7.8h1.8Zm1.3 4.2h1.5c.5 0 .9-.3.9-.7 0-.5-.4-.7-.9-.7h-1.5Zm0 3.2h1.8c.6 0 1-.3 1-.8s-.4-.8-1-.8h-1.8Z"
      />
    </Svg>
  )
}

// The centre action mark: a bold V letterform with a heavy left stroke, a
// lighter right stroke and a near-pointed vertex, drawn to sit inside the disc.
export function VeeMark({ size = 34, className = 'text-white' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        strokeLinejoin="round"
        d="M15 11h25.5l13.5 43L66.5 11H85L57.5 91H45.5Z"
      />
    </svg>
  )
}
