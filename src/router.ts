import { useEffect, useState } from 'react'

/**
 * A minimal hash router, the same approach as dataops-ui and portal-ui: the app
 * stays a static site that works under any path with no server rewrite rules,
 * and Keycloak's callback (which owns the query string) never meets the router.
 *
 *   #/                     home
 *   #/catalogues           all catalogues
 *   #/catalogues/:id       one catalogue and a search of its records
 *   #/datasets             search across every catalogue
 *   #/datasets/:id         one record (dataset, ML model or service)
 *   #/models, #/services   the models and services catalogues
 *
 * Search state (q, page, sort, facets) lives in the hash's query string, so a
 * search can be bookmarked and the back button undoes a filter.
 */

export type View = 'home' | 'catalogues' | 'datasets' | 'models' | 'services'

export interface Route {
  /** Path segments, decoded: '#/datasets/a' -> ['datasets', 'a']. */
  path: string[]
  query: URLSearchParams
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '')
  const i = raw.indexOf('?')
  const p = i < 0 ? raw : raw.slice(0, i)
  const q = i < 0 ? '' : raw.slice(i + 1)
  return {
    path: p.split('/').filter(Boolean).map(s => {
      try { return decodeURIComponent(s) } catch { return s }
    }),
    query: new URLSearchParams(q),
  }
}

export type QueryInput = Record<string, string | string[] | number | undefined | null>

/** Builds a hash link. Array values become repeated keys; empty values are dropped. */
export function href(path: string[], query?: QueryInput): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(query ?? {})) {
    const items = Array.isArray(v) ? v : v === undefined || v === null ? [] : [String(v)]
    for (const item of items) if (item !== '') q.append(k, item)
  }
  const qs = q.toString()
  return `#/${path.map(encodeURIComponent).join('/')}${qs ? `?${qs}` : ''}`
}

export function navigate(to: string) {
  window.location.hash = to
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

/** The sidebar entry a route belongs to. */
export function viewOf(route: Route): View {
  const first = route.path[0]
  if (first === 'catalogues' || first === 'datasets' || first === 'models' || first === 'services') return first
  return 'home'
}
