import { describe, expect, it } from 'vitest'
import { coefVar } from '../lib/math'

describe('coefVar', () => {
  it('returns null for empty input', () => {
    expect(coefVar([])).toBe(null)
  })

  it('returns null when mean is zero', () => {
    expect(coefVar([1, -1])).toBe(null)
  })

  it('returns 0 when all values are identical (positive rates)', () => {
    expect(coefVar([2.3456, 2.3456, 2.3456])).toBe(0)
  })

  it('computes coefficient of variation for positive values', () => {
    expect(coefVar([1, 2, 3, 4, 5])).toBe(0.527)
  })

  it('handles values with 4-decimal precision (small variance)', () => {
    expect(coefVar([4.1234, 4.1235, 4.1240, 4.1255])).toBe(0.0002)
  })

  it('returns a small coefficient for near-constant positive rates', () => {
    expect(coefVar([1.0001, 1.0002, 1.0003, 1.0004])).toBe(0.0001)
  })
})
