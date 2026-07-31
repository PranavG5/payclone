# PayClone

A front-end study recreating the layout, component design, and interaction
patterns of a peer-to-peer payments web interface (Venmo-style), built as a
learning and portfolio project.

> **This is a demo application. It is not real.**
> PayClone is not affiliated with, endorsed by, or connected to Venmo, PayPal,
> or any real financial service. There is no backend, no network request, no
> payment processing, and no real account. Every person, balance, and
> transaction is fictional and generated locally in your browser.

Built **mobile-first**: the UI is a phone-width column (max 430px). On wider
screens it letterboxes on a neutral backdrop rather than reflowing to a
desktop layout.

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
    AppLayout.jsx   Phone-shaped app shell: fixed header, scrolling content,
                    bottom nav, and the slide-out drawer
    Drawer.jsx      Hamburger menu: profile, balance, nav, sign out
    TransactionCard.jsx
    MockDataManager.jsx   The demo-data admin panel
    ProfileEditor.jsx     Edit every field of the signed-in persona
    AvatarPicker.jsx      Shared upload / generate avatar control
    Avatar.jsx, Icon.jsx, FeedSkeleton.jsx
  pages/
    Login.jsx  Home.jsx  Search.jsx  Profile.jsx  Pay.jsx  Settings.jsx
```

### Design system

Tokens are centralized in `tailwind.config.js` rather than scattered as
arbitrary values:

| Token | Value | Use |
| --- | --- | --- |
| `venmo-blue` | `#0074DE` | Primary actions, active nav, links |
| `venmo-blueLight` | `#E7F1FC` | Selected rows, balance card |
| `surface-page` | `#F7F7F7` | App background |
| `surface-card` | `#FFFFFF` | Cards |
| `surface-line` | `#D7D9DB` | Field borders and dividers |
| `surface-app` | `#E4E6EA` | Backdrop behind the phone column |
| `ink` / `ink-muted` / `ink-soft` / `ink-faint` | `#2F3032` / `#6B7076` / `#878C94` / `#A7A8A9` | Text hierarchy |
| `state-green` | `#1DB954` | Incoming amounts, success |

These values were sampled pixel-by-pixel from a reference screenshot of the
real mobile web app rather than eyeballed.

### Pay & Request screen

`src/pages/Pay.jsx` is matched to that reference at a 390x844 viewport:
the amount row, the 50px `To` field, the 149px note box, the privacy
explainer, and the 46px button pills all land within a pixel of the original.

Text is sized for the system UI font (SF Pro on iOS, Roboto on Android) via
the `-apple-system` stack. On Linux — including CI screenshots — that falls
back to Liberation Sans, which is metrically Arial-like and renders roughly
7% wider, so text-wrap points will differ there from a real phone.

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
