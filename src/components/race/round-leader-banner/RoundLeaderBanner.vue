<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Timer } from '@lucide/vue'
import { cn } from 'cn'
import Badge from '@/components/ui/badge/Badge.vue'

interface Props {
  name: string
  number: number
  color: string
  lap: number
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'RoundLeaderBanner' })

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="round-leader-banner"
    :class="
      cn(
        'flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-3.5 py-2.5',
        props.class,
      )
    "
  >
    <div class="flex min-w-0 items-center gap-2">
      <Timer class="size-[15px] shrink-0 text-brand" aria-hidden="true" />
      <span class="truncate text-[13px] text-muted-foreground">Round Leader:</span>
      <span class="inline-flex min-w-0 items-center gap-1.5">
        <span
          class="size-2 shrink-0 rounded-full"
          :style="{ backgroundColor: color }"
          aria-hidden="true"
        />
        <span class="truncate text-[13px] font-semibold text-foreground">
          {{ name }} (#{{ number }})
        </span>
      </span>
    </div>
    <Badge variant="accent" class="shrink-0">Lap {{ lap }}</Badge>
  </div>
</template>
