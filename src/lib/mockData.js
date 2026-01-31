import { round4 } from './math'
import { buildHistogram, median, mode, stdDev, coefVar } from './math'

const MAX_DAYS_PER_REQUEST = 93
const NBP_BASE = 'https://api.nbp.pl/api'
const REQUEST_TIMEOUT_MS = 30000
export const REQUEST_TIMEOUT_MESSAGE = 'Request timeout'

function addDays(yyyyMmDd, days) {
  const d = new Date(yyyyMmDd + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.floor((db - da) / (1000 * 60 * 60 * 24))
}

async function fetchJson(url, signal) {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`NBP ${res.status} ${text}`)
    }
    return res.json()
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(REQUEST_TIMEOUT_MESSAGE)
    }
    throw err
  }
}

async function fetchMidRatesChunk(code, start, end, signal) {
  const url = `${NBP_BASE}/exchangerates/rates/a/${code}/${start}/${end}/?format=json`
  const json = await fetchJson(url, signal)

  const rates = (json?.rates || []).map(r => ({
    date: r.effectiveDate,
    rate: round4(r.mid),
  }))

  return rates
}

async function fetchMidRatesRange(code, start, end, signal) {
  if (code === 'PLN') return []

  const out = []
  let curStart = start

  while (curStart <= end) {
    const chunkEnd = (() => {
      const maxEnd = addDays(curStart, MAX_DAYS_PER_REQUEST - 1)
      return maxEnd < end ? maxEnd : end
    })()

    const chunk = await fetchMidRatesChunk(code.toLowerCase(), curStart, chunkEnd, signal)
    out.push(...chunk)

    curStart = addDays(chunkEnd, 1)
  }

  return out
}

export async function realSeries({ from, to, base, quote }) {
  const needBase = base !== 'PLN'
  const needQuote = quote !== 'PLN'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const [basePln, quotePln] = await Promise.all([
      needBase ? fetchMidRatesRange(base, from, to, controller.signal) : Promise.resolve([]),
      needQuote ? fetchMidRatesRange(quote, from, to, controller.signal) : Promise.resolve([]),
    ])

    const mapBase = new Map(basePln.map(p => [p.date, p.rate]))
    const mapQuote = new Map(quotePln.map(p => [p.date, p.rate]))

    let dates = []

    if (base === 'PLN' && quote !== 'PLN') {
      dates = [...mapQuote.keys()].sort()
    } else if (base !== 'PLN' && quote === 'PLN') {
      dates = [...mapBase.keys()].sort()
    } else if (base !== 'PLN' && quote !== 'PLN') {
      dates = [...mapBase.keys()].filter(d => mapQuote.has(d)).sort()
    } else {
      const n = Math.max(0, daysBetween(from, to))
      dates = Array.from({ length: n + 1 }, (_, i) => addDays(from, i))
    }

    const points = dates.map(date => {
      let rate
      if (base === 'PLN' && quote !== 'PLN') {
        rate = round4(1 / mapQuote.get(date))
      } else if (base !== 'PLN' && quote === 'PLN') {
        rate = mapBase.get(date)
      } else if (base !== 'PLN' && quote !== 'PLN') {
        rate = round4(mapBase.get(date) / mapQuote.get(date))
      } else {
        rate = 1
      }

      return { date, rate: round4(rate) }
    })

    return points
  } finally {
    clearTimeout(timeoutId)
  }
}


export function computeSessionsAndStats(points) {
  const rates = points.map(p => round4(p.rate))

  let up = 0, down = 0, flat = 0
  for (let i = 1; i < rates.length; i++) {
    if (rates[i] > rates[i - 1]) up++
    else if (rates[i] < rates[i - 1]) down++
    else flat++
  }

  const med = median(rates)
  const mod = mode(rates)
  const sd = stdDev(rates)
  const cv = coefVar(rates)

  return {
    sessions: { up, flat, down },
    stats: { median: med, mode: mod, stdDev: sd, coefVar: cv },
  }
}

export function computeHistogram(points) {
  const rates = points.map(p => round4(p.rate))
  const deltas = []
  for (let i = 1; i < rates.length; i++) deltas.push(round4(rates[i] - rates[i - 1]))

  return buildHistogram(deltas, 12)
}

export function mockSeries({ from, to, base, quote }) {

  return []
}
