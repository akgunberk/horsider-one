<script setup lang="ts">
import type { TabsListProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'
import { TabsList, useForwardProps } from 'reka-ui'

defineOptions({ name: 'UiTabsList' })

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex h-9 w-fit items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
