# PayClone

A front-end study recreating the layout, component design, and interaction
patterns of a peer-to-peer payments web interface (Venmo-style), built as a
learning and portfolio project.

> **This is a demo application. It is not real.**
> PayClone is not affiliated with, endorsed by, or connected to Venmo, PayPal,
> or any real financial service. There is no backend, no network request, no
> payment processing, and no real account. Every person, balance, and
> transaction is fictional and generated locally in your browser.

## Stack

- **React 18** + **React Router 6**
- **Tailwind CSS 3** (design tokens live in `tailwind.config.js`)
- **Vite** for dev/build
- **localStorage** for persistence — no server, no external APIs

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Architecture

```
src/
  data/
    avatar.js       Deterministic local SVG avatar generator (no external service)
    seed.js         Default mock database: ~240 personas + 600 transactions
  store/
    store.jsx       React context over localStorage; all selectors + mutations
  components/
    AppLayout.jsx   Shell: banner + header + sidebar + mobile bottom nav
    Header.jsx      Sticky header with the live search dropdown
    Sidebar.jsx     Profile card, balance, Pay-or-Request CTA, nav
    SearchBox.jsx   Typeahead with keyboard navigation
    TransactionCard.jsx
    MockDataManager.jsx   The demo-data admin panel
    Avatar.jsx, Icon.jsx, DemoBanner.jsx, FeedSkeleton.jsx
  pages/
    Login.jsx  Home.jsx  Search.jsx  Profile.jsx  Pay.jsx  Settings.jsx
```

### Design system

Tokens are centralized in `tailwind.config.js` rather than scattered as
arbitrary values:

| Token | Value | Use |
| --- | --- | --- |
| `venmo-blue` | `#008CFF` | Primary actions, active nav, links |
| `venmo-blueLight` | `#E6F4FF` | Selected rows, balance card |
| `surface-page` | `#F7F7F7` | App background |
| `surface-card` | `#FFFFFF` | Cards |
| `surface-line` | `#E9EAED` | Dividers and borders |
| `ink` / `ink-muted` / `ink-soft` | `#2F3033` / `#6B6E76` / `#8B8E95` | Text hierarchy |
| `state-green` | `#1DB954` | Incoming amounts, success |

Reusable component classes (`.btn-primary`, `.field`, `.card`, `.skeleton`)
are defined in `src/index.css` under `@layer components`.

### Mock data layer

On first load the app generates a seeded database — the PRNG is fixed, so
"Reset to defaults" always reproduces the same starting set. Avatars are
inline SVG data URIs produced from a hash of the user id, so the app makes
**zero external requests**.

Feed scopes mirror the real app's privacy model: you see your own
transactions plus other people's public and friends-visible ones, and amounts
are only displayed on transactions you're part of.

### Demo Controls (Mock Data Manager)

`Settings → Demo Controls — Mock Data Manager` is a development tool for
shaping the local demo database. It can:

- create new fictional personas (display name, handle, mock balance, bio)
- set a custom avatar via local file upload, or regenerate the generated one
- edit and delete existing personas
- reset the database to the default seed, or clear it entirely

All of it operates purely on the localStorage database.
