/**
 * Google Analytics (gtag.js), on only when a measurement id is configured (gaMeasurementId, VITE_GA_MEASUREMENT_ID)
 * and the visitor has accepted analytics cookies (lib/consent.ts). Before that, gtag.js is not even loaded.
 *
 * Loaded from code rather than the usual inline snippet, which the Content-Security-Policy (script-src 'self') would
 * block. The app routes in the URL hash, which gtag does not see as a page change, so page views are sent here on
 * every route instead of by gtag itself. The page's query string is left out: after sign-in it holds Keycloak's
 * code and state, which must not reach Google.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

let started = false

/** The address reported for the current route: no query string, the hash route kept. */
export function pageLocation(loc: Pick<Location, 'origin' | 'pathname' | 'hash'>): string {
  return `${loc.origin}${loc.pathname}${loc.hash}`
}

function pageView() {
  window.gtag?.('event', 'page_view', { page_location: pageLocation(window.location), page_title: document.title })
}

export function startAnalytics(measurementId: string): void {
  if (!measurementId) return
  window[`ga-disable-${measurementId}`] = false
  if (started) return
  started = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)

  pageView()
  window.addEventListener('hashchange', pageView)
}

/** Consent withdrawn: gtag sends nothing more, and its cookies (_ga, _ga_<id>) are removed. */
export function stopAnalytics(measurementId: string): void {
  if (!measurementId) return
  window[`ga-disable-${measurementId}`] = true
  const host = window.location.hostname
  const domains = ['', host, ...host.split('.').map((_, i, parts) => `.${parts.slice(i).join('.')}`).slice(0, -1)]
  for (const name of document.cookie.split(';').map(c => c.split('=')[0].trim())) {
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}
