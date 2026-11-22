<script setup lang="ts">
interface Props {
  rank: number
  name: string
  color: string
  /** Static condition, 1-100. */
  condition: number
}

defineOptions({ name: 'HorseRosterRow' })

defineProps<Props>()
</script>

<template>
  <div data-slot="horse-roster-row" class="flex items-center justify-between gap-2">
    <div class="flex min-w-0 items-center gap-2">
      <span class="w-5 shrink-0 text-right text-[13px] text-muted-foreground tabular-nums">
        {{ rank }}
      </span>
      <span
        class="size-2 shrink-0 rounded-full"
        :style="{ backgroundColor: color }"
        aria-hidden="true"
      />
      <span class="truncate text-[13px] text-foreground">{{ name }}</span>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <div class="h-1 w-10 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div class="h-full rounded-full bg-primary" :style="{ width: `${condition}%` }" />
      </div>
      <span class="w-5 text-right text-[11px] font-medium text-foreground tabular-nums">
        {{ condition }}
      </span>
    </div>
  </div>
</template>
