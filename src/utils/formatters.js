export function formatRuntime(mins) {
  if (!Number.isFinite(mins)) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function shortText(text, max = 140) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max - 1) + '\u2026' : text
}
