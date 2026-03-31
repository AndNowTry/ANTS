<script setup>
import { GetIcon } from "@/utils/icons.js"


const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div>
    <template v-for="(item, index) in modelValue" :key="index">
      <div
          v-if="item && item.file"
          class="px-3 py-2"
          style="border-bottom: 0.5px solid rgba(0,0,0,0.1)"
      >
        <div class="d-flex align-center gap-3">
          <VAvatar color="secondary">
            <VIcon :icon="GetIcon(item.file.name)" />
          </VAvatar>

          <div style="flex: 1; min-width: 0">
            <div class="text-body-2 text-truncate">{{ item.file.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.file_type_need }}</div>
          </div>

          <VChip v-if="item.status === 'done'" color="success" prepend-icon="mdi-check">Done</VChip>
          <VChip v-else-if="item.status === 'error'" color="error">Error</VChip>
          <VChip v-else color="secondary">{{ item.status ?? 'Waiting' }}</VChip>
        </div>

        <VProgressLinear
            v-if="item.status && item.status !== 'done' && item.status !== 'error'"
            :model-value="item.progress"
            :indeterminate="item.status === 'pending'"
            color="primary"
            height="3"
            rounded
            class="mt-2"
        />
      </div>
    </template>
  </div>
</template>