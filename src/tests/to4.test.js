import { describe, expect, it } from 'vitest'
import { to4 } from '../lib/math'

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
