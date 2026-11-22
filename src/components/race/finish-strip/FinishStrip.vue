<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

interface Props {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'FinishStrip' })

const props = defineProps<Props>()
</script>

<template>
  <span
    data-slot="finish-strip"
    aria-hidden="true"
    :class="cn('finish-checkered h-8 w-1.5 shrink-0 rounded-[1px]', props.class)"
  />
</template>
