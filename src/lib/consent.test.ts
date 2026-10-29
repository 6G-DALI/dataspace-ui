import { beforeEach, describe, expect, it } from 'vitest'

const store = new Map<string, string>()
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, v) },
    },
  },
})

const consent = await import('./consent')

describe('analytics consent', () => {
  beforeEach(() => store.clear())

  it('asks until the visitor chooses, then remembers the choice', () => {
    expect(consent.getConsent()).toBeNull()
    expect(consent.consentPending()).toBe(true)
    consent.setConsent('denied')
    expect(consent.getConsent()).toBe('denied')
    expect(consent.consentPending()).toBe(false)
  })

  it('shows the banner again from "Cookie settings", until a new choice is made', () => {
    consent.setConsent('granted')
    let notified = 0
    const off = consent.subscribeConsent(() => { notified++ })
    consent.reopenConsent()
    expect(consent.consentPending()).toBe(true)
    consent.setConsent('denied')
    expect(consent.consentPending()).toBe(false)
    expect(notified).toBe(2)
    off()
  })
})
