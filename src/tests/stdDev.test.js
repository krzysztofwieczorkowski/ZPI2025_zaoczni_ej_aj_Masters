import { describe, expect, it } from 'vitest'
import { stdDev } from '../lib/math'

describe('stdDev', () => {
  it('returns null for empty input', () => {
    expect(stdDev([])).toBe(null)
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
