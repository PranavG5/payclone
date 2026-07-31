import { useRef } from 'react'
import Icon from './Icon.jsx'
import { avatarFor } from '../data/avatar.js'

const MAX_BYTES = 400 * 1024

// Avatar chooser used by both the profile editor and the mock data manager.
// Uploads are read into a data URI and stored locally — nothing is uploaded
// anywhere. An empty value falls back to the generated avatar.
export default function AvatarPicker({
  value,
  onChange,
  seed,
  label,
  size = 72,
  onError,
}) {
  const fileRef = useRef(null)
  const preview = value || avatarFor(seed || 'preview', label || seed || '?')

  function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onError?.('That file is not an image.')
      return
    }
    if (file.size > MAX_BYTES) {
      onError?.('Please choose an image under 400KB — it is stored inline in localStorage.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.onerror = () => onError?.('Could not read that image file.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <img
        src={preview}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, maxWidth: size }}
        className="shrink-0 rounded-full bg-white object-cover"
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1 text-[11px] font-semibold text-venmo-blue hover:underline"
      >
        <Icon name="camera" size={13} /> Upload
      </button>
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-[11px] text-ink-soft hover:underline"
        >
          Use generated
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onChange(avatarFor(String(Math.random()), label || seed || '?'))}
          className="text-[11px] text-ink-soft hover:underline"
        >
          Shuffle
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
    </div>
  )
}
