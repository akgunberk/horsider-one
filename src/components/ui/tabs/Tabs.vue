<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'

defineOptions({ name: 'UiTabs' })

const props = defineProps<TabsRootProps>()
const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-slot="slotProps" v-bind="forwarded" data-slot="tabs">
    <slot v-bind="slotProps" />
  </TabsRoot>
</template>
