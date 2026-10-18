import { describe, expect, it } from 'vitest'
import { graphOf, NS, value } from './jsonld'
import { checkLabel, humanise, parseCatalogue, parseRecord } from './record'
import datasetEur from './fixtures/dataset-eur.jsonld.json'
import datasetNitos from './fixtures/dataset-nitos.jsonld.json'
import model from './fixtures/model.jsonld.json'
import catalogueNitos from './fixtures/catalogue-nitos.jsonld.json'
import catalogueEur from './fixtures/catalogue-eur.jsonld.json'

// Fixtures are hub-repo 3.3.11 responses from the live Data Space (2026-10-18).

describe('graphOf', () => {
  it('expands prefixed keys and types with the response context', () => {
    const g = graphOf(datasetEur)
    const ds = g.find(n => n['@type']?.includes(NS.dcat + 'Dataset'))!
    expect(ds[NS.dct + 'title']).toBeDefined()
    expect(value(ds, NS.dct + 'title')).toBe('Energy Saving Small Area Two Layers Sectorized AppOFF')
  })

  it('reads a single-node response that has no @graph', () => {
    const g = graphOf(datasetNitos)
    expect(g).toHaveLength(1)
    expect(value(g[0], NS.dct + 'title')).toBe('NITOS 6G-DALI Test Dataset')
  })
})

describe('parseRecord', () => {
  it('reads the profile terms and the distribution details of a testbed dataset', () => {
    const r = parseRecord(datasetEur, '8bd8e31f-be5d-40f2-bfe9-80c8449e8c4c')!
    expect(r.accessRights).toBe('http://publications.europa.eu/resource/authority/access-right/PUBLIC')
    expect(r.license).toBe('https://creativecommons.org/licenses/by/4.0/')
    expect(r.publisher).toBe('EURECOM')
    expect(r.creator).toBe('EURECOM 5G Testbed Facility')
    expect(r.producedBy).toBe('https://dali-project.eu/participant/eurecom')
    expect(r.containsPII).toBe(false)
    expect(r.fairCompliant).toBe(true)
    expect(r.testbedContext).toEqual([{ label: 'Network domain', value: 'RAN', link: false }])

    const dist = r.distributions['732da0cc-b0fd-45f2-97e9-dedd438df981']
    expect(dist.connectorType).toBe('dspaceconnector')
    expect(dist.assetId).toBeTruthy()
    expect(dist.variables).toContain('timestamp')
    // 22 measurements: one overall result and 21 individual checks.
    expect(dist.qualityOverall?.check).toBe('expect_all_quality_checks_to_pass')
    expect(dist.quality).toHaveLength(21)
    const notNull = dist.quality.find(q => q.check === 'expect_column_values_to_not_be_null' && q.column === 'value')
    expect(notNull?.label).toBe('No null values')
    expect(typeof notNull?.passed).toBe('boolean')
  })

  it('lists MLDCAT-AP terms of a model record as model details', () => {
    const r = parseRecord(model, 'm1m2m3m4-0000-0000-0000-000000000001')!
    const labels = r.modelDetails.map(p => p.label)
    expect(labels).toContain('Hyperparameters')
    expect(labels).toContain('Trained on')
    expect(labels).toContain('Training split')
    expect(r.modelDetails.find(p => p.label === 'Trained on')?.link).toBe(true)
    expect(r.contactEmail).toBe('wavecore@kuleuven.be')
    expect(r.license).toBe('https://opensource.org/licenses/MIT')
  })

  it('returns null when the response holds no dataset', () => {
    expect(parseRecord({ '@graph': [] }, 'x')).toBeNull()
    expect(parseRecord(null, 'x')).toBeNull()
  })
})

describe('parseCatalogue', () => {
  it('reads foaf:logo', () => {
    expect(parseCatalogue(catalogueNitos)?.logo).toMatch(/^https:\/\//)
  })

  it('reads the publisher and the country', () => {
    const c = parseCatalogue(catalogueEur)!
    expect(c.publisher).toBe('6G-DALI')
  })

  it('reads dct:accessRights of a private catalogue', () => {
    const doc = {
      '@context': { dct: 'http://purl.org/dc/terms/', dcat: 'http://www.w3.org/ns/dcat#' },
      '@graph': [{
        '@id': 'https://dataspace.6gdali.eu/catalogues/x',
        '@type': 'dcat:Catalog',
        'dct:accessRights': { '@id': 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC' },
      }],
    }
    expect(parseCatalogue(doc)?.accessRights).toMatch(/NON_PUBLIC$/)
  })
})

describe('labels', () => {
  it('names known checks and humanises the rest', () => {
    expect(checkLabel('expect_column_to_exist')).toBe('Column exists')
    expect(checkLabel('expect_something_new')).toBe('something new')
    expect(humanise('trainingSplit')).toBe('Training split')
    expect(humanise('outputFeatures')).toBe('Output features')
    expect(humanise('mlFramework')).toBe('ML framework')
  })
})
