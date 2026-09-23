// Put the whole page into browser fullscreen. Must be called synchronously
// from a user gesture (click/tap) or the browser will refuse. The app offers
// no in-app way out: users leave with the OS gesture (swipe up / pinch out
// on mobile, Esc on desktop).
export function enterFullscreen() {
  const el = document.documentElement
  const request =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitRequestFullScreen ||
    el.msRequestFullscreen
  if (!request) return // e.g. iPhone Safari, which only allows video fullscreen
  if (document.fullscreenElement || document.webkitFullscreenElement) return
  try {
    const result = request.call(el, { navigationUI: 'hide' })
    if (result && typeof result.catch === 'function') result.catch(() => {})
  } catch {
    // Browser declined; the demo still works in a normal window.
  }
}
