import { useState } from 'react'
import { FiCheckCircle, FiDownload, FiExternalLink, FiServer, FiXCircle } from 'react-icons/fi'
import type { SearchDistribution } from '../api/piveau'
import type { DistributionExtras, QualityResult, ServiceInfo } from '../lib/record'
import { formatBytes, formatDate, licenceLabel, pick } from '../lib/text'
import { CopyableId, ExternalLink, Row } from './ui'

/** dali:connectorType values as people know them. */
const CONNECTORS: Record<string, string> = {
  dspaceconnector: 'Dataspace connector (EDC)',
  edc: 'Dataspace connector (EDC)',
  s3: 'S3',
  http: 'HTTP',
}

function connectorLabel(type: string): string {
  return CONNECTORS[type.toLowerCase()] ?? type
}

/** One distribution: its file or endpoint, the connector asset behind it, and its quality results. */
export function DistributionCard({ dist, extras }: { dist: SearchDistribution; extras?: DistributionExtras }) {
  const format = pick(dist.format?.label) || dist.format?.id || ''
  const download = dist.download_url?.[0]
  const access = dist.access_url?.[0]
  const description = pick(dist.description)
  return (
    <div className="card distribution-card mb-3">
      <div className="card-header d-flex flex-wrap align-items-center gap-2">
        {format && <span className="badge format-badge">{format}</span>}
        <span className="fw-medium text-break">{pick(dist.title) || dist.id}</span>
        <span className="ms-auto d-flex gap-2">
          {download && (
            <a className="btn btn-sm btn-outline-primary" href={download} target="_blank" rel="noopener noreferrer">
              <FiDownload className="me-1" aria-hidden="true" />Download
            </a>
          )}
          {access && access !== download && (
            <a className="btn btn-sm btn-outline-secondary" href={access} target="_blank" rel="noopener noreferrer">
              <FiExternalLink className="me-1" aria-hidden="true" />Access
            </a>
          )}
        </span>
      </div>
      <div className="card-body">
        {description && <p className="text-secondary small">{description}</p>}
        <dl className="mb-0 small">
          <Row label="Media type">{dist.media_type}</Row>
          <Row label="Size">{formatBytes(dist.byte_size)}</Row>
          <Row label="Licence">{dist.license?.resource && <ExternalLink url={dist.license.resource}>{licenceLabel(dist.license.resource)}</ExternalLink>}</Row>
          <Row label="Issued">{formatDate(dist.issued)}</Row>
          <Row label="Connector">{extras?.connectorType && connectorLabel(extras.connectorType)}</Row>
          <Row label="Connector asset">{extras?.assetId && <CopyableId value={extras.assetId} />}</Row>
          <Row label="Measurement technique">{extras?.measurementTechnique}</Row>
          <Row label="Variables">
            {extras?.variables.length ? (
              <span className="d-flex flex-wrap gap-1">
                {extras.variables.map(v => <code key={v} className="variable-chip">{v}</code>)}
              </span>
            ) : null}
          </Row>
        </dl>
        {extras && (extras.quality.length > 0 || extras.qualityOverall) && (
          <QualityPanel results={extras.quality} overall={extras.qualityOverall} />
        )}
      </div>
    </div>
  )
}

/**
 * The data-quality results the DataOps pipeline recorded on the distribution
 * (dqv:QualityMeasurement, one per expectation and column), grouped by check.
 */
function QualityPanel({ results, overall }: { results: QualityResult[]; overall: QualityResult | null }) {
  const [open, setOpen] = useState(false)
  const failed = results.filter(r => r.passed === false).length
  const passed = results.filter(r => r.passed === true).length
  const date = overall?.date ?? results.find(r => r.date)?.date ?? null
  const allPass = overall ? overall.passed === true : failed === 0
  const groups = new Map<string, QualityResult[]>()
  for (const r of results) groups.set(r.label, [...(groups.get(r.label) ?? []), r])

  return (
    <div className="quality-panel mt-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className={`badge ${allPass ? 'text-bg-success' : 'text-bg-danger'} d-inline-flex align-items-center gap-1`}>
          {allPass ? <FiCheckCircle aria-hidden="true" /> : <FiXCircle aria-hidden="true" />}
          Data quality: {allPass ? 'all checks passed' : `${failed} check${failed === 1 ? '' : 's'} failed`}
        </span>
        <span className="small text-secondary">
          {passed} of {results.length} passed{date ? ` · checked ${formatDate(date)}` : ''}
        </span>
        {results.length > 0 && (
          <button type="button" className="btn btn-sm btn-link ms-auto" onClick={() => setOpen(o => !o)} aria-expanded={open}>
            {open ? 'Hide details' : 'Show details'}
          </button>
        )}
      </div>
      {open && (
        <div className="table-responsive mt-2">
          <table className="table table-sm align-middle mb-0 quality-table">
            <thead><tr><th>Check</th><th>Column</th><th>Result</th><th>Details</th></tr></thead>
            <tbody>
              {[...groups.entries()].flatMap(([label, rows]) => rows.map((r, i) => (
                <tr key={`${r.check}-${r.column ?? i}`}>
                  <td>{i === 0 ? label : ''}</td>
                  <td>{r.column ? <code>{r.column}</code> : '—'}</td>
                  <td>
                    {r.passed === null ? '—' : r.passed
                      ? <span className="text-success d-inline-flex align-items-center gap-1"><FiCheckCircle aria-hidden="true" />Pass</span>
                      : <span className="text-danger d-inline-flex align-items-center gap-1"><FiXCircle aria-hidden="true" />Fail</span>}
                  </td>
                  <td className="small text-secondary">{r.details || '—'}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** A data processing service (dcat:DataService) the DataOps pipelines can run. */
export function ServicePanel({ s }: { s: ServiceInfo }) {
  return (
    <div className="card service-panel mb-4">
      <div className="card-header d-flex align-items-center gap-2">
        <FiServer aria-hidden="true" />Data processing service
        {s.serviceType && <span className="badge kind-badge kind-service ms-auto">{s.serviceType}</span>}
      </div>
      <div className="card-body">
        <dl className="mb-0">
          <Row label="Framework">{s.framework}</Row>
          <Row label="Input format">{s.inputFormat}</Row>
          <Row label="Output format">{s.outputFormat}</Row>
          <Row label="Task">{s.taskModule && <code>{s.taskModule}{s.taskFunction ? `.${s.taskFunction}` : ''}</code>}</Row>
          <Row label="Endpoint">{s.endpointUrl && <ExternalLink url={s.endpointUrl} />}</Row>
          <Row label="Endpoint description">{s.endpointDescription && <ExternalLink url={s.endpointDescription} />}</Row>
        </dl>
      </div>
    </div>
  )
}
