import { bool, byId, follow, graphOf, isA, NS, refs, value, values, type Node } from './jsonld'
import { localName } from './text'

/**
 * What the catalogue shows from a record's RDF (hub-repo), beyond the summary
 * hub-search already gives: the 6G-DALI application-profile terms (testbed
 * context, GAIA-X, GDPR/FAIR), the per-distribution connector details and
 * data-quality results, and the service or model description.
 */

export interface QualityResult {
  /** The expectation, e.g. `expect_column_values_to_not_be_null`. */
  check: string
  label: string
  column: string | null
  passed: boolean | null
  details: string
  date: string | null
}

export interface DistributionExtras {
  connectorType: string | null
  assetId: string | null
  variables: string[]
  measurementTechnique: string | null
  quality: QualityResult[]
  /** The overall `expect_all_quality_checks_to_pass` result, when the pipeline recorded one. */
  qualityOverall: QualityResult | null
}

export interface ServiceInfo {
  serviceType: string | null
  framework: string | null
  inputFormat: string | null
  outputFormat: string | null
  taskModule: string | null
  taskFunction: string | null
  endpointUrl: string | null
  endpointDescription: string | null
}

export interface Property {
  label: string
  value: string
  /** The value is an IRI worth linking to. */
  link: boolean
}

export interface RecordExtras {
  accessRights: string | null
  license: string | null
  publisher: string | null
  creator: string | null
  contactName: string | null
  contactEmail: string | null
  producedBy: string | null
  attributedTo: string | null
  containsPII: boolean | null
  gdprCompliant: boolean | null
  fairCompliant: boolean | null
  snsProjectName: string | null
  conformsTo: string[]
  landingPage: string | null
  variables: string[]
  testbedContext: Property[]
  /** MLDCAT-AP and other model terms on an ML model record. */
  modelDetails: Property[]
  service: ServiceInfo | null
  /** Keyed by the distribution's id (the last segment of its IRI), as hub-search reports it. */
  distributions: Record<string, DistributionExtras>
}

const MLDCAT = 'http://www.w3.org/ns/mldcat#'

/** Human names for the quality expectations the DataOps pipeline runs (Great Expectations). */
const CHECK_LABEL: Record<string, string> = {
  expect_all_quality_checks_to_pass: 'All checks',
  expect_table_row_count_to_be_between: 'Row count',
  expect_table_column_count_to_be_between: 'Column count',
  expect_table_columns_to_match_ordered_list: 'Column order',
  expect_column_to_exist: 'Column exists',
  expect_column_values_to_not_be_null: 'No null values',
  expect_column_values_to_be_null: 'All values null',
  expect_column_values_to_be_of_type: 'Column type',
  expect_column_values_to_be_in_set: 'Values in set',
  expect_column_values_to_not_be_in_set: 'Values not in set',
  expect_column_values_to_be_between: 'Values in range',
  expect_column_values_to_be_unique: 'Unique values',
  expect_column_values_to_be_dateutil_parseable: 'Valid dates',
}

export function checkLabel(check: string): string {
  return CHECK_LABEL[check] ?? check.replace(/^expect_/, '').replace(/_/g, ' ')
}

/** `trainingSplit` → `Training split`. */
export function humanise(term: string): string {
  const words = term.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase()
  const out = words.charAt(0).toUpperCase() + words.slice(1)
  return out.replace(/\b(ml|ai|url|id|pii|gdpr|fair|sns)\b/gi, w => w.toUpperCase())
}

function qualityDetails(check: string, description: string | null): { column: string | null; details: string } {
  if (!description) return { column: null, details: '' }
  let r: Record<string, unknown>
  try {
    r = JSON.parse(description) as Record<string, unknown>
  } catch {
    return { column: null, details: description }
  }
  const column = typeof r.column === 'string' ? r.column : null
  const n = (v: unknown) => Number(v).toLocaleString()
  if (check === 'expect_table_row_count_to_be_between' && r.observed_value !== undefined) {
    const range = [r.min_value !== undefined ? `min ${n(r.min_value)}` : '', r.max_value !== undefined ? `max ${n(r.max_value)}` : '']
      .filter(Boolean).join(', ')
    return { column, details: `${n(r.observed_value)} rows${range ? ` (${range})` : ''}` }
  }
  if (r.unexpected_count !== undefined && r.element_count !== undefined) {
    const pct = r.unexpected_percent !== undefined ? ` (${Number(r.unexpected_percent).toFixed(1)}%)` : ''
    return { column, details: `${n(r.unexpected_count)} of ${n(r.element_count)} values failed${pct}` }
  }
  if (r.observed_value !== undefined) return { column, details: `Observed: ${String(r.observed_value)}` }
  return { column, details: '' }
}

function quality(graph: Map<string, Node>, dist: Node): { results: QualityResult[]; overall: QualityResult | null } {
  const results: QualityResult[] = []
  let overall: QualityResult | null = null
  for (const id of refs(dist, NS.dqv + 'hasQualityMeasurement')) {
    const m = graph.get(id)
    if (!m) continue
    const of = refs(m, NS.dqv + 'isMeasurementOf')[0] ?? value(m, NS.dqv + 'isMeasurementOf') ?? ''
    const check = localName(of)
    const { column, details } = qualityDetails(check, value(m, NS.dct + 'description'))
    const r: QualityResult = {
      check,
      label: checkLabel(check),
      column,
      passed: bool(m, NS.dqv + 'value'),
      details,
      date: value(m, NS.dct + 'date'),
    }
    if (check === 'expect_all_quality_checks_to_pass') overall = r
    else results.push(r)
  }
  results.sort((a, b) => a.label.localeCompare(b.label) || (a.column ?? '').localeCompare(b.column ?? ''))
  return { results, overall }
}

function nameOf(node: Node | undefined): string | null {
  if (!node) return null
  return value(node, NS.foaf + 'name') ?? value(node, NS.vcard + 'fn') ?? null
}

function emailOf(node: Node | undefined): string | null {
  const v = value(node, NS.vcard + 'hasEmail') ?? value(node, NS.foaf + 'mbox')
  return v ? v.replace(/^mailto:/i, '') : null
}

/** Literal properties of a node, as label/value pairs; nested nodes are skipped. */
function literalProperties(node: Node, keep: (prop: string) => boolean): Property[] {
  const out: Property[] = []
  for (const prop of Object.keys(node)) {
    if (prop.startsWith('@') || !keep(prop)) continue
    const all = values(node, prop).filter(v => !v.startsWith('_:'))
    if (!all.length) continue
    out.push({ label: humanise(localName(prop)), value: all.join(', '), link: all.length === 1 && /^https?:\/\//.test(all[0]) })
  }
  return out.sort((a, b) => a.label.localeCompare(b.label))
}

/** DALI terms the page already shows in their own place. */
const SHOWN_DALI = new Set(['testbedContext', 'gdprCompliant', 'fairCompliant', 'snsProjectName', 'connectorType', 'assetId'])

/** Reads a hub-repo JSON-LD response for the record with this id. */
export function parseRecord(doc: unknown, recordId: string): RecordExtras | null {
  const list = graphOf(doc)
  const graph = byId(list)
  const main =
    list.find(n => (n['@id'] ?? '').endsWith(`/${recordId}`) && (isA(n, NS.dcat + 'Dataset') || isA(n, NS.dcat + 'DataService')))
    ?? list.find(n => isA(n, NS.dcat + 'Dataset'))
    ?? list.find(n => isA(n, NS.dcat + 'DataService'))
  if (!main) return null

  const distributions: Record<string, DistributionExtras> = {}
  const datasetVariables = new Set(values(main, NS.schema + 'variableMeasured'))
  for (const id of refs(main, NS.dcat + 'distribution')) {
    const d = graph.get(id)
    if (!d) continue
    const { results, overall } = quality(graph, d)
    const vars = values(d, NS.schema + 'variableMeasured')
    distributions[localName(id)] = {
      connectorType: value(d, NS.dali + 'connectorType'),
      assetId: value(d, NS.dali + 'assetId'),
      variables: vars,
      measurementTechnique: value(d, NS.schema + 'measurementTechnique'),
      quality: results,
      qualityOverall: overall,
    }
  }

  const serviceNode = isA(main, NS.dcat + 'DataService') ? main : list.find(n => isA(n, NS.dcat + 'DataService'))
  const service: ServiceInfo | null = serviceNode
    ? {
        serviceType: value(serviceNode, NS.dali + 'serviceType'),
        framework: value(serviceNode, NS.dali + 'framework'),
        inputFormat: value(serviceNode, NS.dali + 'inputFormat'),
        outputFormat: value(serviceNode, NS.dali + 'outputFormat'),
        taskModule: value(serviceNode, NS.dali + 'taskModule'),
        taskFunction: value(serviceNode, NS.dali + 'taskFunction'),
        endpointUrl: value(serviceNode, NS.dcat + 'endpointURL'),
        endpointDescription: value(serviceNode, NS.dcat + 'endpointDescription'),
      }
    : null

  const context = follow(graph, main, NS.dali + 'testbedContext')
  const contact = follow(graph, main, NS.dcat + 'contactPoint')

  return {
    accessRights: value(main, NS.dct + 'accessRights'),
    license: value(main, NS.dct + 'license'),
    publisher: nameOf(follow(graph, main, NS.dct + 'publisher')),
    creator: nameOf(follow(graph, main, NS.dct + 'creator')),
    contactName: nameOf(contact),
    contactEmail: emailOf(contact),
    producedBy: value(main, NS.gx + 'producedBy'),
    attributedTo: value(main, NS.prov + 'wasAttributedTo'),
    containsPII: bool(main, NS.gx + 'containsPII'),
    gdprCompliant: bool(main, NS.dali + 'gdprCompliant'),
    fairCompliant: bool(main, NS.dali + 'fairCompliant'),
    snsProjectName: value(main, NS.dali + 'snsProjectName'),
    conformsTo: values(main, NS.dct + 'conformsTo'),
    landingPage: value(main, NS.dcat + 'landingPage'),
    variables: [...datasetVariables],
    testbedContext: context ? literalProperties(context, p => p.startsWith(NS.dali)) : [],
    modelDetails: literalProperties(main, p =>
      p.startsWith(MLDCAT) || (p.startsWith(NS.dali) && !SHOWN_DALI.has(localName(p)))),
    service,
    distributions,
  }
}

/** foaf:logo, dct:spatial and dct:accessRights of a catalogue, from hub-repo. */
export interface CatalogueExtras {
  logo: string | null
  /** Country IRI's alpha-3 code, e.g. FRA. */
  country: string | null
  accessRights: string | null
  publisher: string | null
  homepage: string | null
}

export function parseCatalogue(doc: unknown): CatalogueExtras | null {
  const list = graphOf(doc)
  const node = list.find(n => isA(n, NS.dcat + 'Catalog'))
  if (!node) return null
  const spatial = values(node, NS.dct + 'spatial')[0] ?? null
  return {
    logo: value(node, NS.foaf + 'logo'),
    country: spatial ? localName(spatial).toUpperCase() : null,
    accessRights: value(node, NS.dct + 'accessRights'),
    publisher: nameOf(follow(byId(list), node, NS.dct + 'publisher')),
    homepage: value(node, NS.foaf + 'homepage'),
  }
}
