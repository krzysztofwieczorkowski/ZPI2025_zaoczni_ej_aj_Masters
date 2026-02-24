import { describe, expect, it } from 'vitest'
import { median } from '../lib/math'

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
