import { config } from '../config'

/** What a catalogue holds, and so how its records are labelled. */
export type RecordKind = 'dataset' | 'model' | 'service'

export function kindOfCatalogue(catalogueId: string | null | undefined): RecordKind {
  if (catalogueId && catalogueId === config.modelsCatalogue) return 'model'
  if (catalogueId && catalogueId === config.servicesCatalogue) return 'service'
  return 'dataset'
}

export const KIND_LABEL: Record<RecordKind, string> = {
  dataset: 'Dataset',
  model: 'ML model',
  service: 'Data service',
}

export function isStaging(catalogueId: string): boolean {
  return /(^|-)staging(-|$)/.test(catalogueId)
}

/** The catalogue of datasets that come from outside the project. */
export const EXTERNAL_CATALOGUE = '6g-external'

interface Sortable {
  id: string
  title: string
}

/**
 * Display order, kept from the previous catalogue UI: published catalogues
 * first, then the staging ones, then the external catalogue; by title within
 * each group.
 */
export function sortCatalogues<T extends Sortable>(list: T[]): T[] {
  const group = (c: T) => (c.id === EXTERNAL_CATALOGUE ? 2 : isStaging(c.id) ? 1 : 0)
  return [...list].sort((a, b) => group(a) - group(b) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id))
}

/** Static logos that win over the catalogue's own foaf:logo. */
export const LOGO_OVERRIDES: Record<string, string> = {
  '6g-dali-staging-eur': '/logos/eur.svg',
}

/** ISO 3166 alpha-3 (as in EU country IRIs) → alpha-2, for the flag fallback. */
export const ALPHA3_TO_2: Record<string, string> = {
  AUT: 'at', BEL: 'be', BGR: 'bg', HRV: 'hr', CYP: 'cy', CZE: 'cz', DNK: 'dk', EST: 'ee', FIN: 'fi', FRA: 'fr',
  DEU: 'de', GRC: 'gr', HUN: 'hu', IRL: 'ie', ITA: 'it', LVA: 'lv', LTU: 'lt', LUX: 'lu', MLT: 'mt', NLD: 'nl',
  POL: 'pl', PRT: 'pt', ROU: 'ro', SVK: 'sk', SVN: 'si', ESP: 'es', SWE: 'se', GBR: 'gb', NOR: 'no', ISL: 'is',
  CHE: 'ch', USA: 'us', CAN: 'ca', JPN: 'jp', AUS: 'au', BRA: 'br', IND: 'in', CHN: 'cn', KOR: 'kr', EUR: 'eu',
}

/** A two-letter code as a flag emoji (regional indicator pair). `eu` has one too. */
export function flagEmoji(alpha2: string): string {
  return [...alpha2.toUpperCase()].map(c => String.fromCodePoint(0x1f1a5 + c.charCodeAt(0))).join('')
}
