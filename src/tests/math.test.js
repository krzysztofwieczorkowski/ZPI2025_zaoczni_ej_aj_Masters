import { describe, expect, it } from 'vitest'
import { mode, stdDev, to4 } from '../lib/math'

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
