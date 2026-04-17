<script setup lang="ts">
import type { PropertyTableEntryNode } from '@piveau/sdk-vue'
import { computed } from 'vue'
import LinkedDataSelector from '../base/links/LinkedDataSelector.vue'
import KTag from '../base/tag/KTag.vue'
import Typography from '../base/typography/Typography.vue'
import DataToggler from '../data-toggler/DataToggler.vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { PropertyTable } from '../property-table/PropertyTableRow'

interface CardProps {
  title: string
  description: string
  format: string
  downloadText?: string
  saveText?: string
  lastUpdated?: string
  downloadUrl: string
  linkedData?: Record<string, any>
  distributionId: string
  data: PropertyTableEntryNode
  showDropdown?: boolean
  onSave?: () => void
}
const props = withDefaults(defineProps<CardProps>(), {
  downloadText: 'Download',
  saveText: 'Linked Data',
  showDropdown: false,
  onSave: () => { },
})

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
      <div class="flex items-start justify-between">
        <Typography as="h2" variant="header-4" class="text-surface-text">
          {{ title }}
        </Typography>
        <KTag class="
            hidden
            md:block
            text-sm
          ">
          {{ format }}
        </KTag>
      </div>

      <div class="
          my-0 flex flex-col
          lg:flex-row lg:justify-between lg:gap-28
        ">
        <div class="flex flex-1 flex-col gap-6">
          <div class="markdown-content mt-4 text-sm leading-6 text-surface-light" v-html="description" />
          <div class="flex">
            <KTag class="md:hidden">
              {{ format }}
            </KTag>
          </div>
        </div>

        <div class="
            text-surface-text
            lg:my-0 lg:basis-4/12
          ">
          <DataToggler v-slot="{ truncated }" :data="resolvedData || []" :limit="1" :expanded="false" class="text-sm">
            <PropertyTable :node="{
              id: 'root',
              label: '',
              type: 'node',
              isRoot: true,
              data: truncated,
            }" />
          </DataToggler>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex gap-4">
          <a :href="downloadUrl" target="_blank" nofollow noreferrer download
            class="text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover active:bg-primary dark:active:bg-primary-dark-pressed rounded-3xl border-transparent inline-flex min-w-fit items-center justify-center text-center font-medium align-bottom h-8 text-sm px-5 py-5">
            {{ defaultDownloadText }}
            <i class="icon-[ph--arrow-square-out] ml-2" />
          </a>

          <LinkedDataSelector :show-dropdown="showDropdown" resource-id="distributionId" :indist="true" resource="distributions"
            button-class="text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover active:bg-primary dark:active:bg-primary-dark-pressed rounded-3xl border-transparent inline-flex min-w-fit items-center justify-center text-center font-medium align-bottom h-8 text-sm px-5 py-5"
            @toggle="$emit('toggle')" />

          <Dropdown severity="secondary" :label="defaultSaveText">
            <DropdownItem v-for="[key, uri] in Object.entries(linkedData || {})" :key="key" as="a" :href="uri"
              target="_blank">
              {{ key }}
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
