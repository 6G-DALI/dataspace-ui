import { accessToken } from '../auth/session'
import { config } from '../config'
import { parseCatalogue, parseRecord, type CatalogueExtras, type RecordExtras } from '../lib/record'
import { datasetSearchQuery, type SearchState } from '../lib/search'
import type { Localized } from '../lib/text'

/**
 * The catalogue reads piveau directly, from the browser: hub-search for search
 * and summaries, hub-repo for each record's RDF. Both allow this origin and the
 * Authorization header in their CORS configuration.
 *
 * Signed in, every call carries the user's token and piveau returns what that
 * user may see; anonymous calls get the public records. If piveau rejects the
 * token (401 — wrong realm, or a session revoked meanwhile) the call is retried
 * anonymously, so a bad session degrades to the public view instead of an error.
 */

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

function join(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function get(url: string, accept: string, signal?: AbortSignal): Promise<Response> {
  const token = await accessToken()
  const send = (auth: boolean) =>
    fetch(url, { headers: { Accept: accept, ...(auth && token ? { Authorization: `Bearer ${token}` } : {}) }, signal })
  let res = await send(true)
  if (res.status === 401 && token) res = await send(false)
  return res
}

async function getJson<T>(url: string, accept: string, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await get(url, accept, signal)
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new ApiError(0, 'The catalogue service could not be reached.')
  }
  if (!res.ok) {
    throw new ApiError(res.status, res.status === 404
      ? 'Not found, or not visible to you.'
      : res.status === 403 ? 'You do not have access to this record.' : `The catalogue service answered ${res.status}.`)
  }
  return (await res.json()) as T
}

// ---- hub-search shapes (only the fields the UI reads) -----------------------------------------

export interface Labelled {
  id?: string
  label?: Localized
  title?: Localized
  resource?: string
}

export interface SearchCatalogue {
  id: string
  title?: Localized
  description?: Localized
  /** Number of records in the catalogue. */
  count?: number
  publisher?: { name?: string; resource?: string } | null
  country?: Labelled | null
  homepage?: string
  modified?: string
  issued?: string
  access_right?: Labelled | null
}

export interface SearchDistribution {
  id: string
  title?: Localized
  description?: Localized
  format?: Labelled | null
  media_type?: string
  byte_size?: number
  license?: Labelled | null
  access_url?: string[]
  download_url?: string[]
  issued?: string
  modified?: string
}

export interface SearchDataset {
  id: string
  title?: Localized
  description?: Localized
  catalog?: { id: string; title?: Localized } | null
  keywords?: { id: string; label: string }[]
  categories?: { id: string; label?: Localized; resource?: string }[]
  publisher?: { name?: string } | null
  creator?: { name?: string; email?: string } | null
  contact_point?: { name?: string; email?: string }[] | null
  distributions?: SearchDistribution[]
  issued?: string
  modified?: string
  catalog_record?: { modified?: string; issued?: string } | null
  access_right?: Labelled | null
  landing_page?: { resource?: string }[] | null
  identifier?: string[]
  resource?: string
  license?: Labelled | null
}

export interface FacetItem {
  id: string
  title?: Localized
  count?: number
}

export interface Facet {
  id: string
  title?: Localized
  items: FacetItem[]
}

export interface SearchPage<T> {
  count: number
  results: T[]
  facets: Facet[]
}

interface Envelope<T> {
  result: T
}

// ---- calls -------------------------------------------------------------------------------------

export async function searchDatasets(
  state: SearchState,
  fixed: Record<string, string[]> = {},
  signal?: AbortSignal,
): Promise<SearchPage<SearchDataset>> {
  const url = join(config.searchApiUrl, `search?${datasetSearchQuery(state, fixed)}`)
  const r = await getJson<Envelope<SearchPage<SearchDataset>>>(url, 'application/json', signal)
  return { count: r.result.count ?? 0, results: r.result.results ?? [], facets: r.result.facets ?? [] }
}

export async function listCatalogues(signal?: AbortSignal): Promise<SearchCatalogue[]> {
  const url = join(config.searchApiUrl, 'search?filter=catalogue&limit=500')
  const r = await getJson<Envelope<SearchPage<SearchCatalogue>>>(url, 'application/json', signal)
  return r.result.results ?? []
}

export async function getDataset(id: string, signal?: AbortSignal): Promise<SearchDataset> {
  const url = join(config.searchApiUrl, `datasets/${encodeURIComponent(id)}`)
  return (await getJson<Envelope<SearchDataset>>(url, 'application/json', signal)).result
}

/** The record's RDF, read for the profile terms. Null when hub-repo has nothing usable. */
export async function getRecordExtras(id: string, signal?: AbortSignal): Promise<RecordExtras | null> {
  const url = join(config.repoApiUrl, `datasets/${encodeURIComponent(id)}`)
  return parseRecord(await getJson<unknown>(url, 'application/ld+json', signal), id)
}

const catalogueCache = new Map<string, Promise<CatalogueExtras | null>>()

/**
 * A catalogue's logo, country and access rights. Cached per page load: every
 * catalogue card asks, and the answer does not change while someone browses.
 * Failures resolve to null — a card without a logo is not an error.
 */
export function getCatalogueExtras(id: string): Promise<CatalogueExtras | null> {
  let p = catalogueCache.get(id)
  if (!p) {
    const url = join(config.repoApiUrl, `catalogues/${encodeURIComponent(id)}`)
    p = getJson<unknown>(url, 'application/ld+json').then(parseCatalogue).catch(() => null)
    catalogueCache.set(id, p)
  }
  return p
}

/** Forget cached catalogue details, e.g. after the session changed. */
export function clearCatalogueCache() {
  catalogueCache.clear()
}

/** The record's RDF in another serialisation, as hub-repo serves it by file extension. */
export function linkedDataUrl(id: string, ext: 'ttl' | 'jsonld' | 'rdf' | 'nt' | 'n3'): string {
  return join(config.repoApiUrl, `datasets/${encodeURIComponent(id)}.${ext}`)
}
