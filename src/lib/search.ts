/**
 * Search state ↔ the hash query string ↔ the hub-search query. Pure functions,
 * no browser or auth dependencies, so they are unit-tested.
 *
 * In the hash, facets are repeated keys (`#/datasets?format=CSV&format=JSON`);
 * hub-search wants them as one JSON object (`facets={"format":["CSV","JSON"]}`),
 * pages counted from 0, and `sort` as `field+direction`.
 */

export interface FacetSpec {
  id: string
  label: string
}

/** The dataset facets the search page offers, in display order. */
export const DATASET_FACETS: FacetSpec[] = [
  { id: 'catalog', label: 'Catalogue' },
  { id: 'categories', label: 'Theme' },
  { id: 'keywords', label: 'Keyword' },
  { id: 'format', label: 'Format' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'license', label: 'Licence' },
  { id: 'country', label: 'Country' },
  { id: 'accessRight', label: 'Access rights' },
]

export interface SortOption {
  id: string
  label: string
}

export const SORTS: SortOption[] = [
  { id: 'relevance+desc', label: 'Relevance' },
  { id: 'modified+desc', label: 'Recently updated' },
  { id: 'issued+desc', label: 'Newest' },
  { id: 'title.en+asc', label: 'Title (A–Z)' },
]

/** Relevance only means something for a text query; without one the newest updates come first. */
export function defaultSort(q: string): string {
  return q ? 'relevance+desc' : 'modified+desc'
}

export const PAGE_SIZES = [10, 25, 50]

export interface SearchState {
  q: string
  /** 1-based, as shown. */
  page: number
  limit: number
  /** '' means the default for the query (see defaultSort). */
  sort: string
  facets: Record<string, string[]>
}

const RESERVED = new Set(['q', 'page', 'limit', 'sort'])

export function stateFromQuery(query: URLSearchParams): SearchState {
  const facets: Record<string, string[]> = {}
  for (const [k, v] of query.entries()) {
    if (RESERVED.has(k) || !v) continue
    ;(facets[k] ??= []).includes(v) || facets[k].push(v)
  }
  const page = Number.parseInt(query.get('page') ?? '', 10)
  const limit = Number.parseInt(query.get('limit') ?? '', 10)
  const sort = query.get('sort') ?? ''
  return {
    q: (query.get('q') ?? '').trim(),
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: PAGE_SIZES.includes(limit) ? limit : PAGE_SIZES[0],
    sort: SORTS.some(s => s.id === sort) ? sort : '',
    facets,
  }
}

/** The hash query for a state; defaults are left out so links stay short. */
export function stateToQuery(s: SearchState): Record<string, string | string[] | undefined> {
  return {
    q: s.q || undefined,
    page: s.page > 1 ? String(s.page) : undefined,
    limit: s.limit !== PAGE_SIZES[0] ? String(s.limit) : undefined,
    sort: s.sort || undefined,
    ...s.facets,
  }
}

/**
 * The hub-search query string for datasets. `fixed` facets (the catalogue of a
 * catalogue page) are added to the user's and cannot be removed by them.
 */
export function datasetSearchQuery(s: SearchState, fixed: Record<string, string[]> = {}): string {
  const facets: Record<string, string[]> = {}
  for (const [k, v] of Object.entries({ ...s.facets })) if (v.length) facets[k] = [...v]
  for (const [k, v] of Object.entries(fixed)) facets[k] = [...new Set([...(facets[k] ?? []), ...v])]
  const q = new URLSearchParams()
  q.set('filter', 'dataset')
  if (s.q) q.set('q', s.q)
  q.set('limit', String(s.limit))
  q.set('page', String(Math.max(0, s.page - 1)))
  q.set('sort', s.sort || defaultSort(s.q))
  if (Object.keys(facets).length) q.set('facets', JSON.stringify(facets))
  return q.toString()
}

/** Adds or removes one facet value, and goes back to the first page. */
export function toggleFacet(s: SearchState, facet: string, value: string): SearchState {
  const current = s.facets[facet] ?? []
  const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
  const facets = { ...s.facets }
  if (next.length) facets[facet] = next
  else delete facets[facet]
  return { ...s, facets, page: 1 }
}
