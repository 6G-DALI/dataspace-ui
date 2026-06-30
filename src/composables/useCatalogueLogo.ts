import type { MaybeRefOrGetter, Ref } from 'vue'
import { ref, toValue, watch } from 'vue'
import appConfig from '../../config/appConfig'
import eurStagingLogo from '../assets/images/eur.svg'

const FOAF_LOGO   = 'http://xmlns.com/foaf/0.1/logo'
const DCT_SPATIAL = 'http://purl.org/dc/terms/spatial'

const ALPHA3_TO_2: Record<string, string> = {
  AUT: 'at', BEL: 'be', BGR: 'bg', HRV: 'hr', CYP: 'cy', CZE: 'cz', DNK: 'dk',
  EST: 'ee', FIN: 'fi', FRA: 'fr', DEU: 'de', GRC: 'gr', HUN: 'hu', IRL: 'ie',
  ITA: 'it', LVA: 'lv', LTU: 'lt', LUX: 'lu', MLT: 'mt', NLD: 'nl', POL: 'pl',
  PRT: 'pt', ROU: 'ro', SVK: 'sk', SVN: 'si', ESP: 'es', SWE: 'se', GBR: 'gb',
  NOR: 'no', ISL: 'is', CHE: 'ch', USA: 'us', CAN: 'ca', JPN: 'jp', AUS: 'au',
  BRA: 'br', IND: 'in', CHN: 'cn', RUS: 'ru', KOR: 'kr', MEX: 'mx', ZAF: 'za',
}

// Per-catalogue logo overrides. When a catalogue id is listed here the bundled
// image is always used, regardless of the foaf:logo / dct:spatial metadata
// returned by the hub.
const LOGO_OVERRIDES: Record<string, string> = {
  '6g-dali-staging-eur': eurStagingLogo,
}

export interface UseCatalogueLogoReturn {
  /** Resolved logo image URL (override or foaf:logo), or null. */
  logoUrl: Ref<string | null>
  /** Two-letter country code for the flag fallback, or null. */
  flagCode: Ref<string | null>
  /** Catalogue title from the hub, or '' (overridable by the caller). */
  title: Ref<string>
}

/**
 * Resolves the logo for a catalogue. Resolution order:
 *   1. a static override (always wins, persists even if the hub is unreachable)
 *   2. the catalogue's foaf:logo from the hub
 *   3. a country flag derived from dct:spatial
 *
 * Accepts a reactive catalogue id and re-resolves whenever it changes.
 */
export function useCatalogueLogo(catalogueId: MaybeRefOrGetter<string | undefined>): UseCatalogueLogoReturn {
  const logoUrl  = ref<string | null>(null)
  const flagCode = ref<string | null>(null)
  const title    = ref<string>('')

  async function resolve(id: string | undefined) {
    logoUrl.value  = null
    flagCode.value = null
    title.value    = ''
    if (!id) return

    // Static override wins over hub metadata, and persists even if the hub is
    // unreachable. The title is still fetched below to label the logo.
    if (LOGO_OVERRIDES[id]) logoUrl.value = LOGO_OVERRIDES[id]

    try {
      const hubUrl = (appConfig as any).piveauHubRepoUrl
      const r = await fetch(`${hubUrl}catalogues/${id}`, {
        headers: { Accept: 'application/ld+json' },
      })
      if (!r.ok) return
      const data = await r.json()
      const graph: any[] = data['@graph'] || []
      const node = graph.find(n =>
        [].concat(n['@type'] || []).some((t: string) => t.includes('Catalog')),
      )
      if (!node) return

      // title
      const t = node['http://purl.org/dc/terms/title'] || node['dct:title']
      if (t) {
        const first = Array.isArray(t) ? t[0] : t
        title.value = first?.['@value'] || first || ''
      }

      // foaf:logo (skipped when a static override is in effect)
      const logo = node[FOAF_LOGO] || node['foaf:logo']
      if (logo && !logoUrl.value) {
        const first = Array.isArray(logo) ? logo[0] : logo
        logoUrl.value = first?.['@id'] || first?.['@value'] || (typeof first === 'string' ? first : null)
      }

      // dct:spatial → flag fallback
      if (!logoUrl.value) {
        const spatial = node[DCT_SPATIAL] || node['dct:spatial']
        if (spatial) {
          const first = Array.isArray(spatial) ? spatial[0] : spatial
          const uri = first?.['@id'] || (typeof first === 'string' ? first : '')
          const alpha3 = uri.split('/').pop()?.toUpperCase() || ''
          flagCode.value = ALPHA3_TO_2[alpha3] || null
        }
      }
    }
    catch { /* silent */ }
  }

  watch(() => toValue(catalogueId), resolve, { immediate: true })

  return { logoUrl, flagCode, title }
}