<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCatalogueLogo } from '../../../composables/useCatalogueLogo'

const props = defineProps<{
  item: {
    id: string
    title: string
    description: string
  }
}>()

const { logoUrl, flagCode } = useCatalogueLogo(() => props.item.getId)
</script>

<template>
  <RouterLink :to="{ path: '/datasets', query: { catalog: item.getId } }" class="block h-full">
    <div
      class="
        group relative box-border flex h-full w-full flex-col gap-6 rounded-dali-md
        border-b-[3px] border-neutral-20 border-b-transparent bg-surface p-8
        text-surface-text hover:border-b-primary
      "
    >
      <!-- Top: logo or flag -->
      <div v-if="logoUrl || flagCode" class="flex h-20 shrink-0 items-center justify-center">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="item.getTitle"
          class="max-h-20 max-w-full object-contain"
          @error="logoUrl = null"
        />
        <img
          v-else-if="flagCode"
          :src="`https://flagcdn.com/w160/${flagCode}.png`"
          :alt="flagCode"
          class="max-h-16 rounded object-cover shadow-sm"
        />
      </div>

      <!-- Body: info -->
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <span class="font-sans text-[1.375rem] leading-[2rem] font-bold md:text-[1.5rem] md:leading-[2.25rem]">
          {{ item.getTitle ?? '' }}
        </span>
        <p class="line-clamp-6">
          {{ item.getDescription ?? '' }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>
