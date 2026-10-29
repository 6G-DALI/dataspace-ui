/**
 * The visitor's choice about analytics cookies (GDPR/ePrivacy): nothing is sent to Google until they accept.
 *
 * Kept in this browser's localStorage. When storage is unavailable (private window, blocked site data) the choice
 * lasts for the visit only, and analytics stays off until the visitor accepts again.
 */

export type Consent = 'granted' | 'denied'

const KEY = 'dali_catalogue_analytics_consent'
const listeners = new Set<() => void>()
let memory: Consent | null = null
let reopened = false

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY)
    if (v === 'granted' || v === 'denied') return v
  } catch { /* storage unavailable */ }
  return memory
}

export function setConsent(value: Consent): void {
  memory = value
  reopened = false
  try { window.localStorage.setItem(KEY, value) } catch { /* storage unavailable: kept for this visit */ }
  listeners.forEach(l => l())
}

/** Whether the banner should show: no choice made yet, or the visitor asked to change it. */
export function consentPending(): boolean {
  return reopened || getConsent() === null
}

/** "Cookie settings": shows the banner again. */
export function reopenConsent(): void {
  reopened = true
  listeners.forEach(l => l())
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
