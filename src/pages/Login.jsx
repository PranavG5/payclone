import { useState } from 'react'
import { useStore } from '../store/store.jsx'
import Icon from '../components/Icon.jsx'

export default function Login() {
  const { login } = useStore()
  const [busy, setBusy] = useState(false)

  function enter() {
    setBusy(true)
    setTimeout(login, 550) // brief mock "signing in" beat
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-venmo-blue text-white">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Icon name="wallet" size={30} strokeWidth={2.2} />
          </span>
          <span className="text-[36px] font-bold tracking-tight">payclone</span>
        </div>

        <h1 className="mt-8 text-[28px] font-bold leading-tight">
          The demo way to pay people back
        </h1>
        <p className="mt-3 text-[15px] text-white/85">
          A pixel-study recreation of a peer-to-peer payments UI. Everyone here
          is a fictional character. No real accounts, no real money.
        </p>

        <button
          onClick={enter}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-pill bg-white py-3.5 text-[16px] font-semibold text-venmo-blue transition-transform active:scale-[0.98] disabled:opacity-80"
        >
          {busy ? (
            <>
              <span className="h-5 w-5 animate-spin-smooth rounded-full border-2 border-venmo-blue/30 border-t-venmo-blue" />
              Signing in…
            </>
          ) : (
            'Enter demo as “Demo User”'
          )}
        </button>

        <p className="mt-4 text-[12px] text-white/70">
          No sign-up, no password — just click to explore the interface.
        </p>
      </div>

      <div className="relative pb-6 text-center text-[11px] text-white/60">
        Educational / portfolio project. Not affiliated with Venmo or PayPal.
      </div>
    </div>
  )
}
