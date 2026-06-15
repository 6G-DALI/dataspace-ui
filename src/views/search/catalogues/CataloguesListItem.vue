<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import appConfig from '../../../../config/appConfig'

const props = defineProps<{
  item: {
    id: string
    title: string
    description: string
  }
}>()

const FOAF_LOGO   = 'http://xmlns.com/foaf/0.1/logo'
const DCT_SPATIAL = 'http://purl.org/dc/terms/spatial'

const ALPHA3_TO_2: Record<string, string> = {
  AUT:'at', BEL:'be', BGR:'bg', HRV:'hr', CYP:'cy', CZE:'cz', DNK:'dk',
  EST:'ee', FIN:'fi', FRA:'fr', DEU:'de', GRC:'gr', HUN:'hu', IRL:'ie',
  ITA:'it', LVA:'lv', LTU:'lt', LUX:'lu', MLT:'mt', NLD:'nl', POL:'pl',
  PRT:'pt', ROU:'ro', SVK:'sk', SVN:'si', ESP:'es', SWE:'se', GBR:'gb',
  NOR:'no', ISL:'is', CHE:'ch', USA:'us', CAN:'ca', JPN:'jp', AUS:'au',
  BRA:'br', IND:'in', CHN:'cn', RUS:'ru', KOR:'kr', MEX:'mx', ZAF:'za',
}

const logoUrl  = ref<string | null>(null)
const flagCode = ref<string | null>(null)

onMounted(async () => {
  try {
    const hubUrl = (appConfig as any).piveauHubRepoUrl
    const r = await fetch(`${hubUrl}catalogues/${props.item.getId}`, {
      headers: { Accept: 'application/ld+json' },
    })
    if (!r.ok) return
    const data = await r.json()
    const graph: any[] = data['@graph'] || []
    const node = graph.find(n =>
      [].concat(n['@type'] || []).some((t: string) => t.includes('Catalog'))
    )
    if (!node) return

    // foaf:logo
    const logo = node[FOAF_LOGO] || node['foaf:logo']
    if (logo) {
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
  } catch { /* silent */ }
})
</script>

<template>
  <RouterLink :to="{ path: '/datasets', query: { catalog: item.getId } }">
    <div
      class="
        group relative mx-auto mb-6 box-border w-full rounded-3xl border-b-[3px]
        border-neutral-20 border-b-transparent bg-surface p-12
        hover:border-b-primary
      "
    >
      <div class="flex items-start gap-8 text-surface-text">
        <!-- Left: logo or flag -->
        <div v-if="logoUrl || flagCode" class="flex w-32 shrink-0 items-center justify-center">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="item.getTitle"
            class="max-h-20 max-w-[8rem] object-contain"
            @error="logoUrl = null"
          />
          <img
            v-else-if="flagCode"
            :src="`https://flagcdn.com/w160/${flagCode}.png`"
            :alt="flagCode"
            class="max-h-16 max-w-[8rem] rounded object-cover shadow-sm"
          />
        </div>

        <!-- Right: info -->
        <div class="flex min-w-0 flex-1 flex-col gap-4">
          <span class="font-sans text-[1.375rem] leading-[2rem] font-bold md:text-[1.5rem] md:leading-[2.25rem]">
            {{ item.getTitle ?? '' }}
          </span>
          <p class="line-clamp-6">
            {{ item.getDescription ?? '' }}
          </p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
