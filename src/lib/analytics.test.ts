import { describe, expect, it } from 'vitest'
import { pageLocation } from './analytics'

describe('pageLocation', () => {
  it('keeps the hash route and drops the query string, which holds Keycloak\'s code after sign-in', () => {
    expect(pageLocation({ origin: 'https://catalogue.6gdali.eu', pathname: '/', hash: '#/datasets/abc?q=water' }))
      .toBe('https://catalogue.6gdali.eu/#/datasets/abc?q=water')
  })
})
