<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'
import type { BadgeVariants } from '.'
import { badgeVariants } from '.'

interface Props {
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'UiBadge' })

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span data-slot="badge" :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>
