<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const resolvedAttrs = computed(() => ({ ...useAttrs() }))
</script>

<template>
  <div
    v-bind="resolvedAttrs"
    class="
      p-card p-component border-bg-divider size-96 rounded-lg border
      bg-surface-0 leading-7 text-content
      dark:bg-surface-900 dark:text-surface-0
    "
  >
    <div
      class="p-card-body p-6 text-center"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
