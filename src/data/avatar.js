// Deterministic, fully-local avatar generator.
// Produces an inline SVG data URI from a seed string — no network / external API.
// The look mimics DiceBear-style "identicon + initials" avatars.

const PALETTES = [
  ['#008CFF', '#E6F4FF'],
  ['#1DB954', '#E4F8EC'],
  ['#F4A522', '#FDF1DD'],
  ['#E0245E', '#FCE4EC'],
  ['#7C4DFF', '#EDE7FF'],
  ['#00B8D4', '#DEF7FB'],
  ['#FF6E40', '#FFE9E1'],
  ['#455A64', '#E7EBED'],
  ['#D81B60', '#FCE1EC'],
  ['#3949AB', '#E4E7F6'],
]

// Small, fast string hash (djb2 variant) → unsigned 32-bit int.
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  }
  return h >>> 0
}

function initials(name) {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Returns a data-URI SVG string for a circular avatar seeded by `seed`.
export function avatarFor(seed, label) {
  const h = hash(String(seed))
  const [fg, bg] = PALETTES[h % PALETTES.length]
  const text = initials(label || seed)

  // A few deterministic decorative blobs for texture behind the initials.
  const rand = (n) => (hash(seed + ':' + n) % 1000) / 1000
  const blobs = [0, 1, 2]
    .map((n) => {
      const cx = 12 + rand('x' + n) * 76
      const cy = 12 + rand('y' + n) * 76
      const r = 10 + rand('r' + n) * 22
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(
        1
      )}" fill="${fg}" opacity="0.12" />`
    })
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
<rect width="100" height="100" fill="${bg}"/>
${blobs}
<text x="50" y="50" dy="0.35em" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="38" font-weight="700" fill="${fg}">${text}</text>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
