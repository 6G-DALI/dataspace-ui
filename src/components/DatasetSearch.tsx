import { useEffect, useState } from 'react'
import { FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { searchDatasets, type Facet, type SearchDataset } from '../api/piveau'
import { useSession } from '../auth/useSession'
import { login } from '../auth/session'
import { useAsync } from '../hooks'
import { levelOf } from '../lib/access'
import { kindOfCatalogue } from '../lib/catalogues'
import {
  DATASET_FACETS, defaultSort, PAGE_SIZES, SORTS, stateFromQuery, stateToQuery, toggleFacet, type SearchState,
} from '../lib/search'
import { formatDate, licenceLabel, pick } from '../lib/text'
import { href, navigate, type Route } from '../router'
import { AccessBadge, EmptyPanel, ErrorPanel, KindBadge, Loading, Pagination } from './ui'

/**
 * Faceted record search, used by the Datasets page (every catalogue) and by
 * each catalogue page (`fixed` pins the catalogue). The state lives in the
 * hash, so every search is a link and Back undoes the last change.
 */

interface Props {
  route: Route
  /** Hash path this search lives at, e.g. ['datasets'] or ['catalogues', id]. */
  basePath: string[]
  /** Facet values that always apply and are not shown as removable filters. */
  fixed?: Record<string, string[]>
  /** What the results are called: "datasets", "models", "records". */
  unit?: string
}

function facetLabel(facetId: string, item: { id: string; title?: unknown }): string {
  const t = pick(item.title as never) || item.id
  return facetId === 'license' ? licenceLabel(t) : facetId === 'accessRight' ? t.replace(/_/g, ' ') : t
}

export default function DatasetSearch({ route, basePath, fixed = {}, unit = 'records' }: Props) {
  const session = useSession()
  const state = stateFromQuery(route.query)
  const key = JSON.stringify([state, fixed, session.authenticated])
  const result = useAsync(signal => searchDatasets(state, fixed, signal), [key])
  const [text, setText] = useState(state.q)
  const [showFacets, setShowFacets] = useState(false)
  useEffect(() => setText(state.q), [state.q])

  const go = (next: SearchState) => navigate(href(basePath, stateToQuery(next)))
  const hiddenFacets = new Set(Object.keys(fixed))
  const facets = (result.data?.facets ?? [])
    .filter(f => !hiddenFacets.has(f.id))
    .filter(f => DATASET_FACETS.some(s => s.id === f.id))
    .sort((a, b) => DATASET_FACETS.findIndex(s => s.id === a.id) - DATASET_FACETS.findIndex(s => s.id === b.id))
  const active = Object.entries(state.facets).flatMap(([f, vs]) => vs.map(v => ({ f, v })))

  return (
    <div className="dataset-search">
      <form className="search-bar mb-3" role="search"
        onSubmit={e => { e.preventDefault(); go({ ...state, q: text.trim(), page: 1, sort: '' }) }}>
        <div className="input-group">
          <span className="input-group-text"><FiSearch aria-hidden="true" /></span>
          <input className="form-control" type="search" value={text} onChange={e => setText(e.target.value)}
            placeholder={`Search ${unit}`} aria-label={`Search ${unit}`} />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>

      <div className="row g-4">
        <aside className={`col-lg-3 ${showFacets ? '' : 'd-none d-lg-block'}`} aria-label="Filters">
          {facets.map(f => <FacetGroup key={f.id} facet={f} state={state} onChange={go} />)}
          {result.loading && !result.data && <Loading label="Loading filters…" />}
        </aside>

        <section className="col-lg-9" aria-live="polite">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <button type="button" className="btn btn-sm btn-outline-secondary d-lg-none" onClick={() => setShowFacets(s => !s)}>
              <FiFilter className="me-1" aria-hidden="true" />{showFacets ? 'Hide filters' : 'Filters'}
            </button>
            <span className="text-secondary small">
              {result.data ? `${result.data.count.toLocaleString()} ${unit}` : ' '}
            </span>
            <label className="ms-auto d-flex align-items-center gap-2 small text-secondary">
              Sort
              <select className="form-select form-select-sm w-auto" value={state.sort || defaultSort(state.q)}
                onChange={e => go({ ...state, sort: e.target.value === defaultSort(state.q) ? '' : e.target.value, page: 1 })}>
                {SORTS.filter(s => state.q || s.id !== 'relevance+desc').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {active.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {active.map(({ f, v }) => (
                <button key={`${f}:${v}`} type="button" className="btn btn-sm btn-outline-primary filter-chip"
                  onClick={() => go(toggleFacet(state, f, v))} aria-label={`Remove filter ${v}`}>
                  <span className="text-secondary me-1">{DATASET_FACETS.find(s => s.id === f)?.label ?? f}:</span>
                  {facetValueTitle(result.data?.facets, f, v)}
                  <FiX className="ms-1" aria-hidden="true" />
                </button>
              ))}
              <button type="button" className="btn btn-sm btn-link" onClick={() => go({ ...state, facets: {}, page: 1 })}>
                Clear all
              </button>
            </div>
          )}

          {result.error ? (
            <ErrorPanel title="Search unavailable" message={result.error} />
          ) : !result.data ? (
            <Loading />
          ) : result.data.results.length === 0 ? (
            <EmptyPanel title={`No ${unit} found`}>
              {state.q || active.length ? 'Try fewer filters or another search term.' : 'Nothing has been published here yet.'}
              {!session.authenticated && session.ready && (
                <p className="mt-2 mb-0">
                  Some records are only visible after you{' '}
                  <button type="button" className="btn btn-link p-0 align-baseline" onClick={login}>sign in</button>.
                </p>
              )}
            </EmptyPanel>
          ) : (
            <div className={result.loading ? 'opacity-50' : undefined}>
              {result.data.results.map(d => <DatasetResult key={d.id} d={d} />)}
              <Pagination page={state.page} pageSize={state.limit} total={result.data.count} pageSizes={PAGE_SIZES} unit={unit}
                onPage={p => go({ ...state, page: p })} onPageSize={s => go({ ...state, limit: s, page: 1 })} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function facetValueTitle(facets: Facet[] | undefined, facetId: string, value: string): string {
  const item = facets?.find(f => f.id === facetId)?.items.find(i => i.id === value)
  return item ? facetLabel(facetId, item) : facetId === 'license' ? licenceLabel(value) : value
}

const FACET_PREVIEW = 6

function FacetGroup({ facet, state, onChange }: { facet: Facet; state: SearchState; onChange: (s: SearchState) => void }) {
  const [expanded, setExpanded] = useState(false)
  const selected = state.facets[facet.id] ?? []
  const items = facet.items.filter(i => (i.count ?? 0) > 0 || selected.includes(i.id))
  if (items.length === 0) return null
  const label = DATASET_FACETS.find(s => s.id === facet.id)?.label ?? (pick(facet.title) || facet.id)
  const shown = expanded ? items : items.slice(0, FACET_PREVIEW)
  return (
    <div className="card facet-group mb-3">
      <div className="card-header py-2"><h2 className="facet-title mb-0">{label}</h2></div>
      <ul className="list-unstyled mb-0 p-2">
        {shown.map(i => {
          const id = `facet-${facet.id}-${i.id}`
          return (
            <li key={i.id} className="form-check facet-item">
              <input className="form-check-input" type="checkbox" id={id} checked={selected.includes(i.id)}
                onChange={() => onChange(toggleFacet(state, facet.id, i.id))} />
              <label className="form-check-label d-flex justify-content-between gap-2" htmlFor={id}>
                <span className="text-break">{facetLabel(facet.id, i)}</span>
                <span className="text-muted small">{i.count ?? 0}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {items.length > FACET_PREVIEW && (
        <button type="button" className="btn btn-sm btn-link text-start px-3 pb-2" onClick={() => setExpanded(x => !x)}>
          {expanded ? 'Show fewer' : `Show all ${items.length}`}
        </button>
      )}
    </div>
  )
}

export function DatasetResult({ d }: { d: SearchDataset }) {
  const catalogueId = d.catalog?.id ?? ''
  // The dataset's own level: every writer keeps dct:accessRights equal to the level piveau enforces, and an
  // administrator can publish a dataset of a private catalogue, so the catalogue's level says nothing about it.
  const level = levelOf(d.access_right?.resource ?? pick(d.access_right?.label)) ?? 'public'
  const kind = kindOfCatalogue(catalogueId)
  const formats = [...new Set((d.distributions ?? []).map(x => pick(x.format?.label) || x.format?.id || '').filter(Boolean))]
  const updated = d.modified ?? d.issued ?? d.catalog_record?.modified
  return (
    <article className="card result-card mb-3">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
          {kind !== 'dataset' && <KindBadge kind={kind} />}
          <AccessBadge level={level} />
          {catalogueId && (
            <a className="small text-secondary" href={href(['catalogues', catalogueId])}>{pick(d.catalog?.title) || catalogueId}</a>
          )}
        </div>
        <h2 className="result-title"><a href={href(['datasets', d.id])}>{pick(d.title) || d.id}</a></h2>
        {pick(d.description) && <p className="result-text clamp-3 mb-2">{pick(d.description)}</p>}
        <div className="d-flex flex-wrap align-items-center gap-2 small text-secondary">
          {formats.map(f => <span key={f} className="badge format-badge">{f}</span>)}
          {d.publisher?.name && <span>{d.publisher.name}</span>}
          {updated && <span>Updated {formatDate(updated)}</span>}
        </div>
      </div>
    </article>
  )
}
