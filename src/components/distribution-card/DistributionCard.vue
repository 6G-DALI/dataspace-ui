<script setup lang="ts">
import type { PropertyTableEntryNode } from '@piveau/sdk-vue'
import { computed } from 'vue'
import LinkedDataSelector from '../base/links/LinkedDataSelector.vue'
import KTag from '../base/tag/KTag.vue'
import Typography from '../base/typography/Typography.vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import GXQualityPanel from '../gx-quality/GXQualityPanel.vue'
import { PropertyTable } from '../property-table/PropertyTableRow'

interface CardProps {
  title: string
  description: string
  format: string
  downloadText?: string
  saveText?: string
  lastUpdated?: string
  downloadUrl: string
  accessUrl?: string
  assetId?: string
  connectorType?: string
  variableMeasured?: string[]
  linkedData?: Record<string, any>
  distributionId: string
  data: PropertyTableEntryNode
  showDropdown?: boolean
  onSave?: () => void
  issued?: string
  byteSize?: number | null
  license?: { label?: string, resource?: string } | null
  mediaType?: string
  language?: { label?: string } | null
  checksum?: { checksum_value?: string } | null
  compressFormat?: { label?: string } | null
}
const props = withDefaults(defineProps<CardProps>(), {
  downloadText: 'Download',
  saveText: 'Linked Data',
  showDropdown: false,
  onSave: () => { },
})

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatDate(d?: string): string {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-GB') } catch { return d }
}

defineEmits(['toggle'])

const dataOrder = ['modified', 'license', 'created', 'languages']
const resolvedData = computed(() => {
  const sortedData = [...props.data.data || []].sort((a, b) => {
    const aIndex = dataOrder.indexOf(a.id) === -1 ? dataOrder.length : dataOrder.indexOf(a.id)
    const bIndex = dataOrder.indexOf(b.id) === -1 ? dataOrder.length : dataOrder.indexOf(b.id)
    return aIndex - bIndex
  })

  return sortedData
})

//properties for button text
const defaultDownloadText = computed(() => props.downloadText || 'Download')
const defaultSaveText = computed(() => props.saveText || 'Linked Data')
</script>

<template>
  <div class="rounded-xl border-b-none bg-surface p-4 mt-6">
    <div>
      <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <Typography as="h2" variant="header-4" class="text-surface-text">
          {{ title }}
        </Typography>
        <div class="flex flex-wrap items-center gap-3">
          <KTag class="text-sm" v-if="mediaType">
            {{ mediaType }}
          </KTag>

          <a v-if="downloadUrl" :href="downloadUrl" target="_blank" nofollow noreferrer download
            class="text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover active:bg-primary dark:active:bg-primary-dark-pressed rounded-dali-md border-transparent inline-flex min-w-fit items-center justify-center text-center font-medium align-bottom text-sm px-4 py-1">
            {{ defaultDownloadText }}
            <i class="icon-[ph--arrow-square-out] ml-2" />
          </a>

          <LinkedDataSelector :show-dropdown="showDropdown" :resource-id="distributionId" :indist="true" resource="distributions"
            button-class="text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover active:bg-primary dark:active:bg-primary-dark-pressed rounded-dali-md border-transparent inline-flex min-w-fit items-center justify-center text-center font-medium align-bottom text-sm px-4 py-1"
            @toggle="$emit('toggle')" />

          <Dropdown severity="secondary" :label="defaultSaveText">
            <DropdownItem v-for="[key, uri] in Object.entries(linkedData || {})" :key="key" as="a" :href="uri"
              target="_blank">
              {{ key }}
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div class="
          my-0 flex flex-col
          lg:flex-row lg:justify-between lg:gap-28
        ">
        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <div class="markdown-content mt-4 text-sm leading-6 text-surface-light" v-html="description" />
        </div>
      </div>

      <!-- Extra metadata row -->
      <div class="mt-3 mb-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-surface-light">
        <span v-if="formatBytes(byteSize)">
          <span class="font-medium text-surface-text">Size:</span> {{ formatBytes(byteSize) }}
        </span>
        <span v-if="mediaType">
          <span class="font-medium text-surface-text">Media type:</span> {{ mediaType }}
        </span>
        <span v-if="compressFormat?.label">
          <span class="font-medium text-surface-text">Compression:</span> {{ compressFormat.label }}
        </span>
        <span v-if="license?.label || license?.resource">
          <span class="font-medium text-surface-text">License:</span>
          <a v-if="license.resource" :href="license.resource" target="_blank" rel="noopener"
             class="ml-1 text-primary hover:underline">{{ license.label || license.resource }}</a>
          <span v-else class="ml-1">{{ license.label }}</span>
        </span>
        <span v-if="language?.label">
          <span class="font-medium text-surface-text">Language:</span> {{ language.label }}
        </span>
        <span v-if="issued">
          <span class="font-medium text-surface-text">Issued:</span> {{ formatDate(issued) }}
        </span>
        <span v-if="lastUpdated">
          <span class="font-medium text-surface-text">Updated:</span> {{ formatDate(lastUpdated) }}
        </span>
        <span v-if="checksum?.checksum_value">
          <span class="font-medium text-surface-text">Checksum:</span>
          <code class="ml-1 text-[10px]">{{ checksum.checksum_value.slice(0, 16) }}…</code>
        </span>
        <span v-if="connectorType">
          <span class="font-medium text-surface-text">Connector type:</span> {{ connectorType }}
        </span>
        <span v-if="assetId">
          <span class="font-medium text-surface-text">Asset ID:</span>
          <code class="ml-1 text-[10px]">{{ assetId }}</code>
        </span>
        <span v-if="accessUrl" class="min-w-0">
          <span class="font-medium text-surface-text">Access URL:</span>
          <a :href="accessUrl" target="_blank" rel="noopener"
             class="ml-1 break-all text-primary hover:underline">{{ accessUrl }}</a>
        </span>
      </div>

      <div v-if="variableMeasured?.length" class="mb-3 flex flex-wrap items-center gap-2 text-xs text-surface-light">
        <span class="font-medium text-surface-text">Variables measured:</span>
        <KTag v-for="v in variableMeasured" :key="v" class="text-xs">{{ v }}</KTag>
      </div>

      <GXQualityPanel :distribution-id="distributionId" />
    </div>
  </div>
</template>
