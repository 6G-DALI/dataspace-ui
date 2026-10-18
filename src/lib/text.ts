/** A piveau multilingual value: a plain string, or `{ en: '…', de: '…' }`. */
export type Localized = string | Record<string, string> | null | undefined

/** English if present, else the first language, else ''. */
export function pick(value: Localized): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.en ?? Object.values(value)[0] ?? ''
}

/** `mailto:a@b` → `a@b`. */
export function stripMailto(value: string | undefined | null): string {
  return (value ?? '').replace(/^mailto:/i, '')
}

/** A date or date-time as a short local date; the input unchanged if it is not one. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatBytes(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = n
  let u = 0
  while (v >= 1024 && u < units.length - 1) { v /= 1024; u++ }
  return `${v < 10 && u > 0 ? v.toFixed(1) : Math.round(v)} ${units[u]}`
}

/** Last path or fragment segment of an IRI: `…/file-type/CSV` → `CSV`, `…ns#assetId` → `assetId`. */
export function localName(iri: string): string {
  const m = /[#/]([^#/]+)\/?$/.exec(iri)
  return m ? m[1] : iri
}

/** Licence IRIs people recognise, shown by name rather than as a URL. */
const LICENCES: Record<string, string> = {
  'https://creativecommons.org/licenses/by/4.0/': 'CC BY 4.0',
  'https://creativecommons.org/licenses/by-sa/4.0/': 'CC BY-SA 4.0',
  'https://creativecommons.org/licenses/by-nc/4.0/': 'CC BY-NC 4.0',
  'https://creativecommons.org/licenses/by-nd/4.0/': 'CC BY-ND 4.0',
  'https://creativecommons.org/publicdomain/zero/1.0/': 'CC0 1.0',
  'http://publications.europa.eu/resource/authority/licence/CC_BY_4_0': 'CC BY 4.0',
  'http://publications.europa.eu/resource/authority/licence/CC0': 'CC0',
  'https://opensource.org/licenses/MIT': 'MIT',
  'https://www.apache.org/licenses/LICENSE-2.0': 'Apache 2.0',
}

export function licenceLabel(value: string): string {
  return LICENCES[value] ?? LICENCES[value.replace(/^http:/, 'https:')] ?? value
}
