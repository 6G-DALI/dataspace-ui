import { useState } from 'react'
import { FiLayers } from 'react-icons/fi'
import type { SearchCatalogue } from '../api/piveau'
import { useCatalogueExtras } from '../hooks'
import { levelOf, stricter } from '../lib/access'
import { ALPHA3_TO_2, flagEmoji, isStaging, kindOfCatalogue, LOGO_OVERRIDES } from '../lib/catalogues'
import { pick } from '../lib/text'
import { href } from '../router'
import { AccessBadge, KindBadge } from './ui'

/**
 * A catalogue's logo. Resolution order, as in the previous catalogue UI:
 * a static override, the catalogue's foaf:logo, a flag from dct:spatial, and
 * finally a neutral icon. A logo that fails to load falls through to the next.
 */
export function CatalogueLogo({ id, size = 48, width }: { id: string; size?: number; width?: number | string }) {
  const extras = useCatalogueExtras(id)
  const [broken, setBroken] = useState(false)
  const src = LOGO_OVERRIDES[id] ?? extras?.logo ?? null
  const alpha2 = extras?.country ? ALPHA3_TO_2[extras.country] : undefined
  const box = { width: width ?? size, height: size }
  if (src && !broken) {
    return (
      <span className="catalogue-logo" style={box}>
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
      </span>
    )
  }
  return (
    <span className="catalogue-logo catalogue-logo-fallback" style={box} aria-hidden="true">
      {alpha2 ? <span style={{ fontSize: size * 0.55 }}>{flagEmoji(alpha2)}</span> : <FiLayers />}
    </span>
  )
}

/** The effective visibility of a catalogue: its dct:accessRights, read from hub-repo. */
export function useCatalogueLevel(id: string | null | undefined) {
  const extras = useCatalogueExtras(id)
  return stricter(levelOf(extras?.accessRights))
}

export function CatalogueCard({ c }: { c: SearchCatalogue }) {
  const level = stricter(useCatalogueLevel(c.id), levelOf(c.access_right?.resource ?? pick(c.access_right?.label)))
  const kind = kindOfCatalogue(c.id)
  const title = pick(c.title) || c.id
  return (
    <div className="col-sm-6 col-lg-4 col-xxl-3 mb-4">
      <a className="card catalogue-card h-100 text-decoration-none" href={href(['catalogues', c.id])}>
        <div className="catalogue-card-logo">
          <CatalogueLogo id={c.id} size={112} width="100%" />
        </div>
        <div className="card-body">
          <h2 className="catalogue-card-title">{title}</h2>
          <p className="catalogue-card-text clamp-3">{pick(c.description) || 'No description.'}</p>
        </div>
        <div className="card-footer d-flex flex-wrap gap-2 align-items-center">
          <span className="badge text-bg-secondary">
            {(c.count ?? 0).toLocaleString()} record{c.count === 1 ? '' : 's'}
          </span>
          {kind !== 'dataset' && <KindBadge kind={kind} />}
          {isStaging(c.id) && <span className="badge text-bg-light border" title="Datasets waiting for review">Staging</span>}
          <AccessBadge level={level} />
          <code className="ms-auto small text-muted">{c.id}</code>
        </div>
      </a>
    </div>
  )
}
