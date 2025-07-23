<script setup lang="ts">
import { computed, toRefs, useAttrs } from 'vue'
import PhX from '~icons/ph/x'
import Typography from '../typography/Typography.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  label?: string
  removable?: boolean
  outline?: boolean
  light?: boolean
  small?: boolean
  interactive?: boolean
  disabled?: boolean
  unselected?: boolean
  icon?: string
  iconLeft?: boolean
  iconRight?: boolean
}>()

const { small, light, outline, interactive, disabled, unselected } = toRefs(props)

const isInteractive = computed(() => props.interactive || props.removable)
const hasIcon = computed(() => props.icon || props.iconLeft || props.iconRight)

const attrs = useAttrs()
const combinedAttrs = computed(() => {
  return {
    ...attrs,
    outline: props.outline,
    small: small.value,
    onClick: () => {},
  }
})
</script>

<template>
  <component
    :is="isInteractive ? 'button' : 'span'"
    :class="{
      'h-8 rounded-2xl bg-gray px-4 py-1 outline-hidden focus:ring-secondary focus:ring-offset-2': isInteractive,
    }"
    @click.prevent="$emit('click', $event)"
  >
    <div
      v-bind="combinedAttrs"
      :class="{
        'rounded-3xl bg-secondary px-4 py-1 text-neutral-100 dark:bg-[#015184] dark:text-white': !isInteractive,
      }"
    >
      <div
        class="
          flex min-w-fit flex-nowrap items-center gap-2 text-secondary-text
        " :class="{ 'flex-row-reverse': props.iconRight }"
      >
        <PhX v-if="props.removable && !hasIcon" />
        <i v-else-if="hasIcon" :class="props.icon || props.iconLeft || props.iconRight" />
        <slot>
          <Typography variant="by-copy-small-regular">
            {{ props.label }}
          </Typography>
        </slot>
      </div>
    </div>
  </component>
</template>
