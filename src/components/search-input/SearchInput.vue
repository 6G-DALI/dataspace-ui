<script setup lang="ts">
import type { SelectOptionList } from '../../utils/types'

const props = defineProps<{
  placeholder?: string
  selectPlaceholder?: string
  selectOptions?: SelectOptionList
  disableDropdown?: boolean
}>()

const searchValue = defineModel<string>()
</script>

<template>
  <input
    v-model="searchValue"
    :placeholder="props.placeholder"
    size="small"
    class="
      custom-input border bg-surface-0 text-surface-800
      focus:outline-hidden
      dark:bg-surface-900 dark:text-surface-200
    "
  >
</template>

<style scoped>
.custom-input {
  border: 0.3px solid #dedede;
  border-radius: 100px !important;
  padding-left: 1rem;
}
</style>
