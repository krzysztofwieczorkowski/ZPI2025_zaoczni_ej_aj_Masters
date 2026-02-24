import { describe, expect, it } from 'vitest'
import { buildHistogram, round4 } from '../lib/math'

describe('buildHistogram', () => {
  it('returns bins of length binCount and ticks [0] for empty input', () => {
    const result = buildHistogram([])
    expect(result.bins).toHaveLength(12)
    result.bins.forEach((b) => {
      expect(b.binStart).toBe(0)
      expect(b.binEnd).toBe(0)
      expect(b.binCenter).toBe(0)
      expect(b.count).toBe(0)
    })
    expect(result.ticks).toEqual([0])
  })

  it('returns bins of length 6 for empty input with binCount 6', () => {
    const result = buildHistogram([], 6)
    expect(result.bins).toHaveLength(6)
    expect(result.ticks).toEqual([0])
  })

  it('uses equal bin width for all bins', () => {
    const result = buildHistogram([1, 2, 3, -1, -2], 6)
    const widths = result.bins.map((b) => b.binEnd - b.binStart)
    const firstWidth = widths[0]
    widths.forEach((w) => {
      expect(Math.abs(w - firstWidth)).toBeLessThan(1e-9)
    })
  })

  it('has consecutive bins where binEnd of i equals binStart of i+1', () => {
    const result = buildHistogram([1, 2, 3, -1, -2], 6)
    const bins = result.bins
    for (let i = 0; i < bins.length - 1; i++) {
      expect(Math.abs(bins[i].binEnd - bins[i + 1].binStart)).toBeLessThan(1e-9)
    }
  })

  it('has binCenter equal to (binStart + binEnd) / 2 for each bin', () => {
    const result = buildHistogram([1, 2, 3, -1, -2], 6)
    result.bins.forEach((b) => {
      const expectedCenter = round4((b.binStart + b.binEnd) / 2)
      expect(b.binCenter).toBe(expectedCenter)
    })
  })

  it('uses range symmetric around 0 (min === -max)', () => {
    const result = buildHistogram([1, 2, 5], 6)
    const firstStart = result.bins[0].binStart
    const lastEnd = result.bins[result.bins.length - 1].binEnd
    expect(Math.abs(firstStart + lastEnd)).toBeLessThan(1e-9)
  })

  it('uses range symmetric around 0 for negative-dominant data', () => {
    const result = buildHistogram([-10, 3], 6)
    const firstStart = result.bins[0].binStart
    const lastEnd = result.bins[result.bins.length - 1].binEnd
    expect(Math.abs(firstStart + lastEnd)).toBeLessThan(1e-9)
  })

  it('has 0 within bin range [binStart of first, binEnd of last]', () => {
    const result = buildHistogram([1, 2, 5], 6)
    const min = result.bins[0].binStart
    const max = result.bins[result.bins.length - 1].binEnd
    expect(min).toBeLessThanOrEqual(0)
    expect(max).toBeGreaterThanOrEqual(0)
  })

  it('includes 0 in ticks', () => {
    const result = buildHistogram([1, 2, 3, -1], 6)
    expect(result.ticks).toContain(0)
  })

  it('sum of bin counts equals input length', () => {
    const values = [1, 1, 2, 3, -1]
    const result = buildHistogram(values, 6)
    const total = result.bins.reduce((acc, b) => acc + b.count, 0)
    expect(total).toBe(values.length)
  })

  it('returns exactly binCount bins when binCount is specified', () => {
    const result = buildHistogram([1, 2, 3], 6)
    expect(result.bins).toHaveLength(6)
  })

  it('returns valid structure with equal-width bins for all-zero input', () => {
    const result = buildHistogram([0, 0, 0], 6)
    expect(result.bins).toHaveLength(6)
    expect(result.ticks).toBeDefined()
    expect(Array.isArray(result.ticks)).toBe(true)
    const widths = result.bins.map((b) => b.binEnd - b.binStart)
    const firstWidth = widths[0]
    widths.forEach((w) => {
      expect(Math.abs(w - firstWidth)).toBeLessThan(1e-9)
    })
    result.bins.forEach((b) => {
      expect(typeof b.binStart).toBe('number')
      expect(typeof b.binEnd).toBe('number')
      expect(typeof b.binCenter).toBe('number')
      expect(Number.isInteger(b.count)).toBe(true)
    })
  })

  it('values are assigned to bins in the correct range', () => {
    // Dla 6 binów i zakresu [-2, 2]: width = 4/6, bin 0: [-2, -1.333), bin 2: [-0.667, 0), bin 4: [0.667, 1.333)
    const bin0Values = [-1.8, -1.5]
    const bin2Values = [-0.5, -0.3]
    const bin4Values = [0.8, 1.0, 1.05]
    const values = [...bin0Values, ...bin2Values, ...bin4Values]
    const result = buildHistogram(values, 6)
    expect(result.bins[0].count).toBe(bin0Values.length)
    expect(result.bins[2].count).toBe(bin2Values.length)
    expect(result.bins[4].count).toBe(bin4Values.length)
    expect(result.bins[1].count).toBe(0)
    expect(result.bins[3].count).toBe(0)
    expect(result.bins[5].count).toBe(0)
  })
})
