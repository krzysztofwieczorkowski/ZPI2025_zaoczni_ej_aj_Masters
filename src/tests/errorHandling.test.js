import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  GENERIC_ERROR_MESSAGE,
  NO_INTERNET_MESSAGE,
  REQUEST_TIMEOUT_MESSAGE,
  resolveErrorMessage,
} from '../lib/errorHandling'

const hasNavigator = typeof navigator !== 'undefined'
const originalNavigator = hasNavigator ? navigator : undefined

afterEach(() => {
  vi.unstubAllGlobals()
  if (!hasNavigator) {
    delete globalThis.navigator
  } else if (originalNavigator) {
    vi.stubGlobal('navigator', originalNavigator)
  }
})

describe('resolveErrorMessage', () => {
  it('returns no-internet message when offline', () => {
    vi.stubGlobal('navigator', { onLine: false })
    expect(resolveErrorMessage(new Error('Any error'))).toBe(NO_INTERNET_MESSAGE)
  })

  it('returns no-internet message for fetch TypeError', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(resolveErrorMessage(new TypeError('Failed to fetch'))).toBe(NO_INTERNET_MESSAGE)
  })

  it('returns request timeout message for timeout errors', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(resolveErrorMessage(new Error(REQUEST_TIMEOUT_MESSAGE))).toBe(REQUEST_TIMEOUT_MESSAGE)
  })

  it('returns original Error message when provided', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(resolveErrorMessage(new Error('NBP 500 service down'))).toBe('NBP 500 service down')
  })

  it('falls back to generic message for empty Error message', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(resolveErrorMessage(new Error(''))).toBe(GENERIC_ERROR_MESSAGE)
  })

  it('returns null for non-error values', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(resolveErrorMessage('boom')).toBe(null)
  })
})
