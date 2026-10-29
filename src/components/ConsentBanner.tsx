import { useSyncExternalStore } from 'react'
import { config } from '../config'
import { startAnalytics, stopAnalytics } from '../lib/analytics'
import { consentPending, getConsent, reopenConsent, setConsent, subscribeConsent } from '../lib/consent'

/** Whether analytics is configured at all; without it there is nothing to consent to and no banner. */
export function analyticsConfigured(): boolean {
  return !!config.gaMeasurementId
}

/**
 * Asks once whether analytics cookies may be used, and applies the answer: accepting starts Google Analytics,
 * declining (now or later, from "Cookie settings" in the footer) keeps or turns it off. Only the strictly necessary
 * storage (sign-in, theme, this choice) is used without asking.
 */
export default function ConsentBanner() {
  const pending = useSyncExternalStore(subscribeConsent, consentPending)
  if (!analyticsConfigured() || !pending) return null

  const choose = (accept: boolean) => {
    setConsent(accept ? 'granted' : 'denied')
    if (accept) startAnalytics(config.gaMeasurementId)
    else stopAnalytics(config.gaMeasurementId)
  }

  return (
    <div className="position-fixed bottom-0 start-0 end-0 p-3" style={{ zIndex: 1080 }}
      role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-text">
      <div className="card shadow mx-auto" style={{ maxWidth: '60rem' }}>
        <div className="card-body d-flex flex-wrap align-items-center gap-3">
          <div className="flex-grow-1" style={{ minWidth: '16rem' }}>
            <div id="consent-title" className="fw-semibold mb-1">Cookies on the Data Space</div>
            <p id="consent-text" className="small mb-0">
              With your consent we use Google Analytics cookies to count visits and see which pages are used, so we can
              improve the catalogue. Declining does not change anything else on the site.{' '}
              {config.cookiesPolicyUrl && <a href={config.cookiesPolicyUrl} target="_blank" rel="noopener noreferrer">Cookies policy</a>}
              {config.cookiesPolicyUrl && config.privacyPolicyUrl && ' · '}
              {config.privacyPolicyUrl && <a href={config.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">Privacy policy</a>}
            </p>
          </div>
          <div className="d-flex gap-2 ms-auto">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => choose(false)}>Decline</button>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => choose(true)}>Accept</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Footer link that shows the banner again, so a choice can be changed or withdrawn. */
export function CookieSettingsLink() {
  if (!analyticsConfigured()) return null
  return (
    <button type="button" className="btn btn-link btn-sm p-0 align-baseline ms-2" onClick={reopenConsent}
      title={`Analytics cookies: ${getConsent() === 'granted' ? 'accepted' : 'not accepted'}`}>
      Cookie settings
    </button>
  )
}
