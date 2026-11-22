<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

interface Props {
  number: number
  color: string
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'RunnerNumberMarker' })

const props = defineProps<Props>()
</script>

<template>
  <span
    data-slot="runner-number-marker"
    :class="
      cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white tabular-nums shadow-sm',
        props.class,
      )
    "
    :style="{ backgroundColor: color }"
  >
    {{ number }}
  </span>
</template>
