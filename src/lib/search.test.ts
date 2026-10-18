import { describe, expect, it } from 'vitest'
import { levelOf, stricter } from './access'
import { isStaging, sortCatalogues } from './catalogues'
import { datasetSearchQuery, stateFromQuery, stateToQuery, toggleFacet } from './search'
import { parseHash, href } from '../router'

describe('search state', () => {
  it('reads facets as repeated keys and ignores unknown sorts and page sizes', () => {
    const s = stateFromQuery(new URLSearchParams('q=csi&page=3&limit=7&sort=bogus&format=CSV&format=JSON&catalog=a'))
    expect(s).toEqual({ q: 'csi', page: 3, limit: 10, sort: '', facets: { format: ['CSV', 'JSON'], catalog: ['a'] } })
  })

  it('round-trips through the hash, leaving defaults out', () => {
    const s = stateFromQuery(new URLSearchParams('format=CSV&page=2'))
    expect(stateToQuery(s)).toEqual({ q: undefined, page: '2', limit: undefined, sort: undefined, format: ['CSV'] })
    expect(href(['datasets'], stateToQuery(s))).toBe('#/datasets?page=2&format=CSV')
  })

  it('builds the hub-search query: 0-based page, JSON facets, fixed facets merged', () => {
    const s = stateFromQuery(new URLSearchParams('q=5g&page=2&format=CSV'))
    const q = new URLSearchParams(datasetSearchQuery(s, { catalog: ['6g-dali-nitos'] }))
    expect(q.get('filter')).toBe('dataset')
    expect(q.get('page')).toBe('1')
    expect(q.get('limit')).toBe('10')
    expect(q.get('sort')).toBe('relevance+desc')
    expect(JSON.parse(q.get('facets')!)).toEqual({ format: ['CSV'], catalog: ['6g-dali-nitos'] })
  })

  it('sorts by last update when there is no text query', () => {
    const q = new URLSearchParams(datasetSearchQuery(stateFromQuery(new URLSearchParams())))
    expect(q.get('sort')).toBe('modified+desc')
    expect(q.has('facets')).toBe(false)
  })

  it('toggles a facet value and returns to page 1', () => {
    const s = stateFromQuery(new URLSearchParams('page=4&format=CSV'))
    expect(toggleFacet(s, 'format', 'CSV')).toMatchObject({ page: 1, facets: {} })
    expect(toggleFacet(s, 'format', 'JSON').facets).toEqual({ format: ['CSV', 'JSON'] })
  })
})

describe('access levels', () => {
  it('maps dct:accessRights IRIs and hub-search labels', () => {
    expect(levelOf('http://publications.europa.eu/resource/authority/access-right/PUBLIC')).toBe('public')
    expect(levelOf('http://publications.europa.eu/resource/authority/access-right/RESTRICTED')).toBe('restricted')
    expect(levelOf('http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC')).toBe('internal')
    expect(levelOf('non_public')).toBe('internal')
    expect(levelOf('public')).toBe('public')
    expect(levelOf(null)).toBeNull()
    expect(levelOf('https://example.org/other')).toBeNull()
  })

  it('takes the stricter of record and catalogue', () => {
    expect(stricter('public', 'internal')).toBe('internal')
    expect(stricter('restricted', 'public')).toBe('restricted')
    expect(stricter(null, undefined)).toBe('public')
  })
})

describe('catalogue order', () => {
  it('puts published catalogues first, staging next, the external one last', () => {
    const list = ['6g-external', '6g-dali-staging-eur', '6g-dali-nitos', '6g-dali'].map(id => ({ id, title: id }))
    expect(sortCatalogues(list).map(c => c.id)).toEqual(['6g-dali', '6g-dali-nitos', '6g-dali-staging-eur', '6g-external'])
    expect(isStaging('6g-dali-staging-kul')).toBe(true)
    expect(isStaging('6g-dali-nitos')).toBe(false)
  })
})

describe('router', () => {
  it('parses path segments and the query', () => {
    const r = parseHash('#/catalogues/6g-dali-nitos?q=x&format=CSV')
    expect(r.path).toEqual(['catalogues', '6g-dali-nitos'])
    expect(r.query.getAll('format')).toEqual(['CSV'])
    expect(parseHash('').path).toEqual([])
    expect(parseHash('#/datasets/a%2Fb').path).toEqual(['datasets', 'a/b'])
  })
})
