import { useState } from 'react'
import { FiArrowRight, FiCpu, FiDatabase, FiLayers, FiLogIn, FiSearch, FiSettings } from 'react-icons/fi'
import { searchDatasets } from '../api/piveau'
import { login } from '../auth/session'
import { useSession } from '../auth/useSession'
import { CatalogueCard } from '../components/catalogue'
import { DatasetResult } from '../components/DatasetSearch'
import Layout, { crumb } from '../components/Layout'
import { EmptyPanel, ErrorPanel, Loading, MetricCard } from '../components/ui'
import { config } from '../config'
import { useAsync, useCatalogues } from '../hooks'
import { sortCatalogues } from '../lib/catalogues'
import { stateFromQuery } from '../lib/search'
import { pick } from '../lib/text'
import { href, navigate } from '../router'

// Two full rows of four on wide screens.
const HOME_CATALOGUES = 8
const RECENT = 5

/** The public front page: search, the headline counts, the catalogues and what changed lately. */
export default function HomePage() {
  const session = useSession()
  const [text, setText] = useState('')
  const catalogues = useCatalogues()
  // One query gives the total and, through the catalogue facet, the models and services counts.
  const recent = useAsync(
    signal => searchDatasets({ ...stateFromQuery(new URLSearchParams()), limit: RECENT }, {}, signal),
    [session.authenticated],
  )
  const perCatalogue = (id: string) =>
    recent.data ? recent.data.facets.find(f => f.id === 'catalog')?.items.find(i => i.id === id)?.count ?? 0 : undefined

  const sorted = sortCatalogues((catalogues.data ?? []).map(c => ({ ...c, title: pick(c.title) || c.id })))

  return (
    <Layout view="home" breadcrumbs={[crumb('Home')]} pageTitle="6G-DALI Data Space">
      <section className="card hero-card mb-4">
        <div className="card-body">
          <h2 className="hero-title">Find 6G testbed data, ML models and data services</h2>
          <p className="hero-lede">
            The metadata catalogue of the 6G-DALI data space. Records follow the 6G-DALI application profile of
            DCAT-AP, and each dataset is reachable through its testbed's connector.
          </p>
          <form className="input-group input-group-lg hero-search" role="search"
            onSubmit={e => { e.preventDefault(); navigate(href(['datasets'], { q: text.trim() })) }}>
            <span className="input-group-text"><FiSearch aria-hidden="true" /></span>
            <input className="form-control" type="search" value={text} onChange={e => setText(e.target.value)}
              placeholder="Search all records" aria-label="Search all records" />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
          {session.ready && (
            <p className="hero-note mb-0">
              {session.authenticated ? (
                <>Signed in as <strong>{session.username}</strong>: you also see the records restricted to signed-in users and those of the catalogues you are a member of.</>
              ) : (
                <>
                  Some records are visible only to signed-in users or to members of a catalogue.{' '}
                  <button type="button" className="btn btn-sm btn-outline-primary ms-1" onClick={login}>
                    <FiLogIn className="me-1" aria-hidden="true" />Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </section>

      {!recent.error && (
        <div className="row g-3 mb-4">
          <MetricCard label="Records" value={recent.data?.count} icon={<FiDatabase />} onSelect={() => navigate(href(['datasets']))} />
          <MetricCard label="Catalogues" value={catalogues.data?.length} icon={<FiLayers />} onSelect={() => navigate(href(['catalogues']))} />
          {config.modelsCatalogue && (
            <MetricCard label="ML models" value={perCatalogue(config.modelsCatalogue)} icon={<FiCpu />} onSelect={() => navigate(href(['models']))} />
          )}
          {config.servicesCatalogue && (
            <MetricCard label="Data services" value={perCatalogue(config.servicesCatalogue)} icon={<FiSettings />} onSelect={() => navigate(href(['services']))} />
          )}
        </div>
      )}

      <div className="d-flex align-items-center mb-3">
        <h2 className="section-title mb-0">Catalogues</h2>
        <a className="ms-auto small d-inline-flex align-items-center gap-1" href={href(['catalogues'])}>
          All catalogues <FiArrowRight aria-hidden="true" />
        </a>
      </div>
      {catalogues.error ? <ErrorPanel title="Catalogues unavailable" message={catalogues.error} />
        : !catalogues.data ? <Loading />
        : sorted.length === 0 ? <EmptyPanel title="No catalogues yet" />
        : <div className="row">{sorted.slice(0, HOME_CATALOGUES).map(c => <CatalogueCard key={c.id} c={c} />)}</div>}

      <div className="d-flex align-items-center mb-3 mt-2">
        <h2 className="section-title mb-0">Recently updated</h2>
        <a className="ms-auto small d-inline-flex align-items-center gap-1" href={href(['datasets'])}>
          Search all <FiArrowRight aria-hidden="true" />
        </a>
      </div>
      {recent.error ? <ErrorPanel title="Search unavailable" message={recent.error} />
        : !recent.data ? <Loading />
        : recent.data.results.length === 0 ? <EmptyPanel title="Nothing published yet" />
        : recent.data.results.map(d => <DatasetResult key={d.id} d={d} />)}
    </Layout>
  )
}
