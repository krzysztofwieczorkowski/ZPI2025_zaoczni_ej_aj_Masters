import { describe, expect, it } from 'vitest'
import { mode } from '../lib/math'

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
})
