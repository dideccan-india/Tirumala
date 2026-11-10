const iso = (d) => d.toISOString().slice(0, 10)

export const today = () => iso(new Date())
export const addDays = (dateStr, n) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return iso(d)
}

export const nightsBetween = (a, b) => {
  if (!a || !b) return 0
  const n = Math.round((new Date(b) - new Date(a)) / 86400000)
  return n > 0 ? n : 0
}

export const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export const GST_RATE = 0.12 // approximate; set from your pricing rules