import Icon from './Icon.jsx'

// Persistent, non-dismissible banner making the demo nature unmistakable.
export default function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-state-amber px-4 py-1.5 text-center text-[12px] font-semibold text-[#3d2c00]">
      <Icon name="shield" size={14} strokeWidth={2.5} />
      <span>
        DEMO APP — NOT REAL. Fictional data only. Not Venmo, PayPal, or any real
        payment service. No real money moves here.
      </span>
    </div>
  )
}
