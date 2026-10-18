import { useState, type ReactNode } from 'react'
import { FiAlertTriangle, FiCheck, FiCopy, FiInbox, FiLock, FiUsers } from 'react-icons/fi'
import { ACCESS_HELP, ACCESS_LABEL, type AccessLevel } from '../lib/access'
import { KIND_LABEL, type RecordKind } from '../lib/catalogues'

/**
 * Small primitives, styled by @6g-dali/ui-theme's classes so they match
 * dataops-ui: state panels (§20), metric cards (§14.3), copyable ids (§14.4).
 */

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="d-flex align-items-center gap-2 text-muted small py-3" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      {label}
    </div>
  )
}

export function ErrorPanel({ title = 'Something went wrong', message }: { title?: string; message: string }) {
  return (
    <div className="card state-panel" role="alert">
      <div className="card-body">
        <div className="state-panel-icon text-danger" aria-hidden="true"><FiAlertTriangle /></div>
        <p className="state-panel-title">{title}</p>
        <p className="state-panel-text">{message}</p>
      </div>
    </div>
  )
}

export function EmptyPanel({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card state-panel">
      <div className="card-body">
        <div className="state-panel-icon text-secondary" aria-hidden="true"><FiInbox /></div>
        <p className="state-panel-title">{title}</p>
        {children && <div className="state-panel-text">{children}</div>}
      </div>
    </div>
  )
}

/** Shown only for records that are not public, so the common case stays quiet. */
export function AccessBadge({ level, always = false }: { level: AccessLevel; always?: boolean }) {
  if (level === 'public' && !always) return null
  const Icon = level === 'internal' ? FiLock : FiUsers
  const tone = level === 'public' ? 'text-bg-success' : level === 'restricted' ? 'text-bg-info' : 'text-bg-warning'
  return (
    <span className={`badge ${tone} d-inline-flex align-items-center gap-1`} title={ACCESS_HELP[level]}>
      {level !== 'public' && <Icon aria-hidden="true" />}
      {ACCESS_LABEL[level]}
    </span>
  )
}

export function KindBadge({ kind }: { kind: RecordKind }) {
  return <span className={`badge kind-badge kind-${kind}`}>{KIND_LABEL[kind]}</span>
}

export function MetricCard({ label, value, icon, onSelect }: {
  label: string
  value: number | null | undefined
  icon?: ReactNode
  onSelect?: () => void
}) {
  const unavailable = value === null || value === undefined
  const body = (
    <div className="card-body">
      <div className="metric-label">
        {icon && <span className="metric-icon" aria-hidden="true">{icon}</span>}
        {label}
      </div>
      <div className={`metric-value${unavailable ? ' metric-tone-unavailable' : ''}`}>
        {unavailable ? <span className="skeleton skeleton-metric d-inline-block" aria-label="Loading" /> : value.toLocaleString()}
      </div>
    </div>
  )
  return (
    <div className="col-6 col-lg-3">
      {onSelect ? (
        <button type="button" className="card metric-card metric-card-interactive h-100 w-100 text-start"
          onClick={onSelect} aria-label={`${label}: view`}>
          {body}
        </button>
      ) : (
        <div className="card metric-card h-100">{body}</div>
      )}
    </div>
  )
}

export function CopyableId({ value, maxWidth = 320 }: { value: string; maxWidth?: number }) {
  const [copied, setCopied] = useState(false)
  async function copy(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable: the value stays selectable */ }
  }
  return (
    <span className="copyable-id">
      <code className="copyable-id-value" style={{ maxWidth }} title={value}>{value}</code>
      <button type="button" className="copyable-id-btn" onClick={copy} aria-label={copied ? 'Copied' : `Copy ${value}`}>
        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      </button>
      <span className="visually-hidden" role="status">{copied ? 'Copied to clipboard' : ''}</span>
    </span>
  )
}

export function Pagination({ page, pageSize, total, pageSizes, unit, onPage, onPageSize }: {
  page: number
  pageSize: number
  total: number
  pageSizes: number[]
  unit: string
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
      <div className="text-muted small">{from}–{to} of {total.toLocaleString()} {unit}</div>
      <div className="d-flex align-items-center gap-2">
        <select className="form-select form-select-sm w-auto" value={pageSize} aria-label="Results per page"
          onChange={e => onPageSize(Number(e.target.value))}>
          {pageSizes.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
        <nav aria-label="Pagination">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item${page <= 1 ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => onPage(page - 1)} disabled={page <= 1}>Prev</button>
            </li>
            <li className="page-item disabled"><span className="page-link">{page} / {pages}</span></li>
            <li className={`page-item${page >= pages ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => onPage(page + 1)} disabled={page >= pages}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

/** A definition list row that renders nothing when there is no value. */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  if (children === null || children === undefined || children === false || children === ''
    || (Array.isArray(children) && children.length === 0)) return null
  return (
    <div className="row py-2 border-bottom property-row">
      <dt className="col-sm-4 col-lg-3 text-secondary fw-normal">{label}</dt>
      <dd className="col-sm-8 col-lg-9 mb-0 text-break">{children}</dd>
    </div>
  )
}

export function ExternalLink({ url, children }: { url: string; children?: ReactNode }) {
  if (!/^https?:\/\//i.test(url)) return <span className="text-break">{children ?? url}</span>
  return <a href={url} target="_blank" rel="noopener noreferrer" className="text-break">{children ?? url}</a>
}

export function YesNo({ value }: { value: boolean | null }) {
  if (value === null) return null
  return value
    ? <span className="badge text-bg-success">Yes</span>
    : <span className="badge text-bg-secondary">No</span>
}
