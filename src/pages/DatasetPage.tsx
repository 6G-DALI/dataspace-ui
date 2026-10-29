import { FiCode, FiEdit3 } from 'react-icons/fi'
import { getDataset, getRecordExtras, linkedDataUrl } from '../api/piveau'
import { login } from '../auth/session'
import { useSession } from '../auth/useSession'
import Layout, { crumb } from '../components/Layout'
import { DistributionCard, ServicePanel } from '../components/record'
import { AccessBadge, CopyableId, ErrorPanel, ExternalLink, KindBadge, Loading, Row, YesNo } from '../components/ui'
import { config } from '../config'
import { useAsync } from '../hooks'
import { ACCESS_HELP, levelOf } from '../lib/access'
import { KIND_LABEL, kindOfCatalogue } from '../lib/catalogues'
import type { RecordExtras } from '../lib/record'
import { formatDate, licenceLabel, pick, stripMailto } from '../lib/text'
import { href } from '../router'

function hasProfile(x: RecordExtras): boolean {
  return !!(x.snsProjectName || x.producedBy || x.attributedTo || x.conformsTo.length || x.testbedContext.length
    || x.variables.length || x.containsPII !== null || x.gdprCompliant !== null || x.fairCompliant !== null)
}

/** One record: a dataset, an ML model or a data service, with its distributions. */
export default function DatasetPage({ id }: { id: string }) {
  const session = useSession()
  const summary = useAsync(signal => getDataset(id, signal), [id, session.authenticated])
  // The RDF adds the profile terms; the page still works if it cannot be read.
  const extras = useAsync(signal => getRecordExtras(id, signal).catch(() => null), [id, session.authenticated])
  const d = summary.data
  const x = extras.data ?? undefined
  const catalogueId = d?.catalog?.id ?? ''
  const kind = kindOfCatalogue(catalogueId)
  // The dataset's own level (dct:accessRights, kept equal to what piveau enforces): an administrator can publish a
  // dataset of a private catalogue, so the catalogue's level is not used.
  const level = levelOf(x?.accessRights ?? d?.access_right?.resource ?? pick(d?.access_right?.label)) ?? 'public'
  const title = d ? pick(d.title) || d.id : id

  const crumbs = [
    crumb('Home', []),
    ...(catalogueId ? [crumb(pick(d?.catalog?.title) || catalogueId, ['catalogues', catalogueId])] : [crumb('Datasets', ['datasets'])]),
    crumb(title),
  ]

  if (summary.error) {
    return (
      <Layout view="datasets" breadcrumbs={crumbs} pageTitle="Record">
        <ErrorPanel title="This record is not available" message={summary.error} />
        {!session.authenticated && session.ready && (
          <p className="text-secondary mt-3">
            It may be visible only to signed-in users or to members of its catalogue.{' '}
            <button type="button" className="btn btn-link p-0 align-baseline" onClick={login}>Sign in</button> to try again.
          </p>
        )}
      </Layout>
    )
  }

  const contact = d?.contact_point?.[0]
  const license = x?.license ?? d?.license?.resource ?? null
  const keywords = d?.keywords ?? []
  const themes = (d?.categories ?? []).map(c => pick(c.label) || c.id)

  return (
    <Layout view={kind === 'model' ? 'models' : kind === 'service' ? 'services' : 'datasets'} breadcrumbs={crumbs} pageTitle={title}>
      {!d ? <Loading /> : (
        <div className="row g-4">
          <div className="col-xl-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <KindBadge kind={kind} />
              <AccessBadge level={level} always />
              <span className="small text-secondary">{ACCESS_HELP[level]}</span>
            </div>
            {pick(d.description) && <p className="record-description">{pick(d.description)}</p>}

            {x?.service && <ServicePanel s={x.service} />}

            {x && x.modelDetails.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">{kind === 'model' ? 'Model' : 'Further details'}</div>
                <div className="card-body">
                  <dl className="mb-0">
                    {x.modelDetails.map(p => (
                      <Row key={p.label} label={p.label}>
                        {p.link ? <ExternalLink url={p.value} /> : <span className="text-break pre-wrap">{p.value}</span>}
                      </Row>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            <h2 className="section-title mt-2 mb-3">
              Distributions <span className="text-secondary small">({d.distributions?.length ?? 0})</span>
            </h2>
            {(d.distributions ?? []).length === 0
              ? <p className="text-secondary">No distributions are listed for this {KIND_LABEL[kind]}.</p>
              : d.distributions!.map(dist => (
                <DistributionCard key={dist.id} dist={dist} extras={x?.distributions[dist.id]}
                  catalogueId={catalogueId} datasetId={d.id} />
              ))}
          </div>

          <div className="col-xl-4">
            <div className="card mb-4">
              <div className="card-header">About</div>
              <div className="card-body">
                <dl className="mb-0 small">
                  <Row label="Catalogue">{catalogueId && <a href={href(['catalogues', catalogueId])}>{pick(d.catalog?.title) || catalogueId}</a>}</Row>
                  <Row label="Publisher">{x?.publisher ?? d.publisher?.name}</Row>
                  <Row label="Creator">{x?.creator ?? d.creator?.name}</Row>
                  <Row label="Contact">
                    {(x?.contactName || contact?.name || x?.contactEmail || contact?.email) && (
                      <>
                        {x?.contactName ?? contact?.name}
                        {(x?.contactEmail || contact?.email) && (
                          <> <a href={`mailto:${stripMailto(x?.contactEmail ?? contact?.email)}`}>{stripMailto(x?.contactEmail ?? contact?.email)}</a></>
                        )}
                      </>
                    )}
                  </Row>
                  <Row label="Licence">{license && <ExternalLink url={license}>{licenceLabel(license)}</ExternalLink>}</Row>
                  <Row label="Issued">{formatDate(d.issued)}</Row>
                  <Row label="Updated">{formatDate(d.modified ?? d.catalog_record?.modified)}</Row>
                  <Row label="Themes">{themes.join(', ')}</Row>
                  <Row label="Keywords">
                    {keywords.length > 0 && (
                      <span className="d-flex flex-wrap gap-1">
                        {keywords.map(k => (
                          <a key={k.id} className="badge keyword-badge text-decoration-none" href={href(['datasets'], { keywords: k.id })}>{k.label}</a>
                        ))}
                      </span>
                    )}
                  </Row>
                  <Row label="Landing page">{(x?.landingPage ?? d.landing_page?.[0]?.resource) && <ExternalLink url={(x?.landingPage ?? d.landing_page?.[0]?.resource)!} />}</Row>
                  <Row label="Identifier"><CopyableId value={d.id} maxWidth={220} /></Row>
                </dl>
              </div>
            </div>

            {x && hasProfile(x) && (
              <div className="card mb-4">
                <div className="card-header">6G-DALI profile</div>
                <div className="card-body">
                  <dl className="mb-0 small">
                    <Row label="SNS project">{x.snsProjectName}</Row>
                    <Row label="Produced by">{x.producedBy && <ExternalLink url={x.producedBy} />}</Row>
                    <Row label="Attributed to">{x.attributedTo && x.attributedTo !== x.producedBy && <ExternalLink url={x.attributedTo} />}</Row>
                    <Row label="Contains personal data">{x.containsPII !== null && <YesNo value={x.containsPII} />}</Row>
                    <Row label="GDPR compliant">{x.gdprCompliant !== null && <YesNo value={x.gdprCompliant} />}</Row>
                    <Row label="FAIR compliant">{x.fairCompliant !== null && <YesNo value={x.fairCompliant} />}</Row>
                    <Row label="Conforms to">
                      {x.conformsTo.length > 0 && x.conformsTo.map(c => <div key={c}><ExternalLink url={c} /></div>)}
                    </Row>
                    {x.testbedContext.map(p => <Row key={p.label} label={p.label}>{p.value}</Row>)}
                    <Row label="Variables">
                      {x.variables.length > 0 && (
                        <span className="d-flex flex-wrap gap-1">{x.variables.map(v => <code key={v} className="variable-chip">{v}</code>)}</span>
                      )}
                    </Row>
                  </dl>
                </div>
              </div>
            )}

            <div className="card mb-4">
              <div className="card-header d-flex align-items-center gap-2"><FiCode aria-hidden="true" />Linked data</div>
              <div className="card-body small">
                <p className="text-secondary mb-2">The record's metadata (DCAT-AP, 6G-DALI profile):</p>
                <div className="d-flex flex-wrap gap-2">
                  {(['ttl', 'jsonld', 'rdf', 'nt'] as const).map(ext => (
                    <a key={ext} className="btn btn-sm btn-outline-secondary" href={linkedDataUrl(d.id, ext)} target="_blank" rel="noopener noreferrer">
                      {{ ttl: 'Turtle', jsonld: 'JSON-LD', rdf: 'RDF/XML', nt: 'N-Triples' }[ext]}
                    </a>
                  ))}
                </div>
                {level !== 'public' && (
                  <p className="text-secondary mt-2 mb-0">These links open without your sign-in, so they work only for public records.</p>
                )}
              </div>
            </div>

            {session.authenticated && config.dataopsUrl && kind === 'dataset' && (
              <a className="btn btn-outline-primary w-100 mb-4" href={config.dataopsUrl} target="_blank" rel="noopener noreferrer">
                <FiEdit3 className="me-1" aria-hidden="true" />Manage datasets in DataOps
              </a>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
