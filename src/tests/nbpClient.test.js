import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { realSeries, REQUEST_TIMEOUT_MESSAGE } from '../lib/nbpClient'

describe('realSeries timeout', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.useFakeTimers()
    global.fetch = vi.fn((url, options = {}) => {
      const { signal } = options
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          const err = new Error('AbortError')
          err.name = 'AbortError'
          reject(err)
          return
        }
        signal?.addEventListener('abort', () => {
          const err = new Error('AbortError')
          err.name = 'AbortError'
          reject(err)
        })
      })
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('aborts and reports a 30s timeout message', async () => {
    const promise = realSeries({
      from: '2024-01-01',
      to: '2024-01-10',
      base: 'USD',
      quote: 'EUR',
    })

    const expectation = expect(promise).rejects.toThrow(REQUEST_TIMEOUT_MESSAGE)
    await vi.advanceTimersByTimeAsync(30000)
    await expectation
    expect(global.fetch).toHaveBeenCalled()
  })

  it('resolves without timeout on fast response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        rates: [{ effectiveDate: '2024-01-01', mid: 4 }],
      }),
    })

    const points = await realSeries({
      from: '2024-01-01',
      to: '2024-01-01',
      base: 'USD',
      quote: 'EUR',
    })

    expect(points).toHaveLength(1)
    expect(points[0]).toEqual({ date: '2024-01-01', rate: 1 })
  })
})
