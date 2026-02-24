import { describe, expect, it } from 'vitest'
import { mode, stdDev, to4, median, buildHistogram, round4 } from '../lib/math'

describe('to4 rounding', () => {
  it('rounds down at 5th decimal below 5', () => {
    expect(to4(1.23444)).toBe('1.2344')
  })

  it('rounds up at 5th decimal of 5 or more', () => {
    expect(to4(1.23445)).toBe('1.2345')
  })

  it('pads trailing zeros to 4 decimals', () => {
    expect(to4(1.2)).toBe('1.2000')
  })

  it('rounds negative values correctly', () => {
    expect(to4(-2.34565)).toBe('-2.3457')
  })
})

describe('mode', () => {
  it('returns null for empty input', () => {
    expect(mode([])).toBe(null)
  })

  it('returns null when all values are unique', () => {
    expect(mode([1, 2, 3, 4])).toBe(null)
  })

  it('returns the single most frequent value', () => {
    expect(mode([1, 2, 2, 3])).toBe(2)
  })

  it('returns null for multiple modes', () => {
    expect(mode([1, 1, 2, 2, 3])).toBe(null)
  })

  it('return the mode for unordered values', () => {
    expect(mode([3, 1, 2, 2, 3, 3])).toBe(3)
  })

  it('return the mode for values with decimals', () => {
    expect(mode([1.2, 1.2, 1.3, 1.2, 1.4])).toBe(1.2)
  })

  it('return the mode for values with decimals and unordered', () => {
    expect(mode([1.2, 1.3, 1.2, 1.4, 1.2])).toBe(1.2)
  })

  it('return the mode for negative values', () => {
    expect(mode([-1.2, -1.2, -1.3, -1.2, -1.4])).toBe(-1.2)
  })

  it('return the mode for negative values and unordered', () => {
    expect(mode([-1.2, -1.3, -1.2, -1.4, -1.2])).toBe(-1.2)
  })

  describe('stdDev', () => {
    it('returns null for empty input', () => {
      expect(stdDev([])).toBe(null)
    })
  })

  it('returns 0 for input with one value', () => {
    expect(stdDev([1])).toBe(0)
  })

  it('returns the standard deviation for input with multiple values', () => {
    expect(stdDev([1, 2, 3, 4, 5])).toBe(1.5811)
  })

  it('returns the standard deviation for input with multiple values and decimals', () => {
    expect(stdDev([1.2, 1.2, 1.3, 1.2, 1.4])).toBe(0.0894)
  })

  it('returns the standard deviation for input with multiple values and negative values', () => {
    expect(stdDev([-1.2, -1.2, -1.3, -1.2, -1.4])).toBe(0.0894)
  })

  it('returns the standard deviation for input with multiple values and negative values and unordered', () => {
    expect(stdDev([-1.2, -1.3, -1.2, -1.4, -1.2])).toBe(0.0894)
  })
})


describe('median', () => {
  it('returns null for empty input', () => {
    expect(median([])).toBe(null)
  })

  it('returns the middle value for odd count (unsorted input)', () => {
    expect(median([3, 1, 2])).toBe(2)
  })

  it('returns the middle value for odd count with decimals', () => {
    expect(median([1.3, 1.1, 1.2])).toBe(1.2)
  })

  it('returns the average of two middle values for even count', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('returns the average for even count with unordered input', () => {
    expect(median([4, 1, 3, 2])).toBe(2.5)
  })

  it('returns a value rounded to 4 decimals for even count that requires rounding', () => {
    expect(median([1.2344, 1.2346])).toBe(1.2345)
  })

  it('handles negative values (odd count)', () => {
    expect(median([-3, -1, -2])).toBe(-2)
  })

  it('handles negative values (even count)', () => {
    expect(median([-1.3, -1.1])).toBe(-1.2)
  })

  it('returns the same value when all elements are equal', () => {
    expect(median([2, 2, 2])).toBe(2)
  })

  it('handles numbers with many decimal places', () => {
    expect(median([-4.3425, -2.2345, 0.000, 1.2345, 1.8565, 3.5473, 4.3245, 6.4234])).toBe(1.5455)
  })
})

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