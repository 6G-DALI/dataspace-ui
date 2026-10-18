import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { CatalogueCard, CatalogueLogo, useCatalogueLevel } from '../components/catalogue'
import DatasetSearch from '../components/DatasetSearch'
import Layout, { crumb } from '../components/Layout'
import { AccessBadge, EmptyPanel, ErrorPanel, ExternalLink, KindBadge, Loading } from '../components/ui'
import { useCatalogueExtras, useCatalogues } from '../hooks'
import { ACCESS_HELP } from '../lib/access'
import { isStaging, kindOfCatalogue, sortCatalogues } from '../lib/catalogues'
import { pick } from '../lib/text'
import type { Route, View } from '../router'
import { login } from '../auth/session'
import { useSession } from '../auth/useSession'

/** Every catalogue the visitor can see, filterable by name. */
export function CataloguesPage() {
  const catalogues = useCatalogues()
  const [filter, setFilter] = useState('')
  const sorted = useMemo(() => {
    const f = filter.trim().toLowerCase()
    const list = (catalogues.data ?? []).map(c => ({ ...c, title: pick(c.title) || c.id }))
      .filter(c => !f || c.title.toLowerCase().includes(f) || c.id.includes(f) || pick(c.description).toLowerCase().includes(f))
    return sortCatalogues(list)
  }, [catalogues.data, filter])

  return (
    <Layout view="catalogues" breadcrumbs={[crumb('Home', []), crumb('Catalogues')]}>
      <div className="input-group mb-4" style={{ maxWidth: 480 }}>
        <span className="input-group-text"><FiSearch aria-hidden="true" /></span>
        <input className="form-control" type="search" placeholder="Filter catalogues" aria-label="Filter catalogues"
          value={filter} onChange={e => setFilter(e.target.value)} />
      </div>
      {catalogues.error ? <ErrorPanel title="Catalogues unavailable" message={catalogues.error} />
        : !catalogues.data ? <Loading />
        : sorted.length === 0 ? <EmptyPanel title={filter ? 'No catalogue matches' : 'No catalogues yet'} />
        : <div className="row">{sorted.map(c => <CatalogueCard key={c.id} c={c} />)}</div>}
    </Layout>
  )
}

/**
 * One catalogue: who publishes it, who can see it, and a search of its records.
 * `view` is set for the models and services catalogues, which have their own
 * sidebar entries.
 */
export function CataloguePage({ route, id, view = 'catalogues', basePath }: {
  route: Route
  id: string
  view?: View
  basePath?: string[]
}) {
  const session = useSession()
  const catalogues = useCatalogues()
  const extras = useCatalogueExtras(id)
  const level = useCatalogueLevel(id)
  const cat = catalogues.data?.find(c => c.id === id)
  const kind = kindOfCatalogue(id)
  const title = cat ? pick(cat.title) || id : id
  const unit = kind === 'model' ? 'models' : kind === 'service' ? 'services' : 'records'
  const crumbs = view === 'catalogues'
    ? [crumb('Home', []), crumb('Catalogues', ['catalogues']), crumb(title)]
    : [crumb('Home', []), crumb(title)]

  return (
    <Layout view={view} breadcrumbs={crumbs} pageTitle={title}>
      {catalogues.error && <ErrorPanel title="Catalogue unavailable" message={catalogues.error} />}
      {!catalogues.data && !catalogues.error && <Loading />}
      {catalogues.data && !cat && (
        <EmptyPanel title={`There is no catalogue “${id}” that you can see`}>
          {!session.authenticated && session.ready
            ? <>It may be visible only to its members. <button type="button" className="btn btn-link p-0 align-baseline" onClick={login}>Sign in</button> to check.</>
            : 'Check the address, or ask the catalogue’s owner for access.'}
        </EmptyPanel>
      )}
      {cat && (
        <>
          <section className="card catalogue-header mb-4">
            <div className="card-body d-flex gap-3 align-items-start">
              <CatalogueLogo id={id} size={64} />
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {kind !== 'dataset' && <KindBadge kind={kind} />}
                  {isStaging(id) && <span className="badge text-bg-light border">Staging</span>}
                  <AccessBadge level={level} always />
                  <span className="small text-secondary">{ACCESS_HELP[level]}</span>
                </div>
                {pick(cat.description) && <p className="mb-2">{pick(cat.description)}</p>}
                <div className="d-flex flex-wrap gap-3 small text-secondary">
                  {(extras?.publisher ?? cat.publisher?.name) && <span>Published by {extras?.publisher ?? cat.publisher?.name}</span>}
                  {(extras?.homepage ?? cat.homepage) && <ExternalLink url={(extras?.homepage ?? cat.homepage)!}>Homepage</ExternalLink>}
                  <code>{id}</code>
                </div>
              </div>
            </div>
          </section>
          <DatasetSearch route={route} basePath={basePath ?? ['catalogues', id]} fixed={{ catalog: [id] }} unit={unit} />
        </>
      )}
    </Layout>
  )
}
